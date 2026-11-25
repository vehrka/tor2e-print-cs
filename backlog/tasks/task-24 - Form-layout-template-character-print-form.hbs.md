---
id: TASK-24
title: Form layout template (character-print-form.hbs)
status: Done
assignee:
  - '@claude'
created_date: '2026-11-24T22:15:44Z'
updated_date: '2026-11-25T22:04:10Z'
labels:
  - template
  - i18n
  - docs
milestone: m-2
dependencies:
  - TASK-21
  - TASK-23
priority: high
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/new-layout-cs-v1.md (target image ref/img/new_cs_v1.jpg). §2 (section order), §3, §7, D4-D7. New template templates/actors/character-print-form.hbs (or formats/form.hbs, matching the toolbar task), root .tor2e-print.tp-form, registered as format 'form' in FORMATS + TEMPLATE_PATHS, lang TOR2EPRINT.Format.form. Sections in image order: header (name banner, Adventure Points diamond left, Skill Points diamond right); character block (Heroic Culture, Age, Cultural Blessing, Standard of Living, Treasure, Calling, Shadow Path, Distinctive Features 2 lines); portrait box with actor.img instead of the logo (D4); Conditions: five checkboxes Weary, Miserable, Wounded, Anguished (always empty, no schema field), Poisoned (D6); Injury box (wounded value if > 0); 3 attribute columns Strength/Heart/Wits with rating + TN diamonds; skills 6 per column with favoured box, name, small 'M' mark if magical (D7), 6 diamond pips (image order matches schema order after the attribute filter: check); Useful Items 3 cols x 2 lines; Combat Proficiencies; Rewards box + Valour diamond; Virtues box + Wisdom diamond; Endurance (max diamond, Current, Load, Fatigue); Hope (max diamond, Current, Shadow, Scars); Parry (diamond, Shield, Total); War Gear 4 rows (name, Damage, Injury, Load, Notes); Armour, Helm, Shield rows + Protection diamond. Fill all values; empty lines stay for handwriting (D5). Not printed (D3, §3): other traits, flaws, history, item descriptions, title/standing, fellowship focus/points, patron. i18n (§7): reuse tor2e.actors.biography.*, tor2e.stats.*, tor2e.commonSkills.*, tor2e.combatProficiencies.*, tor2e.statureStats.{valour,wisdom}, tor2e.actors.stats.{endurance,hope,travelLoad,shadowScars}, tor2e.armour.groups.{head,shield}, tor2e.actors.sections.treasure (exists: 'Treasure'), distinctive feature key (confirm path in ref lang/en.json); add TOR2EPRINT.* only for: Heroic Culture (if it differs), Useful Items, War Gear, Rating, Target Number, Current, Load, Fatigue, Shadow, Scars, Shield, Total, Helm, Anguished. No interactive controls.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Clicking Form in the toolbar renders all sections above in image order and prints once
- [x] #2 No raw tor2e.* or TOR2EPRINT.* keys in the rendered sheet
- [x] #3 Anguished prints empty; Poisoned present; M mark on magical skills; portrait in logo box
- [x] #4 README and CLAUDE.md Status describe the two formats
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
templates/actors/character-print-form.hbs (root .tor2e-print.tp-form) + form-skill.hbs partial, registered as format 'form'. Labels: tor2e keys found by value search (tor2e.actors.traits.distinctiveFeatures, tor2e.actors.skills.title, tor2e.actors.sections.war-gear, tor2e.weapons.details.{damage,injury,notes}, tor2e.items.common.load, tor2e.items.armours.protection, tor2e.actors.stats.{current,load,shadow,total,parry}); new TOR2EPRINT keys: Format.form, Sections.UsefulItems, Labels.{Character,HeroicCulture,Rating,TargetNumberLong,Scars,Helm,Anguished}. Image says 'Helm'; tor2e.armour.groups.head is 'Headgear', so Helm is a print key. Smoke T0-T4 + P5 (both formats render without raw keys, print once per pick). Skill order per column matches the image (checked T0/rendered). Unstyled until task-25: visual hand check after the CSS.

Hand check passed in a v14 + tor2e world (user, 2026-11-25).
<!-- SECTION:NOTES:END -->
