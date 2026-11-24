---
id: TASK-6
title: 'Decide: split traits into Distinctive Features and Flaws'
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
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/improvements-from-tor2e-6.3.md U3. After the 6.2.2 migration trait.system.group.value is always distinctiveFeature or flaw (ref config.js:299-300). The sheet lists them separately; the print lumps them in one Traits list. Option: two lists labelled with the system's trait group keys (confirm exact path in ref/foundryvtt-tor2e/src/lang/en.json, PRP names tor2e.traits.groups.{distinctiveFeature,flaw}). Layout change: needs user decision per CLAUDE.md Engineering Principle 4; decide together with DH-13/DH-14 layout work.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 User decision recorded in notes
- [ ] #2 If split: template shows two lists with localized system labels; empty group hidden; layout still fits one A4 landscape page
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
Blocked: layout decision (Engineering Principle 4). Ask user: split traits into two lists, or keep one list?
<!-- SECTION:NOTES:END -->
