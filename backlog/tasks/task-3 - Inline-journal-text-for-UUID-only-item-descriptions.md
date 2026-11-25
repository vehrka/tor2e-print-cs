---
id: TASK-3
title: Inline journal text for @UUID-only item descriptions
status: Done
assignee:
  - '@claude'
created_date: '2026-11-24T21:58:30Z'
updated_date: '2026-11-25T21:23:43Z'
labels:
  - code
milestone: m-0
dependencies:
  - TASK-2
priority: medium
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/improvements-from-tor2e-6.3.md U2 (new gap). tor2e 6.3.0 buildDescription (ref/foundryvtt-tor2e/src/modules/utilities.js:484-507) honours system setting tor2e.inlineElementFromUuidInDescription: when the description is exactly <p>@UUID[JournalEntry…]{label}</p> (regex /^<p>@UUID\[(JournalEntry.*)](\{(.*)})?<\/p>$/) the sheet replaces it with fromUuid(link).text.content enriched relativeTo the journal page. Compendium virtues and rewards often use this. The print shows a bare link instead. Fix in simpleItems() in character-print.mjs: copy the regex + fromUuid -> text.content logic, guarded by the same setting, and enrich it with the task-2 options (secrets: false, relativeTo: the journal page). Do not import tor2eUtilities (not on game.tor2e; importing systems/tor2e/... couples to internal file layout). Handle a missing/unresolvable UUID by falling back to the normal enrich.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 With the setting on, an item whose description is only a JournalEntry @UUID prints the journal page text
- [x] #2 With the setting off, or for any other description shape, output is unchanged
- [x] #3 Unresolvable UUID falls back to normal enrichment without throwing
- [x] #4 No import from systems/tor2e/
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
itemDescription() copies tor2e buildDescription regex + setting; page text enriched relativeTo the page, secrets false; fromUuid failure or empty text falls back to normal enrich. No systems/tor2e import. Smoke J0 (temp journal + world setting, restored): on -> inlined; off and other shapes -> unchanged; broken UUID -> fallback. FINDING: neither layout template prints item descriptions (classic shows names only; form drops them by D3), so this and task-2's item-description enrichment only change the context, nothing visible yet. AC checked at context level. DoD2/4 n/a.
<!-- SECTION:NOTES:END -->
