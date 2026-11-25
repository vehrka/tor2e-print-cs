---
id: TASK-2
title: Pass relativeTo, rollData and secrets:false to enrichHTML
status: Hand check
assignee:
  - '@claude'
created_date: '2026-11-24T21:58:30Z'
updated_date: '2026-11-25T21:19:07Z'
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
- [x] #1 History/biography enriched with { relativeTo: actor, rollData: actor.getRollData(), secrets: false }
- [x] #2 Item descriptions enriched with { relativeTo: item, rollData: actor.getRollData(), secrets: false }
- [ ] #3 Hand check: a secret section in history does not print when a GM prints a player-owned hero; a relative @UUID link and an @attr inline roll resolve
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
Smoke E0 (temporarily writes Arvegil history.notes, restores in finally): secret hidden, [[/r 1d6 + @attributes.strength.value]] -> '1d6 + 8', @UUID[.Item.id] resolves (not .broken). Red without fix: roll unresolved, link broken. Secret already hidden without the fix: v14 enrichHTML defaults secrets:false; explicit false kept as guard. tor2e has no getRollData override (core returns actor.system). Item descriptions use relativeTo: item (code path, no dedicated check). AC3 left for real hand check. No doc change; DoD4 n/a.
<!-- SECTION:NOTES:END -->
