---
id: TASK-12
title: Clean up button injection, _onRender call and legacy CSS
status: Done
assignee:
  - '@claude'
created_date: '2026-11-24T22:13:04Z'
updated_date: '2026-11-25T22:04:13Z'
labels:
  - code
  - css
milestone: m-1
dependencies: []
priority: low
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/improvements-from-dh-print.md DH-10, DH-11, DH-12. tor2eprint.mjs vs DH scripts/main.mjs: (1) 'html?.[0]' jQuery fallback -> html instanceof HTMLElement ? html : app.element; (2) bind logic duplicated for existing vs injected button -> one bind(el) helper; (3) btn.title native tooltip -> btn.dataset.tooltip (Foundry tooltip, matches other header controls); (4) render(true) -> render({ force: true }). Do NOT rename the action id 'tor2eprint-btn' (cosmetic; would need smoke updates). DH-11: print.css:3-23 styles '.window-app .window-header a.tor2eprint-btn', a legacy ActorSheet selector; legacy support dropped in v0.2.0 -> delete the .window-app rules, keep only a minimal .tor2eprint-btn rule if still needed. DH-12: character-print.mjs:166 super._onRender?.(…) -> super._onRender(context, options) (always exists in v14).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 No html?.[0] fallback; one bind helper used by both paths
- [x] #2 Injected button uses dataset.tooltip; openPrint uses render({ force: true })
- [x] #3 No .window-app selectors in styles/print.css
- [x] #4 super._onRender called without optional chaining
- [x] #5 Hand check: button shows in header, tooltip appears, click opens print window once
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
bind(el, actor) shared by existing-control and injected-button paths; root = html instanceof HTMLElement ? html : app.element; injected button uses data-tooltip (no title); openPrint uses render({ force: true }); super._onRender without ?.; removed both legacy CSS blocks (.window-app rules and the bare .tor2eprint-btn rule): header-control classes already style it, screenshot shows the print icon matching the other header icons. Smoke P10 (data-tooltip, no title) + P2/P3. Still open (not in this task): in v14 the getHeaderControlsApplicationV2 entry sits in the collapsed overflow menu AND the fallback injects a header button, so the sheet offers Print twice (menu + icon). AC5 tooltip hover still to hand check.

Hand check passed in a v14 + tor2e world (user, 2026-11-25).
<!-- SECTION:NOTES:END -->
