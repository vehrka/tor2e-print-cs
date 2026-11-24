---
id: TASK-4
title: Drop tor2e window class and dead armour group context
status: To Do
assignee:
  - '@claude'
created_date: '2026-11-24T21:58:30Z'
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
- [ ] #1 DEFAULT_OPTIONS.classes no longer contains "tor2e"
- [ ] #2 armours[] context has no group field and the template does not reference it
- [ ] #3 Hand check: print window styling and print preview unchanged
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Check in tests/smoke.mjs; `npm run smoke` passes (skip until the smoke tooling exists)
- [ ] #2 Hand check in a v14 + tor2e world if the change has UI: button shows, window opens and prints once, clean preview, no raw `tor2e.*` keys, no console errors
- [ ] #3 README.md and CLAUDE.md (Status, schema notes) updated in the same commit
- [ ] #4 module.json `compatibility` / `relationships` updated if the tested Foundry or tor2e build changed; release tag noted if it ships
<!-- DOD:END -->
