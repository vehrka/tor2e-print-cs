---
id: TASK-11
title: 'Deploy script: allow-list, --delete, tracked in git'
status: Done
assignee:
  - '@claude'
created_date: '2026-11-24T22:13:03Z'
updated_date: '2026-11-25T07:05:46Z'
labels:
  - tooling
  - docs
milestone: m-1
dependencies: []
priority: medium
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/improvements-from-dh-print.md DH-9. Current deploy.sh (git-ignored, no shebang, no set -e): rsync -azP --exclude ref/ --exclude node_modules/ --exclude backlog/ . <host>:<path>. It still sends .git/, PRPs/, CLAUDE.md, .github/, README.md, package*.json; without --delete removed files stay on the server. DH pattern: #!/usr/bin/env bash; set -euo pipefail; rsync -azP --delete --include='module.json' --include='tor2eprint.mjs' --include='modules/***' --include='templates/***' --include='styles/***' --include='lang/***' --exclude='*' ./ <target>/. Defaults chosen: track deploy.sh in git, read the target from env DEPLOY_TARGET (loaded from .env, documented in .env.example from the tooling task) instead of hardcoding host/path; add an npm 'deploy' script. Caveat: module.json holds #{VERSION}# tokens, so the deployed version shows '#{VERSION}#'; not fixing now (optional sed into a temp copy), note it in README.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 deploy.sh has shebang + set -euo pipefail and an rsync allow-list with --delete
- [x] #2 Target comes from DEPLOY_TARGET; script fails with a clear message if unset; no host/path in the repo
- [x] #3 deploy.sh removed from .gitignore and committed; npm run deploy works
- [x] #4 CLAUDE.md Deploy section and README match the script
- [x] #5 Dry run (rsync -n) lists only runtime files
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
Done 2026-11-25: allow-list + --delete, DEPLOY_TARGET from env/.env (fails if unset), extra args pass to rsync (./deploy.sh -n). .gitignore: deploy.sh -> .env. npm run deploy added. Dry run against vehrka lists only the 7 runtime files, no deletions. AC3 left open: real 'npm run deploy' not run (overwrites remote module.json with #{VERSION}# tokens; user call). DoD1 n/a (no smoke tooling), DoD4 n/a (no compat change). fonts/ not in allow-list yet: task-26 adds it.

User tested real deploy 2026-11-25.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
deploy.sh: rsync allow-list with --delete, target from DEPLOY_TARGET, tracked in git; npm run deploy.
<!-- SECTION:FINAL_SUMMARY:END -->
