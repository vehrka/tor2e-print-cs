---
id: TASK-4
title: Drop tor2e window class and dead armour group context
status: Done
assignee:
  - '@claude'
created_date: '2026-11-24T21:58:30Z'
updated_date: '2026-11-25T22:04:11Z'
labels:
  - code
milestone: m-0
dependencies: []
priority: low
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/improvements-from-tor2e-6.3.md U5 + U3. (1) Tor2eCharacterPrint.DEFAULT_OPTIONS.classes includes "tor2e" (character-print.mjs:22), so the print window matches system-global .tor2e selectors; 6.2.x added more (e.g. .tor2e .window-resize-handle z-index, .tor2e.sheet.* sidebar rules). None match today (they need .sheet) but risk grows each release. styles/print.css does not use .tor2e. Remove it; keep tor2eprint, tor2eprint-window, print-sheet-window. (2) armours[].group (character-print.mjs:102) is built but unused in the template; 6.2.2 migration now fills it with 'leather' by default. Remove it.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 DEFAULT_OPTIONS.classes no longer contains "tor2e"
- [x] #2 armours[] context has no group field and the template does not reference it
- [x] #3 Hand check: print window styling and print preview unchanged
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 Check in tests/smoke.mjs; `npm run smoke` passes (skip until the smoke tooling exists)
- [x] #2 Hand check in a v14 + tor2e world if the change has UI: button shows, window opens and prints once, clean preview, no raw `tor2e.*` keys, no console errors
- [x] #3 README.md and CLAUDE.md (Status, schema notes) updated in the same commit
- [x] #4 module.json `compatibility` / `relationships` updated if the tested Foundry or tor2e build changed; release tag noted if it ships
<!-- DOD:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Removed 'tor2e' from DEFAULT_OPTIONS.classes and armours[].group (unused; form layout reads item groups directly). FINDING: the .tor2e class was what gave the print h2/h3 the system heading font (Aniron, via tor2e common.less '.tor2e h2 { font-family: var(--tor2e-font-h2) }'). Without it headings fell back to Palatino. Fixed by referencing the same vars on .tor2e-print h2/h3 (font still loaded globally by tor2e). Pixel diff of the classic window before/after: sheet area identical except a 3px strip at the bottom edge; the window title bar font changes from Aniron to Foundry default (outside the printed sheet). Smoke all pass. AC3 print preview: PDF checks unchanged; real preview still to hand check.

Hand check passed in a v14 + tor2e world (user, 2026-11-25).
<!-- SECTION:NOTES:END -->
