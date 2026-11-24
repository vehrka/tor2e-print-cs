---
id: TASK-11
title: 'Deploy script: allow-list, --delete, tracked in git'
status: To Do
assignee:
  - '@claude'
created_date: '2026-11-24T22:13:03Z'
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
- [ ] #1 deploy.sh has shebang + set -euo pipefail and an rsync allow-list with --delete
- [ ] #2 Target comes from DEPLOY_TARGET; script fails with a clear message if unset; no host/path in the repo
- [ ] #3 deploy.sh removed from .gitignore and committed; npm run deploy works
- [ ] #4 CLAUDE.md Deploy section and README match the script
- [ ] #5 Dry run (rsync -n) lists only runtime files
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Check in tests/smoke.mjs; `npm run smoke` passes (skip until the smoke tooling exists)
- [ ] #2 Hand check in a v14 + tor2e world if the change has UI: button shows, window opens and prints once, clean preview, no raw `tor2e.*` keys, no console errors
- [ ] #3 README.md and CLAUDE.md (Status, schema notes) updated in the same commit
- [ ] #4 module.json `compatibility` / `relationships` updated if the tested Foundry or tor2e build changed; release tag noted if it ships
<!-- DOD:END -->
