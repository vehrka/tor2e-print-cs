// Symlink this repo into Foundry's modules folder as the module id from module.json.
// Usage: FOUNDRY_DATA=/path/to/FoundryVTT/Data npm run link   (or set it in .env)
import { readFileSync, symlinkSync, lstatSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { root } from './env.mjs';

const data = process.env.FOUNDRY_DATA;
if (!data) throw new Error('Set FOUNDRY_DATA to the Foundry "Data" folder (env or .env).');
const { id } = JSON.parse(readFileSync(join(root, 'module.json'), 'utf8'));
const target = join(data, 'modules', id);

let exists = false;
try { lstatSync(target); exists = true; } catch {}
if (exists) {
    console.log(`Already exists: ${target}`);
} else {
    mkdirSync(dirname(target), { recursive: true });
    symlinkSync(root, target, 'dir');
    console.log(`Linked ${target} -> ${root}`);
}
