---
id: TASK-17
title: Document system upgrade procedure in CLAUDE.md
status: Done
assignee:
  - '@claude'
created_date: '2026-11-24T22:13:05Z'
updated_date: '2026-11-25T21:43:00Z'
labels:
  - docs
milestone: m-1
dependencies:
  - TASK-14
  - TASK-1
priority: low
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/improvements-from-dh-print.md DH-8. DH CLAUDE.md 'On a system upgrade': read release notes and migrations, re-clone/checkout the reference at the new tag, grep every data path the module reads, run smoke and a print preview, then bump verified. TOR depends on legacy {value} schema blocks, so this matters here. task-1 (TOR system update) records only the 'pin ref/foundryvtt-tor2e to a release tag' step; this task writes the full procedure around it, including how to recreate ref/foundryvtt-tor2e at a pinned tag from scratch.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 CLAUDE.md has an 'On a system upgrade' section with the steps above, using npm run smoke
- [x] #2 Section explains recreating ref/foundryvtt-tor2e at a pinned tag
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
CLAUDE.md 'On a system upgrade' section: release notes + migrations, pin/recreate ref at tag (clone URL = ref's origin, gitlab.com/herve.darritchon/foundryvtt-tor2e), diff of read paths + grep of system.*/tor2e.* usage, local system update + restart + npm run smoke (S2 as the gate), bump verified + restart. Docs only.
<!-- SECTION:NOTES:END -->
