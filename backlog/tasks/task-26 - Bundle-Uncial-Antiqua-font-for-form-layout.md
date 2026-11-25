---
id: TASK-26
title: Bundle Uncial Antiqua font for form layout
status: Done
assignee:
  - '@claude'
created_date: '2026-11-24T22:15:44Z'
updated_date: '2026-11-25T22:04:14Z'
labels:
  - css
  - release
milestone: m-2
dependencies:
  - TASK-25
  - TASK-11
priority: medium
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/new-layout-cs-v1.md (target image ref/img/new_cs_v1.jpg). D8. Bundle the uncial display font if OFL. Candidate Uncial Antiqua (Google Fonts, SIL OFL 1.1). Ship the font file + its OFL.txt in fonts/, load with @font-face (font-display: block) scoped to the form layout headings; no remote font link (Foundry can run offline). Verify the licence file that ships with the download before committing; stop and report if it is not OFL. Add fonts/ to the release.yml zip list and to the deploy allow-list (task-11). Print must wait for document.fonts.ready (task-10 / toolbar print path). Related: task-20 (Cinzel for classic) is a separate, still-open decision.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 fonts/ holds the font file and its OFL.txt; licence verified as SIL OFL 1.1
- [x] #2 Form headings render in Uncial Antiqua offline (no network font request)
- [x] #3 release.yml zip and deploy.sh include fonts/
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
Downloaded from github.com/google/fonts ofl/uncialantiqua (UncialAntiqua-Regular.ttf + OFL.txt); OFL.txt header: Copyright 2011 Brian J. Bonislawsky (Astigmatic), 'licensed under the SIL Open Font License, Version 1.1', RFN 'Uncial Antiqua'. Stored under fonts/uncial-antiqua/ (subfolder so Cinzel's OFL.txt won't collide in task-20). @font-face font-display: block, local url; used on .tp-form .tf-h headings (fallback tor2e Aniron). fonts/ added to deploy.sh allow-list and release.yml zip. Print already waits for document.fonts.ready (task-10). Smoke K2: face loaded, file served by module. Visual check on headless PDF. Hand check: confirm headings in a real print preview.

Hand check passed in a v14 + tor2e world (user, 2026-11-25).
<!-- SECTION:NOTES:END -->
