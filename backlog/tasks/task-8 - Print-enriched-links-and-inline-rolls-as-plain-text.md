---
id: TASK-8
title: Print enriched links and inline rolls as plain text
status: To Do
assignee:
  - '@claude'
created_date: '2026-11-24T22:13:03Z'
labels:
  - css
milestone: m-1
dependencies: []
priority: high
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/improvements-from-dh-print.md DH-2. styles/print.css has no rule for enriched content, so content links and inline rolls print as dark Foundry pills with icons (worse on the cream background). DH (~/1_projects/101_dev/101.33_fvtt-dh-print-ch/styles/print.css:116-120) uses: .dh-print :is(a.inline-roll, a.content-link) { background: none; border: 0; padding: 0; color: inherit; font-weight: 700; white-space: normal; box-shadow: none; } and .dh-print :is(a.inline-roll, a.content-link) > i { display: none; }. Add the same two rules scoped to .tor2e-print. Pairs with task-2 (enrichment options, TOR system update).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Both rules exist in styles/print.css scoped to .tor2e-print
- [ ] #2 Hand check: a @UUID link and an inline roll in history/item description print as bold plain text, no pill, no icon
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Check in tests/smoke.mjs; `npm run smoke` passes (skip until the smoke tooling exists)
- [ ] #2 Hand check in a v14 + tor2e world if the change has UI: button shows, window opens and prints once, clean preview, no raw `tor2e.*` keys, no console errors
- [ ] #3 README.md and CLAUDE.md (Status, schema notes) updated in the same commit
- [ ] #4 module.json `compatibility` / `relationships` updated if the tested Foundry or tor2e build changed; release tag noted if it ships
<!-- DOD:END -->
