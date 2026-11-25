#CLAUDE.md — TOR2e Print Sheet (Foundry VTT v14 Module)

## Project Overview

Foundry VTT v14 **module** that adds a print-optimized character-sheet layout for the **The One Ring 2nd edition** system (`tor2e`). Adds a "Print" button to the existing actor sheet; clicking opens a separate ApplicationV2 window rendering a print-friendly Handlebars template, then auto-triggers `window.print()`.

- **Module id:** `tor2eprint` (folder name must match)
- **Target:** Foundry VTT v14 (minimum 14)
- **Depends on system:** `tor2e` (>= 6.0.0, verified 6.1.0)
- **Language:** Plain JavaScript ESM (`.mjs`) — no TypeScript, no bundler, no build step
- **Type:** Foundry **module** (not a system) — installs alongside the `tor2e` system

## Key References

| Path | Purpose |
|------|---------|
| `ref/foundryvtt-tor2e/` | **Authoritative** TOR2e system source — actor models, sheets, templates, `src/system.json`, `src/template.json` are the schema reference |
| `ref/starwarsd6/modules/apps/character-print.mjs` | **Primary print-pattern reference** — ApplicationV2 + HandlebarsApplicationMixin, auto `window.print()` on first render |
| `ref/starwarsd6/modules/apps/npc-print.mjs` | NPC print variant reference |
| `ref/starwarsd6/templates/actors/` | Print Handlebars template reference (`character-sheet-print.hbs`, `npc-sheet-print.hbs`) |
| `ref/img/tor2e_img_example.png` | **Target print layout reference** — desired visual layout for printed character sheet |
| `PRPs/feats/feat001-create-print-module.md` | Original feature spec / PRP for the print module |
| `backlog/` | **The to-do board** (Backlog.md): next steps, ideas, bugs. See *Tasks* below |

> Note: `ref/tor-2e-macros/` not currently checked out. `ref/` is read-only — never modify.

## Status

- **v0.2 implemented:** `character` actor type only; targets Foundry v14 + tor2e 6.x. Files in repo root: `module.json`, `tor2eprint.mjs`, `modules/apps/character-print.mjs`, `templates/actors/character-print.hbs`, `styles/print.css`, `lang/en.json`, `README.md`, `deploy.sh`. Print context covers attributes, stature, resources, conditions, common skills (by attribute, with pips/favoured/magical), combat proficiencies, weapons, armour, equipment (`miscellaneous` items), virtues, rewards, traits, biography, history.
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
  - *Needs smoke*: built and the smoke check is written, but `npm run smoke` hasn't run yet. Unused until the smoke tooling exists (*DH Print parity*). A failed run goes back to *In Progress* with a note.
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
│   └── character-print.hbs
├── styles/print.css         # Layout + @media print rules; A4 landscape
├── lang/en.json             # TOR2EPRINT.* strings
├── deploy.sh                # rsync runtime files (allow-list, --delete) to $DEPLOY_TARGET
├── package.json             # Dev tooling only (backlog.md); runtime has no build step
├── backlog/                 # Backlog.md tasks, milestones, config
├── README.md
└── CLAUDE.md                # This file
```

Future actor-type variants (adversary/npc/community/lore) follow the same `*-print.mjs` + `*-print.hbs` pattern under the existing dirs.

### v14 Patterns (mandatory)

- **Print window:** `ApplicationV2` + `HandlebarsApplicationMixin` only — no `Application`/`FormApplication`.
- **Pattern (mirror `ref/starwarsd6/modules/apps/character-print.mjs`):**
  - `static DEFAULT_OPTIONS` with `classes`, `position`, `window`
  - `static PARTS` mapping `sheet` → template path under `modules/tor2eprint/templates/...`
  - `_prepareContext(options)` builds the Handlebars context from `actor.system` + `actor.items`
  - `_onRender(context, options)` triggers `window.print()` on `options.isFirstRender`
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
      { "id": "tor2e", "type": "system", "compatibility": { "minimum": "6.0.0", "verified": "6.1.0" } }
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

- One actor per print; the layout flows and may spill onto a second page (no shrink-to-fit or truncation, decided in task-19). `@page { size: A4 landscape; margin: 10mm; }` (matches `ref/img/tor2e_img_example.png`).
- Hide Foundry chrome on print using `:has()` selector: `body > *:not(:has(.tor2e-print)) { display: none !important; }` and strip header/resize-handle on the print window.
- `break-inside: avoid` on each `.tp-block`.
- No interactive controls in print template — read-only HTML.
- Color tokens: cream `#f5ecd6` background, dark red `#8b1a1a` accents. Use `print-color-adjust: exact` on filled pips, table headers, flag chips so they survive print without "Background graphics" being toggled.

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
3. Define acceptance: button renders on actor sheet → click opens print window → window auto-prints → typical hero fits one A4 landscape page (long heroes may flow onto page 2). Verify in a running v14 instance before reporting done.
4. Surface tradeoffs when picking layout (single-page squeeze vs multi-page) — ask before deciding.

## Development Workflow

### Local install / test

Symlink (or copy) the project into Foundry's user data:

```bash
ln -s "$(pwd)" "$FOUNDRY_DATA/Data/modules/tor2eprint"
```

Then enable in **Configuration → Manage Modules** in a world running the `tor2e` system.

### Deploy to remote

`deploy.sh` (tracked) rsyncs only the runtime files (`module.json`, `tor2eprint.mjs`, `modules/`, `templates/`, `styles/`, `lang/`) with `--delete`, so nothing else (`fixtures/`, `backlog/`, `.git/`, docs) reaches the server and removed files don't linger. Target comes from `DEPLOY_TARGET` (env or `.env`, git-ignored); the script fails if unset. Add a runtime folder (e.g. `fonts/`) to the `--include` list and to the `release.yml` zip together.

```bash
DEPLOY_TARGET=host:path/Data/modules/tor2eprint   # in .env
./deploy.sh -n        # dry run: lists what would be sent/deleted
npm run deploy
```

Deployed `module.json` keeps the `#{VERSION}#` tokens (the release workflow fills them), so a dev deploy shows that as its version.

### Hot reload

`module.json` declares `flags.hotReload` for `hbs`, `css`, `json` under `templates/`, `styles/`, `lang/`. Edits propagate live without restarting Foundry.

### Verification checklist (run before "done")

- [ ] Module enables without console errors on v14 + tor2e 6.x
- [ ] Print button visible on each supported actor sheet type
- [ ] Click opens ApplicationV2 print window with actor data
- [ ] `window.print()` fires once on first render only
- [ ] Print preview shows clean layout, no Foundry chrome
- [ ] All labels resolve (no `tor2e.…` raw keys leaking through)

## Out of Scope (do not build unless asked)

- PDF export via Puppeteer / server-side rendering
- Compendium/journal printing
- Edit support in print view
- Non-tor2e systems
- Changes inside `ref/` (read-only references)
