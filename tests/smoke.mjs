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
check('P10', 'header button uses the Foundry tooltip (data-tooltip, no title)', `${control?.dataset.tooltip}|${control?.hasAttribute('title')}`, 'Print Sheet|false');

// Print window: click the control, window opens for the actor, print() runs once.
const printWindows = () => [...foundry.applications.instances.values()]
    .filter(a => a.constructor.name === 'Tor2eCharacterPrint' && a.actor === hero);
const realPrint = window.print;
let prints = 0;
let imagesSettled = null;
window.print = () => { prints++; imagesSettled = [...document.querySelectorAll('.tor2e-print img')].every(i => i.complete); };
try {
    control?.click();
    await wait(800);
    const win = printWindows()[0];
    check('P3', 'click opens print window for the actor', !!win?.rendered, true);
    const formats = [...(win?.element.querySelectorAll('[data-action="format"]') ?? [])].map(b => b.dataset.format);
    check('P4', 'window opens with format toolbar + hint, no sheet, no print',
        [formats.join(','), !!win?.element.querySelector('.tor2e-print-hint'), !!win?.element.querySelector('.tor2e-print'), prints].join('|'), 'classic,form|true|false|0');
    const shown = [];
    for (const f of formats) {
        win.element.querySelector(`[data-action="format"][data-format="${f}"]`).click();
        await wait(600);
        if (win.element.querySelector('.tor2e-print') && win.element.querySelector(`[data-format="${f}"].active`)
        && !/TOR2EPRINT\.|tor2e\./.test(win.element.textContent)) shown.push(f);
    }
    check('P5', 'each format renders (no raw i18n keys), marked active, prints once per pick', `${shown.join(',')}|${prints}`, `${formats.join(',')}|${formats.length}`);
    check('P9', 'print waits until every image settled (Arvegil portrait 404s: decode fails, print still runs)', imagesSettled, true);
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
const arvegilSrc = game.actors.getName('Arvegil')._source;
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

// Form layout context (task-23). Expected values: task-22 notes (tor2e sheet on the same heroes).
const fa = ca, fh = await contextOf('Hakkon Finnsson'), fd = await contextOf('Adelbard Tuck-Baggings');
const gear = c => ['armour', 'helm', 'shield'].map(k => c.gear[k].empty ? '-' : `${c.gear[k].name}:${c.gear[k].protection}/${c.gear[k].load}`).join(', ');
check('C12', 'form: points, treasure, distinctive features (Arvegil)',
    [fa.points.adventure, fa.points.skill, fa.treasure, fa.distinctiveFeatures.join(', ')].join('|'),
    [arvegilSrc.system.adventurePoints.value, arvegilSrc.system.skillPoints.value, arvegilSrc.system.treasure.value, 'BOLD, SUBTLE, FOLK-LORE'].join('|'));
check('C13', 'form: load / parry / protection (Arvegil)', `${fa.load.items}+${fa.load.fatigue} ${fa.parry.base}/${fa.parry.shield}/${fa.parry.total} ${fa.protection}`, '13+5 16/0/16 3');
check('C14', 'form: AE shield parry + shield (Hakkon)', `${fh.parry.base}/${fh.parry.shield}/${fh.parry.total} ${fh.protection} ${fh.load.items}`, '16/5/24 5 20');
check('C15', 'form: gear rows (Hakkon / Adelbard)', `${gear(fh)} | ${gear(fd)}`,
    'Coat of Mail:4/10, Helm:1/4, Golden Shield of Eregion:5/1 | Leather Corslet:2/6, -, Buckler (SMALL FOLK):4/2');
check('C16', 'form: stale stateOfHealth.wounded ignored without Wounded status (Adelbard)',
    `${JSON.stringify(fd.conditions)} ${fd.injury}`, '{"weary":false,"miserable":false,"wounded":false,"poisoned":false} null');
check('C17', 'form: proficiencies in order axes, bows, spears, swords', fa.formProficiencies.map(p => p.key).join(','), 'axes,bows,spears,swords');
const fo = await contextOf(OVERLONG);
check('C18', 'slots(): weapons 4, useful items 6, short and long lists padded/cut',
    [fa.weaponSlots.length, fa.weaponSlots.filter(w => w.empty).length, fa.usefulItems.length, fo.weaponSlots.length, fo.weaponSlots.some(w => w.empty), fo.usefulItems.length].join('|'),
    `4|1|6|4|false|6`);

{
    const a = game.actors.getName('Arvegil');
    const woundedBefore = a._source.system.stateOfHealth.wounded.value;
    let c;
    try {
        await a.addStatusEffectById('weary');
        await a.addStatusEffectById('wounded');
        await a.update({ 'system.stateOfHealth.wounded.value': 3 });
        c = await contextOf('Arvegil');
    } finally {
        await a.deleteStatusEffectById('weary');
        await a.deleteStatusEffectById('wounded');
        await a.update({ 'system.stateOfHealth.wounded.value': woundedBefore });
    }
    check('C19', 'form: conditions follow token statuses; injury printed while wounded',
        `${Object.entries(c.conditions).filter(([, v]) => v).map(([k]) => k).join(',')} ${c.injury}`, 'weary,wounded 3');
}

// Classic traits split (task-6): Distinctive Features / Flaws lists, empty group hidden.
{
    const CLASSIC = `modules/${MODULE_ID}/templates/actors/character-print.hbs`;
    const heads = async ctx => [...Object.assign(document.createElement('div'), { innerHTML: await foundry.applications.handlebars.renderTemplate(CLASSIC, ctx) })
        .querySelectorAll('.tp-rewards-virtues h2')].map(h => h.textContent.trim()).join(',');
    const withFlaw = { ...ca, traitGroups: { features: ca.traitGroups.features.slice(1), flaws: ca.traitGroups.features.slice(0, 1) } };
    check('T5', 'classic traits: features only (fixtures have no flaw) / features + flaws',
        `${ca.traitGroups.features.length}:${ca.traitGroups.flaws.length} ${await heads(ca)} / ${await heads(withFlaw)}`,
        '3:0 Rewards,Virtues,Distinctive Features / Rewards,Virtues,Distinctive Features,Flaws');
}

// Classic endurance block (task-7): current, item load, fatigue, total load (sheet values, task-22 notes).
{
    const CLASSIC = `modules/${MODULE_ID}/templates/actors/character-print.hbs`;
    const el = Object.assign(document.createElement('div'), { innerHTML: await foundry.applications.handlebars.renderTemplate(CLASSIC, fh) });
    const cell = [...el.querySelectorAll('.tp-resource-cell')].find(c => c.querySelector('h3')?.textContent.trim() === 'Endurance');
    check('T6', 'classic endurance: max, current, load, fatigue, total load (Hakkon)',
        [...cell.querySelectorAll('.tp-resource-big, .tp-resource-sub span')].map(e => e.textContent.trim()).join(' | '),
        '27 | Current: 27 | Load: 20 | Fatigue: 0 | Total Load: 22');
}

// Form layout template (task-24), Arvegil plus a magical skill and a Poisoned/Wounded state.
{
    const FORM = `modules/${MODULE_ID}/templates/actors/character-print-form.hbs`;
    const ctx = { ...ca, conditions: { ...ca.conditions, poisoned: true }, injury: 4,
        skillsByAttr: { ...ca.skillsByAttr, wits: ca.skillsByAttr.wits.map((sk, i) => ({ ...sk, magical: i === 0 })) } };
    const el = Object.assign(document.createElement('div'), { innerHTML: await foundry.applications.handlebars.renderTemplate(FORM, ctx) });
    const t = sel => [...el.querySelectorAll(sel)].map(e => e.textContent.trim().replace(/\s+/g, ' '));
    check('T0', 'form: section order', t('.tp-form .tf-h').join(','),
        'Character,Conditions,Strength,Heart,Wits,Skills,Useful Items,Combat Proficiencies,Rewards,Virtues,Endurance 28,Hope 11,Parry 16');
    check('T1', 'form: conditions (Anguished always empty, Poisoned ticked), injury',
        [...el.querySelectorAll('.tf-checks li')].map(li => `${li.textContent.trim()}${li.querySelector('.is-on') ? '*' : ''}`).join(',') + '|' + t('.tf-injury b')[0],
        'Weary,Miserable,Wounded,Anguished,Poisoned*|4');
    check('T2', 'form: 18 skills, 6 pips each, M on magical, favoured boxes', [el.querySelectorAll('.tf-skill .tf-box').length,
        el.querySelectorAll('.tf-skills .tf-dia--pip').length, t('.tf-mag').join(','), el.querySelectorAll('.tf-skill .tf-box.is-on').length].join('|'),
        `18|${(18 + 4) * 6}|M|${ca.skills.filter(sk => sk.favoured).length}`);
    check('T3', 'form: portrait, header points, 6 useful-item lines, 4 war-gear rows', [el.querySelector('.tf-portrait img')?.getAttribute('src') === ca.img,
        t('.tf-point b').join('/'), el.querySelectorAll('.tf-useful li').length, el.querySelectorAll('.tf-foot > .tf-gear tbody tr').length].join('|'),
        `true|${ca.points.adventure}/${ca.points.skill}|6|4`);
    check('T4', 'form: no raw i18n keys', /TOR2EPRINT\.|tor2e\./.test(el.textContent), false);
}

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

// Journal-only item descriptions (task-3): inlined when tor2e.inlineElementFromUuidInDescription is on.
{
    const a = game.actors.getName('Arvegil');
    const virtue = a.items.find(i => i.type === 'virtues');
    const descBefore = virtue._source.system.description.value;
    const settingBefore = game.settings.get('tor2e', 'inlineElementFromUuidInDescription');
    const journal = await JournalEntry.implementation.create({ name: 'smoke journal', pages: [{ name: 'p', type: 'text', text: { content: '<p>JOURNAL-SMOKE</p>' } }] });
    const virtueDesc = async (setting, desc) => {
        await game.settings.set('tor2e', 'inlineElementFromUuidInDescription', setting);
        await virtue.update({ 'system.description.value': desc });
        return (await contextOf('Arvegil')).virtues.find(v => v.id === virtue.id).description;
    };
    try {
        const link = `<p>@UUID[${journal.pages.contents[0].uuid}]{Label}</p>`;
        const on = await virtueDesc(true, link);
        const off = await virtueDesc(false, link);
        const other = await virtueDesc(true, `<p>Text ${link}</p>`);
        const missing = await virtueDesc(true, '<p>@UUID[JournalEntry.nope0000nope0000.JournalEntryPage.nope0000nope0000]{Gone}</p>');
        check('J0', 'journal-only description: inlined when on; link when off / other shape; broken link falls back',
            [on.includes('JOURNAL-SMOKE'), off.includes('JOURNAL-SMOKE') || !off.includes('Label'), other.includes('JOURNAL-SMOKE'), missing.includes('Gone')].join('|'),
            'true|false|false|true');
    } finally {
        await virtue.update({ 'system.description.value': descBefore });
        await game.settings.set('tor2e', 'inlineElementFromUuidInDescription', settingBefore);
        await journal.delete();
    }
}

// Print CSS loaded. Foundry may wrap module styles in @layer/@import; walk grouping rules down to @media print.
const walk = (rules, inPrint = false) => [...rules].flatMap(r => {
    if (r instanceof CSSImportRule) return r.styleSheet ? walk(r.styleSheet.cssRules, inPrint) : [];
    if (r instanceof CSSMediaRule) return walk(r.cssRules, inPrint || r.media.mediaText === 'print');
    if (r instanceof CSSGroupingRule) return walk(r.cssRules, inPrint);
    return inPrint && r.selectorText ? [r.selectorText] : [];
});
const printRules = [...document.styleSheets].flatMap(s => { try { return walk(s.cssRules); } catch { return []; } });
check('K0', 'print CSS hides Foundry chrome', printRules.some(s => s?.includes(':not(:has(.tor2e-print))')), true);
const uncial = await document.fonts.load('10px "Uncial Antiqua"');
const uncialFace = [...document.fonts].find(f => f.family.replace(/"/g, '') === 'Uncial Antiqua');
check('K2', 'Uncial Antiqua bundled: @font-face loaded, file served by the module',
    `${uncial.length > 0}|${uncialFace?.status}|${(await fetch(`/modules/${MODULE_ID}/fonts/uncial-antiqua/UncialAntiqua-Regular.ttf`, { method: 'HEAD' })).ok}`, 'true|loaded|true');
check('K1', 'print CSS hides the format toolbar', printRules.some(s => s?.includes('.tor2e-print-toolbar')), true);

// Fit (tools/smoke.mjs prints each to PDF): typical heroes fit one page; long ones may flow (task-19), reported only.
// Hans Grimald (14 rewards/virtues/traits) is a long hero: 2 pages.
const LONG = { 'Hans Grimald': 2 };
export const pdfChecks = [
    ...FIXTURES.map((actor, i) => ({ id: `G${i}`, what: `${actor} prints on ${LONG[actor] ?? 1} page(s)`, actor, format: 'classic', pages: LONG[actor] ?? 1, orient: 'landscape' })),
    // 20 rewards make the rewards/virtues/traits block taller than a page: it has to split.
    { id: 'G9', what: 'overlong hero flows: page count', actor: OVERLONG, format: 'classic', pages: null, orient: 'landscape', allowTall: true },
    // Form: one A4 portrait page for everyone, overlong lists cut (D3).
    ...[...FIXTURES, OVERLONG].map((actor, i) => ({ id: `H${i}`, what: `form: ${actor.slice(0, 24)} on one A4 portrait page`, actor, format: 'form', pages: 1, orient: 'portrait', pageMm: 281, pageWidthMm: 194 }))
];

export default results;
