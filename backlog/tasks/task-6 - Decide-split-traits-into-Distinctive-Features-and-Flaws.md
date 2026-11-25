---
id: TASK-6
title: 'Decide: split traits into Distinctive Features and Flaws'
status: Hand check
assignee:
  - '@claude'
created_date: '2026-11-24T21:58:31Z'
updated_date: '2026-11-25T21:40:31Z'
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
- [x] #1 User decision recorded in notes
- [x] #2 Template shows Distinctive Features and Flaws as two lists with localized system labels; empty group hidden
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
Classic: traitGroups.{features,flaws} (non-flaw = feature), headings tor2e.actors.traits.{distinctiveFeatures,flaws}, each list hidden when empty; TOR2EPRINT.Sections.Traits removed. None of the fixtures has a flaw (all migrated to distinctiveFeature), so smoke T5 also renders with a synthetic flaw. Fit checks unchanged.
<!-- SECTION:NOTES:END -->
