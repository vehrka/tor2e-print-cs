---
id: TASK-15
title: 'Smoke tests: fixture heroes, context values, fits-one-page'
status: To Do
assignee:
  - '@claude'
created_date: '2026-11-24T22:13:04Z'
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
- [ ] #1 Fixture heroes committed and loaded by name; includes non-ASCII name and an Active Effect hero
- [ ] #2 Context assertions pass for every fixture
- [ ] #3 Fit check passes for every real fixture; overlong-hero result reported per the DH-14 decision
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Check in tests/smoke.mjs; `npm run smoke` passes (skip until the smoke tooling exists)
- [ ] #2 Hand check in a v14 + tor2e world if the change has UI: button shows, window opens and prints once, clean preview, no raw `tor2e.*` keys, no console errors
- [ ] #3 README.md and CLAUDE.md (Status, schema notes) updated in the same commit
- [ ] #4 module.json `compatibility` / `relationships` updated if the tested Foundry or tor2e build changed; release tag noted if it ships
<!-- DOD:END -->
