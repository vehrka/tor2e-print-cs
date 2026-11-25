---
id: TASK-23
title: 'Form layout context: new fields and slots helper'
status: Done
assignee:
  - '@claude'
created_date: '2026-11-24T22:15:43Z'
updated_date: '2026-11-25T21:22:45Z'
labels:
  - code
milestone: m-2
dependencies:
  - TASK-22
priority: high
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/new-layout-cs-v1.md (target image ref/img/new_cs_v1.jpg). §2 ➕ items, §4, D3/D5/D6. Add to _prepareContext in modules/apps/character-print.mjs (keep all existing fields: classic still uses them): points { adventure: s.adventurePoints.value, skill: s.skillPoints.value }; treasure: s.treasure?.value; distinctiveFeatures: names of trait items with system.group.value === 'distinctiveFeature' (flaws not printed); conditions { weary, miserable, wounded, poisoned } booleans from the source chosen in the runtime-sources task (Anguished is template-only, no field); load { items, fatigue (resources.travelLoad.value) } per that task; shadow { temporary: resources.shadow.temporary.value, scars: resources.shadow.shadowScars.value }; gear { armour (equipped, group mail|leather), helm (group head), shield (group shield) } with name/protection/load; parry { base, shield, total }; protection total; endurance current/max and hope current/max (already partly there); proficiencies sorted by fixed key list axes, bows, spears, swords; one unexported helper slots(list, n) returning exactly n entries (items, then empty placeholders): weapons 4, usefulItems (= equipment) 6, distinctiveFeatures cut to what fits 2 lines. Rewards/virtues are not cut in JS (CSS clips them). Wrap tor2e internals (extendedData._getItemLoad, buildStatusEffectById) in optional chaining with a fallback and a comment. If _prepareContext passes ~200 lines, move builders to unexported helpers in the same file. Confirm every path against character.model.mjs / item models first (Principle 1).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Every ➕ field from PRP §2 is in the context with the paths confirmed in the runtime-sources task
- [x] #2 slots(list, n) returns exactly n entries for lists shorter and longer than n
- [x] #3 Proficiencies come out in order axes, bows, spears, swords
- [x] #4 Classic layout renders unchanged (hand check or smoke)
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
buildFormFields() merged into the classic context (classic fields unchanged). Sources per task-22. Smoke C12-C19 (C19 toggles weary/wounded on Arvegil and restores). distinctiveFeatures is the full name list; the 2-line cut is left to the template/CSS (line clamp), since JS cannot know text width. weaponSlots = all weapons cut/padded to 4 (not filtered by equipped). AC4: classic context checks C0-C11 and fit checks G0-G9 unchanged. DoD2/4 n/a: no UI or compat change yet (template is task-24).
<!-- SECTION:NOTES:END -->
