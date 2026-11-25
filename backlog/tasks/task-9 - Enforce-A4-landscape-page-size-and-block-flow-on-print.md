---
id: TASK-9
title: Enforce A4 landscape page size and block flow on print
status: Done
assignee:
  - '@claude'
created_date: '2026-11-24T22:13:03Z'
updated_date: '2026-11-25T22:04:08Z'
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
- [x] #1 @page sets size: A4 landscape
- [x] #2 @media print has a body:has(.tor2e-print) block-flow override
- [x] #3 CLAUDE.md Print Layout Rules and print.css state the same size and margin
- [x] #4 Hand check: print preview defaults to A4 landscape without changing browser settings
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
Margin 8mm (user, 2026-11-25). Finding: before, no size + Foundry's fixed body clipped the print to one page, so overflow was silently cut. With A4 landscape + block flow every fixture spilled to page 2 (~229mm vs 194mm). User chose: tighten print CSS (print-only density block: gaps, paddings, 9pt lists/skills, 8.5pt tables, 22mm portrait). Now 6/7 fixtures = 1 page; Hans Grimald (14 rewards/virtues/traits) = 2 pages (mid row 92mm vs ~71mm budget). Overlong hero = 3 pages; its 20-reward block is taller than a page and splits. AC4 proxy: headless Chromium page.pdf(preferCSSPageSize) gives A4 landscape with default settings; real browser print dialog still to hand check. DoD4 n/a.

Hand check passed in a v14 + tor2e world (user, 2026-11-25).
<!-- SECTION:NOTES:END -->
