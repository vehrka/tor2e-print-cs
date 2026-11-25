#CLAUDE.md — TOR2e Print Sheet (Foundry VTT v14 Module)

## Project Overview

Foundry VTT v14 **module** that adds a print-optimized character-sheet layout for the **The One Ring 2nd edition** system (`tor2e`). Adds a "Print" button to the existing actor sheet; clicking opens a separate ApplicationV2 window with a format toolbar; each format pick renders that print-friendly Handlebars template and calls `window.print()` once.

- **Module id:** `tor2eprint` (folder name must match)
- **Target:** Foundry VTT v14 (minimum 14)
- **Depends on system:** `tor2e` (>= 6.0.0, verified 6.3.0)
- **Language:** Plain JavaScript ESM (`.mjs`) — no TypeScript, no bundler, no build step
- **Type:** Foundry **module** (not a system) — installs alongside the `tor2e` system

## Key References

| Path | Purpose |
|------|---------|
| `ref/foundryvtt-tor2e/` | **Authoritative** TOR2e system source — actor models, sheets, templates, `src/system.json`, `src/template.json` are the schema reference. Keep it pinned to the verified release tag, not `develop`: `git -C ref/foundryvtt-tor2e fetch --tags && git -C ref/foundryvtt-tor2e checkout vX.Y.Z` (check with `git -C ref/foundryvtt-tor2e describe --tags`) |
| `ref/starwarsd6/modules/apps/character-print.mjs` | **Primary print-pattern reference** — ApplicationV2 + HandlebarsApplicationMixin, auto `window.print()` on first render |
| `ref/starwarsd6/modules/apps/npc-print.mjs` | NPC print variant reference |
| `ref/starwarsd6/templates/actors/` | Print Handlebars template reference (`character-sheet-print.hbs`, `npc-sheet-print.hbs`) |
| `ref/img/tor2e_img_example.png` | **Target print layout reference** — desired visual layout for printed character sheet |
| `PRPs/feats/feat001-create-print-module.md` | Original feature spec / PRP for the print module |
| `backlog/` | **The to-do board** (Backlog.md): next steps, ideas, bugs. See *Tasks* below |

> Note: `ref/tor-2e-macros/` not currently checked out. `ref/` is read-only — never modify.

## Status

- **v0.2 implemented:** `character` actor type only; targets Foundry v14 + tor2e 6.x. Files in repo root: `module.json`, `tor2eprint.mjs`, `modules/apps/character-print.mjs`, `templates/actors/character-print.hbs`, `styles/print.css`, `lang/en.json`, `README.md`, `deploy.sh`. Print window has a format toolbar and prints once per pick. Formats: `classic` (`character-print.hbs`, A4 landscape) and `form` (`character-print-form.hbs` + `form-skill.hbs` partial, A4 portrait single page after `ref/img/new_cs_v1.jpg`). Print context covers attributes, stature, resources, conditions, common skills (by attribute, with pips/favoured/magical), combat proficiencies, weapons, armour, equipment (`miscellaneous` items), virtues, rewards, traits, biography, history; plus form-layout fields (`buildFormFields`: points, treasure, distinctive features, conditions from `actor.statuses`, injury, load, shadow, gear, parry, protection, fixed slots).
- **Not implemented:** `adversary`, `npc`, `community`, `lore` print variants. Defer until requested.
- Open work lives in `backlog/`, not here. Keep this section to what is built.

## Tasks (Backlog.md)

Open work is tracked as Markdown tasks in `backlog/tasks/`, managed with the `backlog` CLI (dev dependency, pinned in `package.json`: `npx backlog …`). Run `npm install` once. Don't keep to-do lists in this file or in `PRPs/`.

