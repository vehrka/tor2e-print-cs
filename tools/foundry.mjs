// Start the local dev Foundry server. Paths come from .env (see .env.example).
// Usage: npm run foundry
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import './env.mjs';

const { FOUNDRY_APP, FOUNDRY_NODE = 'node', FOUNDRY_DATA, FOUNDRY_PORT = '30000', FOUNDRY_WORLD } = process.env;
if (!FOUNDRY_APP || !FOUNDRY_DATA) throw new Error('Set FOUNDRY_APP and FOUNDRY_DATA (env or .env).');
const main = join(FOUNDRY_APP, 'main.js');
if (!existsSync(main)) throw new Error(`No Foundry at ${main}`);

// Foundry's dataPath is the folder that contains Data/, Config/ and Logs/.
const args = [main, `--dataPath=${dirname(FOUNDRY_DATA)}`, `--port=${FOUNDRY_PORT}`, '--noupdate', '--noupnp'];
if (FOUNDRY_WORLD) args.push(`--world=${FOUNDRY_WORLD}`); // skip the setup screen, launch this world
console.log(`${FOUNDRY_NODE} ${args.join(' ')}`);
spawn(FOUNDRY_NODE, args, { stdio: 'inherit' }).on('exit', code => process.exit(code ?? 0));
