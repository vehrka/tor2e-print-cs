---
id: TASK-7
title: 'Decide: add Load / Fatigue block'
status: Hand check
assignee:
  - '@claude'
created_date: '2026-11-24T21:58:31Z'
updated_date: '2026-11-25T21:41:37Z'
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
- [x] #1 User decision recorded in notes
- [x] #2 Endurance block shows fatigue, item load and total load from confirmed schema paths with system i18n keys
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 Check in tests/smoke.mjs; `npm run smoke` passes (skip until the smoke tooling exists)
- [ ] #2 Hand check in a v14 + tor2e world if the change has UI: button shows, window opens and prints once, clean preview, no raw `tor2e.*` keys, no console errors
- [x] #3 README.md and CLAUDE.md (Status, schema notes) updated in the same commit
- [x] #4 module.json `compatibility` / `relationships` updated if the tested Foundry or tor2e build changed; release tag noted if it ships
<!-- DOD:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Classic Endurance cell now lists Current, Load (item load), Fatigue (travelLoad), Total Load (getLoad(), fallback items+fatigue) with tor2e.actors.stats.{current,load,travelLoad,totalLoad}. Sources per task-22. Values filled in (Hope's Shadow lines stay blank as before). Smoke T6 (Hakkon 27/20/0/22, matches sheet incl. load AE); fit checks unchanged (same page counts).
<!-- SECTION:NOTES:END -->