- Read: `npx backlog task list --plain`, `npx backlog task <id> --plain`, `npm run board` (TUI), `npm run board:web` (web kanban).
- Write through the CLI, not by hand: `npx backlog task create "…" -m "<milestone>" -l <labels> --priority … --ac "…"`, `npx backlog task edit <id> -s "In Progress"` / `--check-ac 1` / `--check-dod 1` / `--notes "…"`, then `-s Done`.
- Milestones: *TOR system update* (detail in `PRPs/improvements-from-tor2e-6.3.md`), *DH Print parity* (detail in `PRPs/improvements-from-dh-print.md`), *New layouts* (character form layout, detail in `PRPs/new-layout-cs-v1.md`; adversary/npc/community/lore). `PRPs/` is git-ignored: quote what a task needs into its description.
- Labels are in `backlog/config.yml`. The default Definition of Done (smoke check, hand check, README/CLAUDE.md, `module.json` compatibility) is added to every task; tick a DoD item that doesn't apply and say why in `--notes`.
- Columns follow the dev cycle: **To Do → In Progress → Needs smoke → Hand check → Done**, plus **Blocked**. Skip a step that doesn't apply.
  - *In Progress*: being built. Set it when you start.
  - *Needs smoke*: built and the smoke check is written, but `npm run smoke` hasn't run yet. Needs the local dev server (`npm run foundry`). A failed run goes back to *In Progress* with a note.
  - *Hand check*: waiting for a check in a v14 + tor2e world (see the verification checklist below).
  - *Done*: AC/DoD ticked, docs updated, in the same commit as the work.
  - *Blocked*: waiting on a decision (e.g. layout tradeoffs, Engineering Principle 4). Say what in `--notes`.

## TOR2e System Schema (read before coding sheet logic)

- **Actor types:** `community`, `npc`, `adversary`, `lore`, `character` (player hero); see `ref/foundryvtt-tor2e/src/system.json` (`documentTypes`) and `ref/foundryvtt-tor2e/src/modules/models/actors/*.model.mjs`
- **Item types:** weapon, armour, skill, virtues (note: type id is plural `virtues`, not `virtue`), reward, trait, song, mount, journey-log, undertaking, fell-ability, combat-task, standing, miscellaneous (see `ref/foundryvtt-tor2e/src/modules/models/items/`)
- **Existing sheet to inject Print button into:** `Tor2eCharacterSheetV2` (tor2e 6.x), at `ref/foundryvtt-tor2e/src/modules/applications/sheets/character-sheet.mjs` — `HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2)`. Legacy `ActorSheet` support dropped in v0.2.0.
- **Field paths:** read via `actor.system.*` — confirm against the relevant `*.model.mjs` DataModel. Schema uses legacy `{value, type, label}` blocks (e.g. `system.attributes.strength.value`, `system.commonSkills.athletics.value`, `system.combatProficiencies.swords.value`, `system.resources.endurance.{value,max}`, weapons: `system.damage.value` / `system.injury.value` / `system.load.value` / `system.notes.value` / `system.skill.{name,value}`, armour: `system.protection.value`).
- **Localization:** reuse keys from `ref/foundryvtt-tor2e/src/lang/en.json` (e.g. `tor2e.actors.stats.endurance`, `tor2e.commonSkills.*`, `tor2e.combatProficiencies.*`, `tor2e.stats.{strength,heart,wits}`, `tor2e.statureStats.{valour,wisdom}`).

## Architecture

### Current File Layout

