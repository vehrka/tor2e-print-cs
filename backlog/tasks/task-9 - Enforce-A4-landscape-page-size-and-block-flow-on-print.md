---
id: TASK-9
title: Enforce A4 landscape page size and block flow on print
status: To Do
assignee:
  - '@claude'
created_date: '2026-11-24T22:13:03Z'
labels:
  - css
  - docs
milestone: m-1
dependencies: []
priority: high
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/improvements-from-dh-print.md DH-3. CLAUDE.md says @page { size: A4 landscape; margin: 10mm; } but styles/print.css:1 has only @page { margin: 8mm; } with no size, so the browser uses its default (usually portrait) and 'fits one A4 landscape' is not enforced. Named/sized @page applies only when ancestors are in block flow; Foundry's body is a fixed flex box. DH (~/1_projects/101_dev/101.33_fvtt-dh-print-ch/styles/print.css:309-316) sets body:has(.dh-print) { display: block !important; position: static; height: auto; overflow: visible } inside @media print. The current rule here (print.css:445, 'body :has(.tor2e-print)') flattens only body's descendants, not body. Change: explicit size A4 landscape, add body:has(.tor2e-print) block-flow override, make margin in CSS and CLAUDE.md agree (pick one value; current CSS 8mm vs doc 10mm).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 @page sets size: A4 landscape
- [ ] #2 @media print has a body:has(.tor2e-print) block-flow override
- [ ] #3 CLAUDE.md Print Layout Rules and print.css state the same size and margin
- [ ] #4 Hand check: print preview defaults to A4 landscape without changing browser settings
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Check in tests/smoke.mjs; `npm run smoke` passes (skip until the smoke tooling exists)
- [ ] #2 Hand check in a v14 + tor2e world if the change has UI: button shows, window opens and prints once, clean preview, no raw `tor2e.*` keys, no console errors
- [ ] #3 README.md and CLAUDE.md (Status, schema notes) updated in the same commit
- [ ] #4 module.json `compatibility` / `relationships` updated if the tested Foundry or tor2e build changed; release tag noted if it ships
<!-- DOD:END -->
