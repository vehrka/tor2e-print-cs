---
id: TASK-19
title: 'Decide: single-page shrink-to-fit vs flowing pages'
status: Blocked
assignee:
  - '@claude'
created_date: '2026-11-24T22:13:06Z'
updated_date: '2026-11-24T22:15:59Z'
labels:
  - css
  - code
  - idea
milestone: m-1
dependencies: []
priority: medium
ordinal: 12000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/improvements-from-dh-print.md DH-14 (CLAUDE.md Engineering Principle 4). TOR uses a flowing layout; rewards, virtues and biography can push the sheet onto a second page. DH lays out each page as a fixed mm box; variable text blocks marked .dh-fit shrink in 0.25 pt steps down to 5 pt (fitText() in ~/1_projects/101_dev/101.33_fvtt-dh-print-ch print-window.mjs:16-25, called from _onRender); too-long lists fold into '+k more' via a rows(list, n) helper; smoke guarantees fit. If one page is the requirement, copy fitText and rows exactly. This decision also gates the trait split and Load/Fatigue block (TOR system update, Blocked tasks) and the overlong-hero assertion in the fixture smoke task.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 User decision recorded in notes
- [ ] #2 If one page: fitText + rows ported, overlong fixture fits one A4 landscape page in smoke; if flowing: CLAUDE.md acceptance updated to allow multi-page
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
Blocked: user decision. One A4 page guaranteed (shrink-to-fit + truncation) or allow flow onto page 2?

Form layout (task-21..26) decided separately: single A4 portrait page, lists cut to fit, no +N more (new-layout-cs-v1 D3). This task is now only about the classic landscape layout.
<!-- SECTION:NOTES:END -->