```
tor2eprint/
├── module.json              # Manifest
├── tor2eprint.mjs           # Entry — Hooks.once("init") + renderActorSheetV2 hook
├── modules/apps/
│   └── character-print.mjs  # Tor2eCharacterPrint (ApplicationV2 + HandlebarsApplicationMixin)
├── templates/actors/
│   ├── character-print.hbs  # Classic format
│   ├── character-print-form.hbs # Form format (+ form-skill.hbs partial)
│   ├── print-toolbar.hbs    # Format buttons (hidden on print)
│   └── print-sheet.hbs      # Wrapper: chosen format partial or hint
├── fonts/uncial-antiqua/     # Bundled form-layout heading font + OFL.txt (SIL OFL 1.1)
├── styles/print.css         # Layout + @media print rules; A4 landscape
├── lang/en.json             # TOR2EPRINT.* strings
├── deploy.sh                # rsync runtime files (allow-list, --delete) to $DEPLOY_TARGET
├── package.json             # Dev tooling only (backlog.md, playwright-core); runtime has no build step
├── tools/                   # Dev: env.mjs (.env loader), link.mjs, foundry.mjs, smoke.mjs (Playwright runner)
├── tests/smoke.mjs          # In-page smoke checks, imported by tools/smoke.mjs
├── fixtures/                # Smoke heroes: exported (fvtt-Actor-*.json) + synthetic (smoke-effect: actor AE, smoke-overlong)
├── .foundry-data/           # Git-ignored local Foundry user data (Config/, Data/, Logs/)
├── backlog/                 # Backlog.md tasks, milestones, config
├── README.md
└── CLAUDE.md                # This file
```

Future actor-type variants (adversary/npc/community/lore) follow the same `*-print.mjs` + `*-print.hbs` pattern under the existing dirs.

### v14 Patterns (mandatory)

- **Print window:** `ApplicationV2` + `HandlebarsApplicationMixin` only — no `Application`/`FormApplication`.
- **Pattern (mirror `ref/starwarsd6/modules/apps/character-print.mjs`):**
  - `static DEFAULT_OPTIONS` with `classes`, `position`, `window`
  - `static PARTS` = `{ toolbar, sheet }` (`print-toolbar.hbs`, `print-sheet.hbs` under `modules/tor2eprint/templates/actors/`); the sheet part includes the chosen format template as a partial. `FORMATS` (id → template) in `character-print.mjs`; `static TEMPLATES` preloaded at init.
  - `_prepareContext(options)` returns `format`, `formatTemplate`, `formats`, and the actor context (from `actor.system` + `actor.items`) only once a format is picked
  - `actions.format` → `printFormat(id)` sets `#printPending` and renders; `_onRender` calls `window.print()` once when pending. No print on open or on a plain re-render.
- **Button injection (ApplicationV2 only):**
  - Primary: `Hooks.on("getHeaderControlsApplicationV2", (app, controls) => …)`. Push `{icon, label, action: "tor2eprint-btn", onClick}`. Foundry places it in the window header or its overflow menu.
  - Fallback: `Hooks.on("renderActorSheetV2", (app, html) => …)`. If a `[data-action="tor2eprint-btn"]` control was rendered, bind its click directly (guarded by `dataset.tor2eprintBound`); otherwise inject a `.header-control` button after `.window-header .window-title`.
  - Guard in both via `printableActor(app)`: `app.document.documentName === "Actor" && type === "character"`.
  - Click handler: `openPrint(actor)` → `new Tor2eCharacterPrint({ document: actor }).render(true)`.
- **No deprecated APIs:** avoid `mergeObject`, `duplicate`, jQuery sheet-data mutations, old `getData`-based sheets. Use namespaced entry points only — `foundry.applications.handlebars.loadTemplates`, `foundry.applications.ux.TextEditor.implementation.enrichHTML(html)` (no `{async:true}` option); the bare globals are gone in v14.
- **Init hook:** all setup (CONFIG registrations, template preloads via `loadTemplates`) inside `Hooks.once("init", …)` in `tor2eprint.mjs`.

### Template Path Convention

ApplicationV2 `PARTS` template paths are root-relative. For a module use:

```
modules/tor2eprint/templates/actors/character-print.hbs
```

Not `systems/...` (this is a module, not a system).

## Manifest (`module.json`)

Current shape (keep authors + `flags.hotReload` block when editing):

