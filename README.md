# TOR2e Print Sheets

Foundry VTT v14 module. Adds a print-optimized character sheet for **The One Ring 2nd Edition** (`tor2e`) system.

Click the **print** icon in any character sheet's window header → opens a print window with a format toolbar → pick a format → native `window.print()` dialog opens. Pick again to reprint.

- **Classic**: A4 landscape, everything on the hero (history, traits, descriptions); long heroes flow onto a second page.
- **Portrait**: A4 portrait, one page, laid out like the printed One Ring character sheet; lists are cut to the fixed lines (4 war gear, 6 useful items), and traits other than distinctive features, flaws and history are left out.

## Requirements

- Foundry VTT **v14** (≥ 14.364, verified 14.370)
- `tor2e` system **≥ 6.0.0** (verified 6.3.0)

## Install

### Manifest URL (recommended)

In Foundry: **Add-on Modules → Install Module → Manifest URL**, paste:

```
https://github.com/vehrka/tor2e-print-cs/releases/latest/download/module.json
```

This tracks the latest release, so Foundry offers updates as new versions ship.

To pin a specific version instead (no auto-update):

```
https://github.com/vehrka/tor2e-print-cs/releases/download/v0.2.0/module.json
```

### Symlink (development)

```bash
ln -s "$(pwd)" "$FOUNDRY_DATA/Data/modules/tor2eprint"
```

### Copy

Copy the entire `tor2eprint/` folder into `$FOUNDRY_DATA/Data/modules/`.

Folder name must be exactly `tor2eprint`.

### Local Foundry and smoke tests (development)

Copy `.env.example` to `.env` and fill in the paths, then: `npm install`, `npm run link` (symlink into `$FOUNDRY_DATA/modules`), `npm run foundry` (local server on `$FOUNDRY_PORT`, launches `$FOUNDRY_WORLD`), `npm run smoke` (headless login, seeds the `fixtures/` heroes into the world if missing, runs `tests/smoke.mjs` in the page, exits 1 on failure). The dev world needs the `tor2e` system and this module enabled; see CLAUDE.md for the one-time setup.

### Deploy to a remote server (development)

Set `DEPLOY_TARGET=host:path/Data/modules/tor2eprint` in `.env` (or the environment), then `./deploy.sh -n` to preview and `npm run deploy` to sync. Only runtime files are sent; files removed locally are removed remotely. The deployed `module.json` shows `#{VERSION}#` as its version, since only the release workflow fills in the tokens.

### Enable

Launch a world running the `tor2e` system → **Game Settings → Manage Modules** → tick **TOR2e Print Sheets** → save.

## Usage

1. Open a **Player Character** actor sheet.
2. Click the **Print Sheet** button in the window header, next to the sheet title (it moves into the header's overflow menu if the window is narrow).
3. Print sheet window opens; browser print dialog fires after ~200 ms.
4. Choose paper: **A4 landscape**.
5. Enable **Background graphics** in the print dialog to keep red accents and filled pips.

## Scope (v0.2)

| Supported | Not yet |
|-----------|---------|
| `character` actor | `adversary`, `npc`, `community`, `lore` |
| Attributes, stature, resources, conditions | Editing in print view |
| Common skills (18) with pips, favoured, magical | PDF export |
| Combat proficiencies, parry | Compendium / journal print |
| Weapons + armour tables | Custom layouts |
| Equipment (miscellaneous items) | |
| Virtues, rewards, traits | |
| Biography + history | |

## File Layout

```
tor2eprint/
├── module.json
├── tor2eprint.mjs               # Init + getHeaderControlsApplicationV2 / renderActorSheetV2 hooks
├── modules/apps/character-print.mjs   # ApplicationV2 print sheet
├── templates/actors/character-print.hbs
├── styles/print.css             # Layout + @media print rules
└── lang/en.json
```

## Customization

- **Layout grid**: edit `.tp-cols-3` / `.tp-cols-2-1` in `styles/print.css`.
- **Colors**: change `#8b1a1a` (red accent) and `#f5ecd6` (cream bg) in `styles/print.css`.
- **Section order**: reorder `<section class="tp-block">` blocks in `templates/actors/character-print.hbs`.
- **Hot reload**: edits to `.hbs`, `.css`, `.json` reload live without restarting Foundry.

## Troubleshooting

**Print button missing on the actor sheet.**
The button is added through `getHeaderControlsApplicationV2`, with `renderActorSheetV2` as a fallback. Check the header's overflow menu first — a narrow window moves controls there. Reload the world (F5) after enabling. If still missing:
- Open console (F12) → check for errors loading `tor2eprint.mjs`.
- Confirm module is enabled in **Manage Modules**.
- Confirm actor is type `character` (NPC/adversary/community/lore not yet supported).

**Print preview shows Foundry chrome (sidebar, hotbar).**
Browser must support `:has()` selector (Chromium 105+, Firefox 121+, Safari 15.4+). Update Foundry's bundled Chromium or your browser.

**Filled pips / red headers print as white.**
Enable **Background graphics** (Chrome) or **Print backgrounds** (Firefox) in the print dialog.

**Characters from other actor types print incorrectly.**
v0.2 only supports `character`. Adversary/NPC/community/lore variants are out of scope.

## License

MIT.
