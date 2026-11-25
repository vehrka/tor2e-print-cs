---
id: TASK-22
title: Confirm runtime sources for conditions, load, parry, protection
status: Done
assignee:
  - '@claude'
created_date: '2026-11-24T22:15:43Z'
updated_date: '2026-11-25T21:20:23Z'
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
- [x] #1 Notes record the chosen source for each of the 6 items, with the sheet value it was compared against on a real hero
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
Probed live on core 14.370 + tor2e 6.3.0, all 8 fixtures, vs the values the tor2e sheet computes (character-sheet.mjs _prepareEffectsData/_prepareLoadData/_prepareEquippedGearDTOs):
(1) Conditions: use actor.statuses.has(id) for weary/miserable/wounded/poisoned. Equals sheet's buildStatusEffectById(id).value on every hero and after toggling weary+wounded on Arvegil. system.stateOfHealth.* is stale: Adelbard has wounded.value=1 with no Wounded status; toggling a status does not change it.
(2) Load: sheet Load badge = extendedData.getLoad() (fatigue + item load - modifiedLoadAsRequested - bonuses.stats.load); its tooltip splits Fatigue = system.resources.travelLoad.value and item load = extendedData._getItemLoad(). Item load counts every NOT-dropped item with load > 0 (not only equipped). Print: load.items = _getItemLoad() ?? fallback sum(load of non-dropped items) (matches on all 8: e.g. Arvegil 13, Hakkon 20); fatigue = travelLoad; total = getLoad() (Arvegil 18, Hakkon 22 with bonuses.stats.load -2).
(3) Parry: sheet shows base system.combatAttributes.parry.value and the shield separately, no total. Print: base = parry.value, shield = equipped shield protection.value, total = extendedData.getParryBonus() (base + bonuses.defense.shieldParry) + shield. Hakkon 16 (+3 AE) + 5 = 24; Adelbard 17 + 4 = 21; Otrebør 20 (+1) no shield = 21.
(4) Protection: = equipped armour (mail first, else leather) + equipped head protection.value; matches sheet armourDTO.protectionTotalValue (Arvegil 3, Hakkon 5, Hans 4, Adelbard 2). Do NOT add bonuses.defense.protection: the sheet uses it only as a protection roll modifier (getProtectionRollModifier).
(5) Armour groups at runtime: CONFIG.tor2e.constants mailArmour 'mail', leatherArmour 'leather', headgear 'head', shield 'shield'. Pick the first equipped item per group like the sheet's _first().
(6) Wounded injury box: system.stateOfHealth.wounded.value is the injury duration (days) that buildStatusEffectById copies into the Wounded effect duration. Print it only when statuses.has('wounded') and value > 0; otherwise empty (Adelbard's stale 1 must not print).
DoD: no code, docs, UI or compat change.
<!-- SECTION:NOTES:END -->
