---
id: TASK-2
title: Pass relativeTo, rollData and secrets:false to enrichHTML
status: To Do
assignee:
  - '@claude'
created_date: '2026-11-24T21:58:30Z'
labels:
  - code
  - bug
milestone: m-0
dependencies: []
priority: high
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/improvements-from-tor2e-6.3.md U2 (confirms DH-1 in PRPs/improvements-from-dh-print.md; this task implements DH-1, do not duplicate it under DH Print parity). enrich() in modules/apps/character-print.mjs:14-17 calls enrichHTML(String(html)) with no options. Risk: secrets default depends on document ownership, so a GM printing a player's hero can print <section class="secret"> blocks; relative @UUID[.xxx] links don't resolve without relativeTo; [[/r @attr]] inline rolls don't resolve without rollData. tor2e 6.3.0 sheet uses { secrets: actor.isOwner, relativeTo: actor } for history (character-sheet.mjs:275) and relativeTo: item for item descriptions (character-sheet.mjs:296,316). Print must keep secrets: false always: a printout is a handout. Chip styling of links (DH-2) stays in DH Print parity.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 History/biography enriched with { relativeTo: actor, rollData: actor.getRollData(), secrets: false }
- [ ] #2 Item descriptions enriched with { relativeTo: item, rollData: actor.getRollData(), secrets: false }
- [ ] #3 Hand check: a secret section in history does not print when a GM prints a player-owned hero; a relative @UUID link and an @attr inline roll resolve
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Check in tests/smoke.mjs; `npm run smoke` passes (skip until the smoke tooling exists)
- [ ] #2 Hand check in a v14 + tor2e world if the change has UI: button shows, window opens and prints once, clean preview, no raw `tor2e.*` keys, no console errors
- [ ] #3 README.md and CLAUDE.md (Status, schema notes) updated in the same commit
- [ ] #4 module.json `compatibility` / `relationships` updated if the tested Foundry or tor2e build changed; release tag noted if it ships
<!-- DOD:END -->
