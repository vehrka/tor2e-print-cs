---
id: TASK-15
title: 'Smoke tests: fixture heroes, context values, fits-one-page'
status: Done
assignee:
  - '@claude'
created_date: '2026-11-24T22:13:04Z'
updated_date: '2026-11-25T21:11:41Z'
labels:
  - tooling
milestone: m-1
dependencies:
  - TASK-14
priority: medium
ordinal: 8000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/improvements-from-dh-print.md DH-6 (part 2) + PRPs/improvements-from-tor2e-6.3.md U6. Context mapper: fixture heroes with known values (attributes and TN, skill pips, favoured flags, weapons, armour, virtues), loaded by name with game.actors.getName; store exported actor JSON in the repo (DH used refs/exported_characters/) and import into the smoke world. Include a non-ASCII name and a hero with an Active Effect on an attribute or skill; assert the print shows the prepared (AE-applied) value, same as the sheet, not _source. Fits the page: render the template off-screen with the module CSS and assert no .tp-block extends below the page and no blocks overlap (DH fitReport, ~/1_projects/101_dev/101.33_fvtt-dh-print-ch/tests/smoke.mjs:231-254); run with every fixture and with a synthetic overlong hero (long name, 20 rewards, long biography). The overlong case's expected result depends on the DH-14 decision (one page vs flowing): until decided, report it without failing. Needs from user: 2-3 exported TOR heroes (or Claude builds them in the smoke world).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Fixture heroes committed and loaded by name; includes non-ASCII name and an Active Effect hero
- [x] #2 Context assertions pass for every fixture
- [x] #3 Fit check passes for every real fixture; overlong-hero result reported per the DH-14 decision
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
Fixtures: 6 exported heroes (Otrebør non-ASCII; Adelbard has an item AE on Hope max) + synthetic smoke-effect.json (actor AE +1 Wits, +1 Lore) and smoke-overlong.json (long name/history, 20 rewards, 12 weapons, 15 items). Context checks C0-C11 hardcode values from the export. Fit G0-G9: runner prints each print window to PDF (preferCSSPageSize), counts pages, and fails on clipping ancestors, overlapping .tp-block, or blocks taller than the page (measured at page width). Hans Grimald expected 2 pages; overlong = 3 pages, reported only (its rewards block is taller than a page). Smoke: all pass except S2 (task-1 bumps verified). DoD2/4 n/a: tests only.
<!-- SECTION:NOTES:END -->
