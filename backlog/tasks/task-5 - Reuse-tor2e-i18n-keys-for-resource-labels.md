---
id: TASK-5
title: Reuse tor2e i18n keys for resource labels
status: To Do
assignee:
  - '@claude'
created_date: '2026-11-24T21:58:30Z'
labels:
  - i18n
  - template
milestone: m-0
dependencies: []
priority: low
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/improvements-from-tor2e-6.3.md U4. 6.2.1 (#713) relabelled resources to official terms: tor2e.actors.stats.shadowPoints ('Shadow Points'), tor2e.actors.stats.shadowScars ('Shadow Scars'), tor2e.actors.stats.travelLoad ('Fatigue'), tor2e.actors.stats.totalLoad ('Total Load'). The print uses its own TOR2EPRINT.Labels.* (lang/en.json), so translated worlds keep English labels on the print. Replace TOR2EPRINT labels with system keys where an equivalent exists (confirm each key in ref/foundryvtt-tor2e/src/lang/en.json and that the meaning matches); remove TOR2EPRINT entries that become unused. Keep print-only labels (e.g. F/M/TN abbreviations) if no system key fits.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Each TOR2EPRINT.Labels entry with an exact system equivalent is replaced by the tor2e.* key in template/JS
- [ ] #2 Unused TOR2EPRINT keys removed from lang/en.json
- [ ] #3 Hand check: no raw keys; English text unchanged
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Check in tests/smoke.mjs; `npm run smoke` passes (skip until the smoke tooling exists)
- [ ] #2 Hand check in a v14 + tor2e world if the change has UI: button shows, window opens and prints once, clean preview, no raw `tor2e.*` keys, no console errors
- [ ] #3 README.md and CLAUDE.md (Status, schema notes) updated in the same commit
- [ ] #4 module.json `compatibility` / `relationships` updated if the tested Foundry or tor2e build changed; release tag noted if it ships
<!-- DOD:END -->
