---
id: TASK-25
title: 'Form layout CSS: A4 portrait, single page, white/red'
status: To Do
assignee:
  - '@claude'
created_date: '2026-11-24T22:15:44Z'
labels:
  - css
  - docs
milestone: m-2
dependencies:
  - TASK-24
  - TASK-9
priority: high
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/new-layout-cs-v1.md (target image ref/img/new_cs_v1.jpg). §6, D1/D3/D9. Scope every rule under .tor2e-print.tp-form. Named page: @page tor2e-portrait { size: A4 portrait; margin: 8mm; } and .tp-form { page: tor2e-portrait; }. Needs body block flow (body:has(.tor2e-print) { display: block !important; position: static; height: auto; overflow: visible }): that is task-9 (DH Print parity), so do task-9 first. Grid: header row; character / portrait / conditions row; 3-column body (attribute -> skills -> useful items -> proficiencies/rewards/virtues -> endurance/hope/parry) with grid-template-columns: repeat(3, 1fr) and vertical rules as column borders; 2-column footer (war gear | armour + protection). Colours (D9): white page, #8b1a1a lines and text; cream stays for classic only. Diamonds: one class, rotate(45deg) bordered square with counter-rotated value, three sizes (pip, rating, TN); filled pip red with print-color-adjust: exact. Section headings with side rules (flex + ::before/::after border-top); no scroll flourishes in v1. Writing lines: border-bottom on fixed-height rows. Rewards/virtues boxes fixed height + overflow: hidden (cut to fit, no +N more, no page 2: D3). break-inside: avoid per block. Toolbar style: .tor2e-print-toolbar { display: flex; gap: .5rem; padding: .5rem } and button.active { font-weight: bold } (if not done in the toolbar task). Risk: named @page + body override can affect classic; test both. Update CLAUDE.md Print Layout Rules: classic = A4 landscape, cream; form = A4 portrait, white/red. If task-15 (fit smoke) exists, add the form format to it.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Form layout fits one A4 portrait page in Chrome/Electron print preview for a hero with 4 weapons, 6 items, 3 rewards, 3 virtues
- [ ] #2 Overlong hero (10 weapons, 15 items, 10 rewards) still prints on one page, extra entries cut
- [ ] #3 Classic layout still prints A4 landscape, cream, unchanged
- [ ] #4 Filled pips, diamonds and lines print without 'Background graphics' enabled
- [ ] #5 CLAUDE.md Print Layout Rules list both layouts
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Check in tests/smoke.mjs; `npm run smoke` passes (skip until the smoke tooling exists)
- [ ] #2 Hand check in a v14 + tor2e world if the change has UI: button shows, window opens and prints once, clean preview, no raw `tor2e.*` keys, no console errors
- [ ] #3 README.md and CLAUDE.md (Status, schema notes) updated in the same commit
- [ ] #4 module.json `compatibility` / `relationships` updated if the tested Foundry or tor2e build changed; release tag noted if it ships
<!-- DOD:END -->
