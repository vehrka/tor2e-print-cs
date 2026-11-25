// Runs inside the Foundry page (imported by tools/smoke.mjs). Default export: [{id, what, actual, expected, pass}].
const MODULE_ID = 'tor2eprint';
const results = [];
const check = (id, what, actual, expected) => results.push({ id, what, actual, expected, pass: actual === expected });

check('S0', 'module active', game.modules.get(MODULE_ID)?.active ?? false, true);
check('S1', 'system is tor2e', game.system.id, 'tor2e');

export default results;
