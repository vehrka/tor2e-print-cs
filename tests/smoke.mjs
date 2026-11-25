// Runs inside the Foundry page (imported by tools/smoke.mjs). Default export: [{id, what, actual, expected, pass}].
const MODULE_ID = 'tor2eprint';
const results = [];
const check = (id, what, actual, expected) => results.push({ id, what, actual, expected, pass: actual === expected });
const wait = ms => new Promise(r => setTimeout(r, ms));

// Environment.
check('S0', 'module active', game.modules.get(MODULE_ID)?.active ?? false, true);
check('S1', 'system is tor2e', game.system.id, 'tor2e');
const sysRel = game.modules.get(MODULE_ID)?.relationships.systems.find(r => r.id === 'tor2e');
check('S2', 'running system version is the verified one (module.json)', game.system.version, sysRel?.compatibility.verified);

// Fixture heroes (fixtures/, seeded by tools/smoke.mjs).
const hero = game.actors.getName('Arvegil');
check('F0', 'fixture hero present', hero?.type, 'character');

// Print control.
const ACTION = 'tor2eprint-btn';
const hookControls = doc => {
    const controls = [];
    Hooks.callAll('getHeaderControlsApplicationV2', { document: doc }, controls);
    return controls.some(c => c.action === ACTION);
};
const adversary = new Actor.implementation({ name: 'smoke adversary', type: 'adversary' });
check('P0', 'print control offered for character', hookControls(hero), true);
check('P1', 'no print control for adversary', hookControls(adversary), false);

const sheet = hero.sheet;
await sheet.render({ force: true });
// Header controls sit in the collapsed overflow menu; the renderActorSheetV2 fallback injects a header button.
const control = sheet.element.querySelector(`.window-header .${ACTION}, .window-header [data-action="${ACTION}"]`);
check('P2', 'print control rendered in character sheet header', !!control, true);

// Print window: click the control, window opens for the actor, print() runs once.
const printWindows = () => [...foundry.applications.instances.values()]
    .filter(a => a.constructor.name === 'Tor2eCharacterPrint' && a.actor === hero);
const realPrint = window.print;
let prints = 0;
window.print = () => { prints++; };
try {
    control?.click();
    await wait(800);
    const win = printWindows()[0];
    check('P3', 'click opens print window for the actor', !!win?.rendered, true);
    const formats = [...(win?.element.querySelectorAll('[data-action="format"]') ?? [])].map(b => b.dataset.format);
    check('P4', 'window opens with format toolbar + hint, no sheet, no print',
        [formats.join(','), !!win?.element.querySelector('.tor2e-print-hint'), !!win?.element.querySelector('.tor2e-print'), prints].join('|'), 'classic|true|false|0');
    const shown = [];
    for (const f of formats) {
        win.element.querySelector(`[data-action="format"][data-format="${f}"]`).click();
        await wait(600);
        if (win.element.querySelector('.tor2e-print') && win.element.querySelector(`[data-format="${f}"].active`)) shown.push(f);
    }
    check('P5', 'each format renders, marked active, prints once per pick', `${shown.join(',')}|${prints}`, `${formats.join(',')}|${formats.length}`);
    win.element.querySelector('[data-action="format"]').click();
    await wait(600);
    await win.render();
    await wait(500);
    check('P8', 'picking again reprints once; plain re-render does not print', prints, formats.length + 1);
    check('P6', 'no raw i18n keys in print window', /TOR2EPRINT\.|tor2e\./.test(win?.element.textContent ?? 'TOR2EPRINT.'), false);
    // Enriched links/rolls print as bold plain text (no pill, no icon).
    const probe = win.element.querySelector('.tor2e-print').appendChild(Object.assign(document.createElement('p'), {
        innerHTML: '<a class="content-link"><i class="fas fa-book"></i>Link</a><a class="inline-roll"><i class="fas fa-dice-d20"></i>1d6</a>'
    }));
    check('P7', 'content links and inline rolls: no background, no icon, bold',
        [...probe.querySelectorAll('a')].map(a => [getComputedStyle(a).backgroundColor, getComputedStyle(a.querySelector('i')).display, getComputedStyle(a).fontWeight].join(' ')).join(' | '),
        'rgba(0, 0, 0, 0) none 700 | rgba(0, 0, 0, 0) none 700');
    probe.remove();
} finally {
    window.print = realPrint;
    for (const w of printWindows()) await w.close();
    await sheet.close();
}

// Print context mapper (Tor2eCharacterPrint._prepareContext), compared with the fixture heroes.
const FIXTURES = ['Adelbard Tuck-Baggings', 'Arvegil', 'Gartphen', 'Hakkon Finnsson', 'Hans Grimald', 'Otrebør', 'Smoke Effect'];
const OVERLONG = game.actors.find(a => a.name.startsWith('Smoke Overlong'))?.name;
const missing = [...FIXTURES, OVERLONG].filter(n => game.actors.getName(n ?? '')?.type !== 'character');
check('F1', 'all fixture heroes present', missing.join(', ') || 'all', 'all');
const { Tor2eCharacterPrint } = await import(`/modules/${MODULE_ID}/modules/apps/character-print.mjs?${Date.now()}`);
const contextOf = async name => {
    const app = new Tor2eCharacterPrint({ document: game.actors.getName(name) });
    app.format = 'classic';
    return app._prepareContext({});
};
const names = list => (list ?? []).map(x => x.name).join(', ');
const attrs = c => Object.entries(c.attributes).map(([k, v]) => `${k}:${v.value}/${v.tn}`).join(' ');
const skills = c => c.skills.map(s => `${s.key}:${s.value}${s.favoured ? '*' : ''}${s.magical ? 'M' : ''}`).join(' ');
const ca = await contextOf('Arvegil');
check('C0', 'Arvegil identity', [ca.name, ca.callingLabel, ca.standardOfLivingLabel].join('|'), 'Arvegil|Messenger|Frugal');
check('C1', 'Arvegil attributes (rating/TN)', attrs(ca), 'strength:8/12 heart:5/15 wits:2/18');
check('C2', 'Arvegil skills (pips, *favoured)', skills(ca),
    'awe:1* enhearten:1 persuade:0 athletics:2 travel:2* stealth:2* awareness:2 insight:0 scan:1 explore:2 healing:2 hunting:2* song:0 courtesy:0 riddle:0 craft:0 battle:3* lore:2');
