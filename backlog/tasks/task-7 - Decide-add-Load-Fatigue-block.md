---
id: TASK-7
title: 'Decide: add Load / Fatigue block'
status: Blocked
assignee:
  - '@claude'
created_date: '2026-11-24T21:58:31Z'
updated_date: '2026-11-24T22:13:12Z'
labels:
  - template
  - idea
milestone: m-0
dependencies:
  - TASK-19
priority: low
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/improvements-from-tor2e-6.3.md U4. The print has no Load/Fatigue block. tor2e 6.2.1 sheet shows Fatigue (resources.travelLoad, tor2e.actors.stats.travelLoad) and Total Load = fatigue + item load (tor2e.actors.stats.totalLoad). The target layout ref/img/tor2e_img_example.png should decide. Layout change: needs user decision per CLAUDE.md Engineering Principle 4; decide with DH-13/DH-14. Confirm schema paths in character.model.mjs before reading.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 User decision recorded in notes
- [ ] #2 If added: block shows fatigue, item load and total load from confirmed schema paths with system i18n keys; layout still fits one A4 landscape page
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
Blocked: layout decision (Engineering Principle 4). Ask user: add Load/Fatigue block, and where?
<!-- SECTION:NOTES:END -->
