---
id: TASK-1
title: Re-verify on tor2e 6.3.0 and bump verified version
status: To Do
assignee:
  - '@claude'
created_date: '2026-11-24T21:58:30Z'
labels:
  - release
  - system-upgrade
  - docs
milestone: m-0
dependencies: []
priority: high
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/improvements-from-tor2e-6.3.md, U1. Diff v6.1.0..v6.3.0 shows no breaking change: character model whitespace-only; item fields read by the print (damage, injury, load, notes, skill, ranged, equipped, protection, quantity, description) unchanged; Tor2eCharacterSheetV2 now extends Tor2eActorSheetV2 (still HandlebarsApplicationMixin(ActorSheetV2), no _getHeaderControls override) so getHeaderControlsApplicationV2 and renderActorSheetV2 still fire; every tor2e.* i18n key used in the template still exists. ref/foundryvtt-tor2e is already checked out at tag v6.3.0 (was on develop, 86 unreleased commits past it). Work: hand check in a v14 + tor2e 6.3.0 world, then bump module.json relationships.systems[0].compatibility.verified 6.1.0 -> 6.3.0 and the CLAUDE.md 'Depends on system' line; record in CLAUDE.md how to pin ref/foundryvtt-tor2e to a release tag (git -C ref/foundryvtt-tor2e checkout vX.Y.Z). Full upgrade procedure is DH-8 (DH Print parity), not this task. Note for DH-6 smoke fixtures (U6): include a hero with an Active Effect on an attribute/skill and assert print == sheet (prepared value, not _source).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 ref/foundryvtt-tor2e is at tag v6.3.0 (git describe --tags prints v6.3.0)
- [ ] #2 Hand check passes in v14 + tor2e 6.3.0: button shows, window opens, prints once, clean preview, no raw tor2e.* keys, no console errors
- [ ] #3 module.json tor2e compatibility.verified is 6.3.0
- [ ] #4 CLAUDE.md says verified 6.3.0 and documents pinning ref/foundryvtt-tor2e to a release tag
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Check in tests/smoke.mjs; `npm run smoke` passes (skip until the smoke tooling exists)
- [ ] #2 Hand check in a v14 + tor2e world if the change has UI: button shows, window opens and prints once, clean preview, no raw `tor2e.*` keys, no console errors
- [ ] #3 README.md and CLAUDE.md (Status, schema notes) updated in the same commit
- [ ] #4 module.json `compatibility` / `relationships` updated if the tested Foundry or tor2e build changed; release tag noted if it ships
<!-- DOD:END -->
