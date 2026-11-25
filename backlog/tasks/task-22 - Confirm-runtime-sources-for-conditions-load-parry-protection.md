---
id: TASK-22
title: Confirm runtime sources for conditions, load, parry, protection
status: To Do
assignee:
  - '@claude'
created_date: '2026-11-24T22:15:43Z'
labels:
  - code
  - system-upgrade
milestone: m-2
dependencies: []
priority: high
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/new-layout-cs-v1.md (target image ref/img/new_cs_v1.jpg). §2 ⚠️ items and §9 risks. Before coding the form context, confirm in a running v14 + tor2e 6.3.0 world (npm run smoke world if task-13 exists, else ask the user to run console snippets) and record the answer in --notes: (1) Conditions Weary/Miserable/Wounded/Poisoned: system.stateOfHealth.{weary,wounded,poisoned} are numbers, miserable is a string '0' (character.model.mjs:222-227) vs actor.statuses.has(id) vs actor.buildStatusEffectById(StatusEffects.X) (actor-document.mjs:315,756). Pick the one that matches the token/sheet state; a wrong pick prints stale ticks. (2) Load: actor.extendedData._getItemLoad() = item load only (actor-document.mjs:893); getLoad() = fatigue + item load minus setting modifiedLoadAsRequested and bonuses.stats.load (:896-920). Decide which numbers the sheet's Load / Fatigue / Total show; plan a fallback sum of equipped, not dropped item system.load.value. (3) Parry total = getParryBonus() (combatAttributes.parry.value + bonuses.defense.shieldParry, :930) + equipped shield protection.value: compare with the tor2e sheet. (4) Protection = body armour (group mail|leather) + helm (group head) protection + bonuses.defense.protection: compare with sheet armourDTO.protectionTotalValue. (5) Armour group values: config.js:303-305 constants mailArmour 'mail', leatherArmour 'leather', headgear 'head', shield; confirm at runtime via CONFIG/constants. (6) Wounded injury box: stateOfHealth.wounded.value meaning.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Notes record the chosen source for each of the 6 items, with the sheet value it was compared against on a real hero
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
No code change expected. Output: one line per item in notes, used by the context task.
<!-- SECTION:NOTES:END -->
