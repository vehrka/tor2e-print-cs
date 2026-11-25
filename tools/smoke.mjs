// Headless smoke test: log into the running dev world and run tests/smoke.mjs in the page.
// Usage: npm run smoke   (server running: npm run foundry)
// Env (or .env): FOUNDRY_PORT (30000), SMOKE_USER ("Gamemaster"), SMOKE_PASSWORD ("").
// Needs the browser once: PATH=~/foundryvtt-node/bin:$PATH npx -y playwright-core@1.65.0 install chromium-headless-shell
import { chromium } from 'playwright-core';
import { readdirSync, readFileSync } from 'node:fs';
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
    page.on('response', r => { if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`); });

    await page.goto(`${base}/join`, { waitUntil: 'domcontentloaded' });
    await page.selectOption('select[name="userId"]', { label: SMOKE_USER });
    await page.fill('input[name="password"]', SMOKE_PASSWORD);
    await Promise.all([page.waitForURL('**/game', { timeout: 60_000 }), page.click('button[name="join"]')]);
    await page.waitForFunction(() => window.game?.ready === true, null, { timeout: 120_000 });

    // Seed: import fixtures/ heroes missing from the world (by name, ids kept), then reload so the
    // tor2e world migrations (e.g. 6.2.2 item select defaults) run on them like on a real world.
    const fixtures = readdirSync(join(root, 'fixtures')).filter(f => f.endsWith('.json'))
        .map(f => JSON.parse(readFileSync(join(root, 'fixtures', f), 'utf8')));
    const seeded = await page.evaluate(async list => {
        const missing = list.filter(a => !game.actors.getName(a.name));
        if (!missing.length) return [];
        await Actor.implementation.createDocuments(missing, { keepId: true });
        await game.settings.set('tor2e', 'systemMigrationVersion', '0.1.11');
        return missing.map(a => a.name);
    }, fixtures);
    if (seeded.length) {
        console.log(`Seeded fixtures: ${seeded.join(', ')} · reloading for tor2e migrations`);
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => window.game?.ready === true
            && game.settings.get('tor2e', 'systemMigrationVersion') !== '0.1.11', null, { timeout: 120_000 });
    }

    const env = await page.evaluate(id => ({
        core: game.release.version, system: game.system.version,
        module: game.modules.get(id)?.active ? game.modules.get(id).version : 'inactive'
    }), MODULE_ID);
    console.log(`Logged in as ${SMOKE_USER} · core ${env.core} · system ${env.system} · ${MODULE_ID} ${env.module}`);

    const { results, pdfChecks } = await page.evaluate(async id => {
        const m = await import(`/modules/${id}/tests/smoke.mjs?${Date.now()}`);
        return { results: m.default, pdfChecks: m.pdfChecks ?? [] };
    }, MODULE_ID);

    // Print fit: open each actor's print window, print it to PDF with the print CSS and count pages.
    // pdfChecks: [{ id, what, actor, pages }]; pages: expected page count, or null to report only.
    for (const c of pdfChecks) {
        await page.evaluate(async name => {
            window.print = () => {};
            const controls = [];
            Hooks.callAll('getHeaderControlsApplicationV2', { document: game.actors.getName(name) }, controls);
            controls.find(x => x.action === 'tor2eprint-btn').onClick();
            await new Promise(r => setTimeout(r, 1000));
            await Promise.allSettled([...document.querySelectorAll('.tor2e-print img')].map(i => i.decode()));
        }, c.actor);
        await page.emulateMedia({ media: 'print' });
        // A clipping ancestor (Foundry's fixed body/window) would cut the sheet and fake a one-page fit.
        const clipped = await page.evaluate(() => {
            const root = document.querySelector('.tor2e-print');
            const out = [];
            for (let el = root.parentElement; el; el = el.parentElement)
                if (getComputedStyle(el).overflowY !== 'visible' && el.scrollHeight > el.clientHeight + 1)
                    out.push(el.tagName.toLowerCase() + (el.className ? '.' + [...el.classList].join('.') : ''));
            return out;
        });
        const pdf = await page.pdf({ preferCSSPageSize: true });
        await page.emulateMedia({ media: null });
        await page.evaluate(async () => {
            for (const a of [...foundry.applications.instances.values()])
                if (a.element?.querySelector('.tor2e-print')) await a.close();
        });
        const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page(?!s)/g) ?? []).length;
        const actual = clipped.length ? `${pages}, clipped by ${clipped.join(' < ')}` : pages;
        results.push({ ...c, actual, expected: c.pages ?? 'not clipped', pass: clipped.length ? false : c.pages == null ? null : pages === c.pages });
    }

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
