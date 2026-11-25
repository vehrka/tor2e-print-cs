---
id: TASK-10
title: Wait for fonts and images before auto-print
status: To Do
assignee:
  - '@claude'
created_date: '2026-11-24T22:13:03Z'
updated_date: '2026-11-24T22:16:00Z'
labels:
  - code
milestone: m-1
dependencies: []
priority: medium
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/improvements-from-dh-print.md DH-4. _onRender (modules/apps/character-print.mjs:165-171) calls setTimeout(() => win.print(), 200) on first render. The sheet shows the actor portrait; 200 ms can capture the page before the image loads. Change: before print(), await document.fonts.ready and Promise.allSettled of img.decode() for every <img> in this.element, then print once. Goes beyond DH; if adopted, port back to DH too. If DH-13 (preview-first toolbar) is adopted later, the same wait moves to the toolbar handler.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 print() runs after document.fonts.ready and all img.decode() promises settle; no fixed timer
- [ ] #2 A failed image decode does not block printing
- [ ] #3 print() still fires exactly once, on first render only
- [ ] #4 Hand check: portrait is present in the print preview on first open
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Check in tests/smoke.mjs; `npm run smoke` passes (skip until the smoke tooling exists)
- [ ] #2 Hand check in a v14 + tor2e world if the change has UI: button shows, window opens and prints once, clean preview, no raw `tor2e.*` keys, no console errors
- [ ] #3 README.md and CLAUDE.md (Status, schema notes) updated in the same commit
- [ ] #4 module.json `compatibility` / `relationships` updated if the tested Foundry or tor2e build changed; release tag noted if it ships
<!-- DOD:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
task-21 removes first-render auto-print in favour of a toolbar print-once-per-pick. If task-21 lands first, put the fonts/images wait in the #printPending path instead.
<!-- SECTION:NOTES:END -->
