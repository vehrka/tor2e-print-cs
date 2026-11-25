---
id: TASK-16
title: Pin Foundry core compatibility to tested builds
status: To Do
assignee:
  - '@claude'
created_date: '2026-11-24T22:13:05Z'
labels:
  - release
milestone: m-1
dependencies:
  - TASK-14
priority: medium
ordinal: 9000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/improvements-from-dh-print.md DH-7. module.json has compatibility { minimum: '14', verified: '14' }. DH pins exact builds: { minimum: '14.364', verified: '14.370', maximum: '14' }. Change: set minimum/verified to the exact v14 builds actually tested (smoke + hand check), add maximum: '14' so v15 shows the module as unverified. Keep the tor2e relationship (handled by task-1 in TOR system update). Update the manifest example in CLAUDE.md.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 module.json compatibility has exact minimum/verified builds and maximum '14'
- [ ] #2 Tested build recorded in task notes; CLAUDE.md manifest block matches
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Check in tests/smoke.mjs; `npm run smoke` passes (skip until the smoke tooling exists)
- [ ] #2 Hand check in a v14 + tor2e world if the change has UI: button shows, window opens and prints once, clean preview, no raw `tor2e.*` keys, no console errors
- [ ] #3 README.md and CLAUDE.md (Status, schema notes) updated in the same commit
- [ ] #4 module.json `compatibility` / `relationships` updated if the tested Foundry or tor2e build changed; release tag noted if it ships
<!-- DOD:END -->
