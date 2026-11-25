---
id: TASK-20
title: 'Decide: bundle Cinzel font for consistent print'
status: Hand check
assignee:
  - '@claude'
created_date: '2026-11-24T22:13:06Z'
updated_date: '2026-11-25T21:44:49Z'
labels:
  - css
  - release
  - idea
milestone: m-1
dependencies:
  - TASK-26
priority: low
ordinal: 13000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/improvements-from-dh-print.md DH-15. TOR headings use 'Trajan Pro', 'Cinzel', 'Book Antiqua'; most players have none, so output varies by client. DH bundles Oswald (OFL, OFL.txt included) via @font-face with font-display: block. Option: bundle Cinzel (OFL) in fonts/ with OFL.txt. Then release.yml zip list and the deploy allow-list must include fonts/.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 User decision recorded in notes
- [x] #2 If adopted: fonts/ with Cinzel + OFL.txt, @font-face with font-display: block, fonts/ in release.yml zip and deploy allow-list, print waits for fonts (DH-4)
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
Cinzel variable font (wght 400-900) from github.com/google/fonts ofl/cinzel; OFL.txt: 'Copyright 2020 The Cinzel Project Authors ... licensed under the SIL Open Font License, Version 1.1'. fonts/cinzel/{Cinzel-wght.ttf,OFL.txt}; @font-face font-display: block; font stacks for the hero name (classic banner + form header) now start with Cinzel so output is the same on every client. fonts/ already in deploy allow-list and release zip (task-26); print waits for document.fonts.ready (task-10). Smoke K3; fit checks unchanged. Hand check: name glyphs in a real print preview.
<!-- SECTION:NOTES:END -->
