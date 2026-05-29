#CLAUDE.md — TOR2e Print Sheet (Foundry VTT v13 Module)

## Project Overview

Foundry VTT v13 **module** that adds a print-optimized character-sheet layout for the **The One Ring 2nd edition** system (`tor2e`). Adds a "Print" button to the existing actor sheet; clicking opens a separate ApplicationV2 window rendering a print-friendly Handlebars template, then auto-triggers `window.print()`.

- **Module id:** `tor2eprint` (folder name must match)
- **Target:** Foundry VTT v13 (minimum 13)
- **Depends on system:** `tor2e` (>= 5.0.0)
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

> Note: `ref/tor-2e-macros/` not currently checked out. `ref/` is read-only — never modify.

## Status

- **v0.1 implemented:** `character` actor type only. Files in repo root: `module.json`, `tor2eprint.mjs`, `modules/apps/character-print.mjs`, `templates/actors/character-print.hbs`, `styles/print.css`, `lang/en.json`, `README.md`, `deploy.sh`. Print context covers attributes, stature, resources, conditions, common skills (by attribute, with pips/favoured/magical), combat proficiencies, weapons, armour, equipment (`miscellaneous` items), virtues, rewards, traits, biography, history.
- **Not implemented:** `adversary`, `npc`, `community` print variants. Defer until requested.

## TOR2e System Schema (read before coding sheet logic)

- **Actor types:** `community`, `npc`, `adversary`, `character` (player hero); see `ref/foundryvtt-tor2e/src/template.json` and `ref/foundryvtt-tor2e/src/modules/models/actors/*.model.mjs`
- **Item types:** weapon, armour, skill, virtues (note: type id is plural `virtues`, not `virtue`), reward, trait, song, mount, journey-log, undertaking, fell-ability, combat-task, standing, miscellaneous (see `ref/foundryvtt-tor2e/src/modules/models/items/`)
- **Existing sheets to inject Print button into:** legacy `Tor2eCharacterSheet` (tor2e 5.x; legacy `ActorSheet`). Future `Tor2eCharacterSheetV2` (tor2e 6.x; `ApplicationV2`). Module supports both via dual hook (see Button injection below).
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
├── deploy.sh                # rsync deploy to remote Foundry data dir (excludes ref/)
├── README.md
└── CLAUDE.md                # This file
```

Future actor-type variants (adversary/npc/community) follow the same `*-print.mjs` + `*-print.hbs` pattern under the existing dirs.

### v13 Patterns (mandatory)

- **Print window:** `ApplicationV2` + `HandlebarsApplicationMixin` only — no `Application`/`FormApplication` for our own classes. (Note: tor2e 5.x system sheet is legacy `ActorSheet` — that's external code, do not touch.)
- **Pattern (mirror `ref/starwarsd6/modules/apps/character-print.mjs`):**
  - `static DEFAULT_OPTIONS` with `classes`, `position`, `window`
  - `static PARTS` mapping `sheet` → template path under `modules/tor2eprint/templates/...`
  - `_prepareContext(options)` builds the Handlebars context from `actor.system` + `actor.items`
  - `_onRender(context, options)` triggers `window.print()` on `options.isFirstRender`
- **Button injection (dual hook):**
  - `Hooks.on("getActorSheetHeaderButtons", (sheet, buttons) => …)` — for legacy `ActorSheet` (tor2e 5.x). Push `{label, class, icon, onclick}` into `buttons` array. Foundry renders it next to "PopOut! / Sheet / Prototype Token / Close".
  - `Hooks.on("renderActorSheetV2", (app, html) => …)` — for ApplicationV2 sheet (tor2e 6.x+). `html` is `HTMLElement`. Inject button after `.window-header .window-title`.
  - Both hooks active concurrently: idempotent guards (`buttons.some(b => b.class === "tor2eprint-btn")` / `header.querySelector(".tor2eprint-btn")`) prevent duplicates if both fire.
  - Guard `actor.type === "character"` in both. Click handler: `openPrint(actor)` → `new Tor2eCharacterPrint({ document: actor }).render(true)`.
  - Note: tor2e 5.x ships **legacy** `ActorSheet` (verified empirically — header shows PopOut!/Sheet/Prototype Token/Close, not v13 ApplicationV2 chrome). Keep both hooks until tor2e migrates.
- **No deprecated APIs:** avoid `mergeObject`, `duplicate`, jQuery sheet-data mutations, old `getData`-based sheets.
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
  "version": "0.1.0",
  "compatibility": { "minimum": "13", "verified": "13", "maximum": "13" },
  "authors": [{ "name": "pedrof" }],
  "esmodules": ["tor2eprint.mjs"],
  "styles": ["styles/print.css"],
  "languages": [{ "lang": "en", "name": "English", "path": "lang/en.json" }],
  "relationships": {
    "systems": [
      { "id": "tor2e", "type": "system", "compatibility": { "minimum": "5.0.0" } }
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

- One actor = one logical page. `@page { size: A4 landscape; margin: 10mm; }` (matches `ref/img/tor2e_img_example.png`).
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
3. Define acceptance: button renders on actor sheet → click opens print window → window auto-prints → layout fits one A4. Verify in a running v13 instance before reporting done.
4. Surface tradeoffs when picking layout (single-page squeeze vs multi-page) — ask before deciding.

## Development Workflow

### Local install / test

Symlink (or copy) the project into Foundry's user data:

```bash
ln -s "$(pwd)" "$FOUNDRY_DATA/Data/modules/tor2eprint"
```

Then enable in **Configuration → Manage Modules** in a world running the `tor2e` system.

### Deploy to remote

`deploy.sh` rsyncs the module to a remote Foundry data dir, excluding `ref/`:

```bash
rsync -azP --exclude ref/ . vehrka:share/foundrydata_13/Data/modules/tor2eprint/
```

Edit host/path to match target.

### Hot reload

`module.json` declares `flags.hotReload` for `hbs`, `css`, `json` under `templates/`, `styles/`, `lang/`. Edits propagate live without restarting Foundry.

### Verification checklist (run before "done")

- [ ] Module enables without console errors on v13 + tor2e
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
