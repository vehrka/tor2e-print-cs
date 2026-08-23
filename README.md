# TOR2e Print Sheets

Foundry VTT v14 module. Adds a print-optimized character sheet for **The One Ring 2nd Edition** (`tor2e`) system.

Click the **print** icon in any character sheet's window header → opens a print-friendly window → native `window.print()` dialog fires automatically.

## Requirements

- Foundry VTT **v14**
- `tor2e` system **≥ 6.0.0** (verified 6.1.0)

## Install

### Symlink (development)

```bash
ln -s "$(pwd)" "$FOUNDRY_DATA/Data/modules/tor2eprint"
```

### Copy

Copy the entire `tor2eprint/` folder into `$FOUNDRY_DATA/Data/modules/`.

Folder name must be exactly `tor2eprint`.

### Enable

Launch a world running the `tor2e` system → **Game Settings → Manage Modules** → tick **TOR2e Print Sheets** → save.

## Usage

1. Open a **Player Character** actor sheet.
2. Click the **Print Sheet** button in the window header strip (next to "PopOut!" / "Sheet" / "Close" on tor2e 5.x; next to the title on tor2e 6.x ApplicationV2 sheets).
3. Print sheet window opens; browser print dialog fires after ~200 ms.
4. Choose paper: **A4 landscape**.
5. Enable **Background graphics** in the print dialog to keep red accents and filled pips.

## Scope (v0.1)

| Supported | Not yet |
|-----------|---------|
| `character` actor | `adversary`, `npc`, `community` |
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
├── tor2eprint.mjs               # Init + getActorSheetHeaderButtons (legacy) + renderActorSheetV2 hooks
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
Module wires two hooks (`getActorSheetHeaderButtons` for legacy `ActorSheet`, `renderActorSheetV2` for ApplicationV2). One should fire. Reload the world (F5) after enabling. If still missing:
- Open console (F12) → check for errors loading `tor2eprint.mjs`.
- Confirm module is enabled in **Manage Modules**.
- Confirm actor is type `character` (NPC/adversary/community not yet supported).

**Print preview shows Foundry chrome (sidebar, hotbar).**
Browser must support `:has()` selector (Chromium 105+, Firefox 121+, Safari 15.4+). Update Foundry's bundled Chromium or your browser.

**Filled pips / red headers print as white.**
Enable **Background graphics** (Chrome) or **Print backgrounds** (Firefox) in the print dialog.

**Characters from other actor types print incorrectly.**
v0.1 only supports `character`. Adversary/NPC variants are out of scope.

## License

MIT.
