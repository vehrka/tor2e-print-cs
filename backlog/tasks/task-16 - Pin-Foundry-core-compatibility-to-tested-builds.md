---
id: TASK-16
title: Pin Foundry core compatibility to tested builds
status: Done
assignee:
  - '@claude'
created_date: '2026-11-24T22:13:05Z'
updated_date: '2026-11-25T21:42:44Z'
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
- [x] #1 module.json compatibility has exact minimum/verified builds and maximum '14'
- [x] #2 Tested build recorded in task notes; CLAUDE.md manifest block matches
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
module.json compatibility { minimum 14.364, verified 14.370, maximum 14 }. Tested build: 14.370 (local dev server, full smoke 63 pass after restart with the new manifest; module active). minimum 14.364 is NOT smoke-tested here: it is the build the fixture exports came from (Otrebør _stats.coreVersion), i.e. the user's server; picked so the module does not go incompatible there. Raise minimum to 14.370 if the server is upgraded. CLAUDE.md manifest block, Target line and README updated.
<!-- SECTION:NOTES:END -->
