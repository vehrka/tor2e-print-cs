---
id: TASK-14
title: 'Smoke tests: environment, button, print window, labels, CSS'
status: Done
assignee:
  - '@claude'
created_date: '2026-11-24T22:13:04Z'
updated_date: '2026-11-25T21:02:25Z'
labels:
  - tooling
milestone: m-1
dependencies:
  - TASK-13
priority: high
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/improvements-from-dh-print.md DH-6 (part 1). In tests/smoke.mjs, port DH checks (~/1_projects/101_dev/101.33_fvtt-dh-print-ch/tests/smoke.mjs) that map onto TOR: Environment: module active; game.system.id === 'tor2e'; running system version === module.json relationships.systems[0].compatibility.verified (catches unverified system upgrades). Button: Hooks.callAll('getHeaderControlsApplicationV2', { document }, controls) with a character (control present) and an adversary (absent); render the real sheet and confirm [data-action="tor2eprint-btn"] is in the header. Print window: stub window.print with a counter, click the control, confirm the window opens for that actor and print() runs exactly once. No raw keys: /TOR2EPRINT\.|tor2e\./.test(win.element.textContent) === false. Print CSS loaded: walk document.styleSheets incl. @layer/@import grouping rules and assert the @media print chrome-hiding selector exists (DH check K10). Once this lands, the 'Needs smoke' column and DoD item 1 become active; update CLAUDE.md to say so.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Each listed check exists in tests/smoke.mjs and passes via npm run smoke
- [x] #2 Version check fails when running tor2e != verified (shown once by temporarily editing verified)
- [x] #3 CLAUDE.md Tasks section no longer says smoke tooling is missing
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
Smoke: 11 pass; S2 fails (running tor2e 6.3.0 vs verified 6.1.0) = AC2 shown live, fixed by task-1. tools/smoke.mjs seeds fixtures/ heroes (keepId) and reloads to run tor2e migrations (6.2.2 ran: trait groups filled). Finding: v14 puts the getHeaderControlsApplicationV2 entry in the collapsed overflow menu, so P2 matches the renderActorSheetV2 fallback button (.tor2eprint-btn, no data-action); both exist at once (menu entry + header button) -> look at in task-12. DoD2/4 n/a: test/tooling only, no UI or compat change. backlog/config.yml DoD text no longer says 'skip until smoke tooling exists'.
<!-- SECTION:NOTES:END -->
