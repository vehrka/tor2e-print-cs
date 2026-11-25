// Headless smoke test: log into the running dev world and run tests/smoke.mjs in the page.
// Usage: npm run smoke   (server running: npm run foundry)
// Env (or .env): FOUNDRY_PORT (30000), SMOKE_USER ("Gamemaster"), SMOKE_PASSWORD ("").
// Needs the browser once: PATH=~/foundryvtt-node/bin:$PATH npx -y playwright-core@1.65.0 install chromium-headless-shell
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root } from './env.mjs';

const { id: MODULE_ID } = JSON.parse(readFileSync(join(root, 'module.json'), 'utf8'));

const { FOUNDRY_PORT = '30000', SMOKE_USER = 'Gamemaster', SMOKE_PASSWORD = '' } = process.env;
const base = `http://localhost:${FOUNDRY_PORT}`;
const errors = [];

const browser = await chromium.launch({
    headless: true,
    // Foundry's canvas needs WebGL; use the GPU (Chromium falls back to SwiftShader without one).
    args: ['--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=gl-egl']
});
let failed = true;
try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });

    await page.goto(`${base}/join`, { waitUntil: 'domcontentloaded' });
    await page.selectOption('select[name="userId"]', { label: SMOKE_USER });
    await page.fill('input[name="password"]', SMOKE_PASSWORD);
    await Promise.all([page.waitForURL('**/game', { timeout: 60_000 }), page.click('button[name="join"]')]);
    await page.waitForFunction(() => window.game?.ready === true, null, { timeout: 120_000 });

    const env = await page.evaluate(id => ({
        core: game.release.version, system: game.system.version,
        module: game.modules.get(id)?.active ? game.modules.get(id).version : 'inactive'
    }), MODULE_ID);
    console.log(`Logged in as ${SMOKE_USER} · core ${env.core} · system ${env.system} · ${MODULE_ID} ${env.module}`);

    const results = await page.evaluate(async id => (await import(`/modules/${id}/tests/smoke.mjs?${Date.now()}`)).default, MODULE_ID);
    for (const r of results) {
        const mark = r.pass === true ? 'PASS' : r.pass === false ? 'FAIL' : 'info';
        console.log(`${mark.padEnd(4)}  ${r.id.padEnd(5)} ${r.what}  →  ${r.actual}${r.pass === false ? `  (expected ${r.expected})` : ''}`);
    }
    const nFail = results.filter(r => r.pass === false).length;
    console.log(`\n${results.filter(r => r.pass).length} passed, ${nFail} failed`);
    failed = nFail > 0;
} catch (err) {
    console.error(`Smoke run aborted: ${err.message}`);
} finally {
    if (errors.length) console.log(`\nBrowser errors (${errors.length}):\n  ${errors.join('\n  ')}`);
    await browser.close();
}
process.exit(failed ? 1 : 0);
