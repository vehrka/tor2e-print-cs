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
    check('P4', 'window.print() runs exactly once', prints, 1);
    await win?.render();
    await wait(500);
    check('P5', 'no print on re-render', prints, 1);
    check('P6', 'no raw i18n keys in print window', /TOR2EPRINT\.|tor2e\./.test(win?.element.textContent ?? 'TOR2EPRINT.'), false);
} finally {
    window.print = realPrint;
    for (const w of printWindows()) await w.close();
    await sheet.close();
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

export default results;