```json
{
  "id": "tor2eprint",
  "title": "TOR2e Print Sheets",
  "description": "Print-optimized character sheet for The One Ring 2e.",
  "version": "0.2.0",
  "compatibility": { "minimum": "14", "verified": "14" },
  "authors": [{ "name": "pedrof" }],
  "esmodules": ["tor2eprint.mjs"],
  "styles": ["styles/print.css"],
  "languages": [{ "lang": "en", "name": "English", "path": "lang/en.json" }],
  "relationships": {
    "systems": [
      { "id": "tor2e", "type": "system", "compatibility": { "minimum": "6.0.0", "verified": "6.3.0" } }
    ]
  },
  "flags": {
    "hotReload": {
      "extensions": ["hbs", "css", "json"],
      "paths": ["templates", "styles", "lang"]
    }
  }
}
```

## Print Layout Rules

- Two layouts, one actor per print. Both rely on `@media print` putting `body:has(.tor2e-print)` in block flow.
- **Classic** (`.tor2e-print`, no extra root class): flows and may spill onto a second page (no shrink-to-fit or truncation, decided in task-19). `@page { size: A4 landscape; margin: 8mm; }` (matches `ref/img/tor2e_img_example.png`). `@media print` puts `body:has(.tor2e-print)` in block flow (`@page` size needs it; Foundry's fixed body otherwise clips the sheet to one page) and tightens spacing/fonts so a typical hero fits one page; `npm run smoke` prints every fixture to PDF and checks the page count (Hans Grimald, 14 rewards/virtues/traits, takes 2).
- **Form** (`.tor2e-print.tp-form`): named page `@page tor2e-portrait { size: A4 portrait; margin: 8mm; }`, fixed 194 × 280 mm sheet, exactly one page; lists are cut to fixed slots/boxes (`overflow: hidden`, no "+N more", task-25 D3). White page, `#8b1a1a` ink, values in `#2a1810`. Every form rule is scoped under `.tp-form`. Smoke H-checks print each fixture (and the overlong hero) to PDF: 1 portrait page, nothing cut at the sheet bottom.
- Hide Foundry chrome on print using `:has()` selector: `body > *:not(:has(.tor2e-print)) { display: none !important; }` and strip header/resize-handle on the print window.
- `break-inside: avoid` on each `.tp-block`.
- No interactive controls in print template — read-only HTML.
- Color tokens (classic): cream `#f5ecd6` background on screen (white on paper), dark red `#8b1a1a` accents. Use `print-color-adjust: exact` on filled pips, table headers, flag chips so they survive print without "Background graphics" being toggled.

## Coding Standards

- ESM only: `import`/`export`, no `require()`.
- No build step — files must work as-is when dropped in `Data/modules/tor2eprint/`.
- One public export per file. Internal helpers stay unexported.
- Naming:
  - Classes PascalCase (`CharacterPrintSheet`)
  - Functions camelCase verbs (`buildAttributeContext`)
  - Constants SCREAMING_SNAKE_CASE
  - Files kebab-case (`character-print.mjs`)
- Foundry globals (`game`, `CONFIG`, `Hooks`, `Actor`, `foundry`) are globals — never import.
- Localize all user-visible strings via `game.i18n.localize(...)` / `{{localize "key"}}`.
- KISS / YAGNI: implement only what current actor types need. No speculative item-type handling.

## Engineering Principles (override on conflict with global rules)

1. Don't assume schema — confirm field paths against `ref/foundryvtt-tor2e/src/modules/models/actors/*.model.mjs` before reading them.
2. Minimum code. No drive-by refactors of reference dirs (`ref/` is read-only).
3. Define acceptance: button renders on actor sheet → click opens print window with format toolbar → each format pick prints once → typical hero fits one A4 landscape page (long heroes may flow onto page 2). Verify in a running v14 instance before reporting done.
4. Surface tradeoffs when picking layout (single-page squeeze vs multi-page) — ask before deciding.

## Development Workflow

### Local dev loop

```bash
npm install                 # backlog.md + playwright-core (dev only)
cp .env.example .env        # FOUNDRY_APP, FOUNDRY_DATA, FOUNDRY_PORT, FOUNDRY_WORLD, SMOKE_*, DEPLOY_TARGET
npm run link                # symlink repo into $FOUNDRY_DATA/modules/tor2eprint
npm run foundry             # local Foundry (--noupdate --noupnp), launches $FOUNDRY_WORLD
npm run smoke               # headless login, runs tests/smoke.mjs in the page, PASS/FAIL, exit 1 on failure
```

`tools/env.mjs` takes everything after `=` as the value: put `.env` comments on their own line. Real env vars win over `.env`.

Local data (`.foundry-data/`, git-ignored), one-time setup:
- `Config/license.json` copied from another local Foundry data dir (same licence).
- `Data/systems/tor2e` pulled read-only from the server: `bash -c 'set -a; . ./.env; rsync -a "${DEPLOY_TARGET%/modules/*}/systems/tor2e/" .foundry-data/Data/systems/tor2e/'`.
- World `tor2eprint-test` (system tor2e, user Gamemaster, no password). v14 has no `createWorld` setup action: start Foundry without `--world`, then from `/setup` POST `/create` with `{action: "createWorld", id, title, system: "tor2e"}`. Enable the module once as GM: `game.settings.set("core", "moduleConfiguration", {tor2eprint: true})`.
- Playwright browser, once: `npx -y playwright-core@1.65.0 install chromium-headless-shell`.

Port 30001 (DH dev uses 30002). Smoke results are `{id, what, actual, expected, pass}`; `pass: null` prints as info and doesn't fail.

`npm run smoke` first imports any `fixtures/` hero missing from the world (by name, ids kept), resets `tor2e.systemMigrationVersion` and reloads, so tor2e world migrations run on them. Fixture portraits/item images point at another world and 404; that is expected. Checks: environment (incl. running tor2e == `verified`), print control on character vs adversary, header button, print window opens and prints once, no raw keys, print CSS loaded. In v14 the `getHeaderControlsApplicationV2` entry lives in the collapsed overflow menu, so the header button the smoke clicks is the `renderActorSheetV2` fallback.

### Deploy to remote

`deploy.sh` (tracked) rsyncs only the runtime files (`module.json`, `tor2eprint.mjs`, `modules/`, `fonts/`, `templates/`, `styles/`, `lang/`) with `--delete`, so nothing else (`fixtures/`, `backlog/`, `.git/`, docs) reaches the server and removed files don't linger. Target comes from `DEPLOY_TARGET` (env or `.env`, git-ignored); the script fails if unset. Add a runtime folder (e.g. `fonts/`) to the `--include` list and to the `release.yml` zip together.

```bash
DEPLOY_TARGET=host:path/Data/modules/tor2eprint   # in .env
./deploy.sh -n        # dry run: lists what would be sent/deleted
npm run deploy
```

Deployed `module.json` keeps the `#{VERSION}#` tokens (the release workflow fills them), so a dev deploy shows that as its version.

### Hot reload

`module.json` declares `flags.hotReload` for `hbs`, `css`, `json` under `templates/`, `styles/`, `lang/`. Edits propagate live without restarting Foundry. `module.json` changes (e.g. `verified`) need a Foundry restart: the server caches the manifest.

### Verification checklist (run before "done")

- [ ] Module enables without console errors on v14 + tor2e 6.x
- [ ] Print button visible on each supported actor sheet type
- [ ] Click opens ApplicationV2 print window with actor data
- [ ] Window opens without printing; `window.print()` fires once per format pick
- [ ] Print preview shows clean layout, no Foundry chrome
- [ ] All labels resolve (no `tor2e.…` raw keys leaking through)

## Out of Scope (do not build unless asked)

- PDF export via Puppeteer / server-side rendering
- Compendium/journal printing
- Edit support in print view
- Non-tor2e systems
- Changes inside `ref/` (read-only references)