check('C3', 'Arvegil skill pips filled = value', ca.skills.every(s => s.pips.filter(p => p.filled).length === s.value), true);
check('C4', 'Arvegil combat proficiencies', ca.proficiencies.map(p => `${p.key}:${p.value}`).join(' '), 'axes:1 swords:0 spears:3 bows:0');
check('C5', 'Arvegil weapons (dmg/inj/load)', ca.weapons.map(w => `${w.name}|${w.damage}|${w.injury}|${w.load}`).join('; '),
    'Spear (1h) (G)|5|14|3; Spear (2h) (G)|5|16|0; Dagger|2|14|0');
check('C6', 'Arvegil armour (prot/load)', ca.armours.map(a => `${a.name}|${a.protection}|${a.load}`).join('; '), 'Leather Corslet|2|6; Helm|1|4');
check('C7', 'Arvegil virtues / rewards / traits', `${names(ca.virtues)} / ${names(ca.rewards)} / ${names(ca.traits)}`,
    'MASTERY / GRIEVOUS (WEAPON) / BOLD, SUBTLE, FOLK-LORE');
check('C8', 'Arvegil endurance / hope / valour+wisdom',
    [`${ca.resources.endurance.value}/${ca.resources.endurance.max}`, `${ca.resources.hope.value}/${ca.resources.hope.max}`, `${ca.stature.valour.value}/${ca.stature.wisdom.value}`].join(' '), '28/28 11/11 1/1');
const co = await contextOf('Otrebør');
check('C9', 'Otrebør (non-ASCII) name, attributes, weapons', [co.name, attrs(co), names(co.weapons)].join('|'),
    'Otrebør|strength:6/14 heart:4/16 wits:5/15|Bow, Dagger, Spear (1h) [K], Spear (2h)');
const cad = await contextOf('Adelbard Tuck-Baggings');
check('C10', 'Adelbard item AE: Hope max prepared (16), not _source (15)', cad.resources.hope.max, 16);
const ce = await contextOf('Smoke Effect');
check('C11', 'actor AE on attribute + skill: print shows prepared value (Wits 3/TN 17, Lore 3)',
    `${ce.attributes.wits.value}/${ce.attributes.wits.tn} ${ce.skills.find(s => s.key === 'lore').value}`, '3/17 3');

// Enrichment (task-2): GM (owner) printing never shows secrets; relative @UUID and @attr inline rolls resolve.
const arvegil = game.actors.getName('Arvegil');
const dagger = arvegil.items.getName('Dagger');
const notesBefore = arvegil._source.system.history.notes.value;
await arvegil.update({ 'system.history.notes.value':
    `<section class="secret" id="secret-smoke"><p>SECRET-SMOKE</p></section><p>[[/r 1d6 + @attributes.strength.value]] @UUID[.Item.${dagger.id}]{Rel}</p>` });
let notes;
try {
    notes = Object.assign(document.createElement('div'), { innerHTML: (await contextOf('Arvegil')).history.notes });
} finally {
    await arvegil.update({ 'system.history.notes.value': notesBefore });
}
check('E0', 'history: secret hidden, @attr roll resolved, relative @UUID resolved',
    [notes.textContent.includes('SECRET-SMOKE'), notes.querySelector('a.inline-roll')?.textContent.trim(), (a => a && !a.classList.contains('broken') && a.textContent.trim())(notes.querySelector('a.content-link'))].join('|'),
    'false|1d6 + 8|Rel');

// Print CSS loaded. Foundry may wrap module styles in @layer/@import; walk grouping rules down to @media print.
const walk = (rules, inPrint = false) => [...rules].flatMap(r => {
    if (r instanceof CSSImportRule) return r.styleSheet ? walk(r.styleSheet.cssRules, inPrint) : [];
    if (r instanceof CSSMediaRule) return walk(r.cssRules, inPrint || r.media.mediaText === 'print');
    if (r instanceof CSSGroupingRule) return walk(r.cssRules, inPrint);
    return inPrint && r.selectorText ? [r.selectorText] : [];
});
const printRules = [...document.styleSheets].flatMap(s => { try { return walk(s.cssRules); } catch { return []; } });
check('K0', 'print CSS hides Foundry chrome', printRules.some(s => s?.includes(':not(:has(.tor2e-print))')), true);
check('K1', 'print CSS hides the format toolbar', printRules.some(s => s?.includes('.tor2e-print-toolbar')), true);

// Fit (tools/smoke.mjs prints each to PDF): typical heroes fit one page; long ones may flow (task-19), reported only.
// Hans Grimald (14 rewards/virtues/traits) is a long hero: 2 pages.
const LONG = { 'Hans Grimald': 2 };
export const pdfChecks = [
    ...FIXTURES.map((actor, i) => ({ id: `G${i}`, what: `${actor} prints on ${LONG[actor] ?? 1} page(s)`, actor, format: 'classic', pages: LONG[actor] ?? 1 })),
    // 20 rewards make the rewards/virtues/traits block taller than a page: it has to split.
    { id: 'G9', what: 'overlong hero flows: page count', actor: OVERLONG, format: 'classic', pages: null, allowTall: true }
];

export default results;
