---
id: TASK-18
title: 'Decide: preview first with Print button vs auto-print'
status: Done
assignee:
  - '@claude'
created_date: '2026-11-24T22:13:05Z'
updated_date: '2026-11-24T22:15:59Z'
labels:
  - code
  - template
  - idea
milestone: m-1
dependencies: []
priority: medium
ordinal: 11000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/improvements-from-dh-print.md DH-13. DH does not auto-print: a toolbar part (print-toolbar.hbs) shows one button per format; click renders and calls print() once via a #printPending flag in _onRender. For TOR (one format) a single Print button in a toolbar part would: allow checking the preview first and reprinting without reopening; remove the print-before-images-load risk (DH-4); simplify smoke tests (call printFormat(), no first-render dependency). Cost: one more part + template. Auto-print is part of the current spec (CLAUDE.md acceptance: 'window auto-prints'), so this is a user decision. If adopted: update CLAUDE.md acceptance + verification checklist and the print-once smoke check.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 User decision recorded in notes
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
Blocked: user decision. Keep auto-print on open, or switch to preview + Print button?

Decided 2026-11-24 in PRPs/new-layout-cs-v1.md D2: adopt preview + toolbar (one button per format, print once per pick). Implementation moved to task-21 (New layouts); AC2 removed here to avoid duplicate work. DoD items n/a: decision only, no code.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Decision: adopt toolbar. Implemented by task-21.
<!-- SECTION:FINAL_SUMMARY:END -->
