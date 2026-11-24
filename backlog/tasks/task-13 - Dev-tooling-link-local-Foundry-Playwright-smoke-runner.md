---
id: TASK-13
title: 'Dev tooling: link, local Foundry, Playwright smoke runner'
status: To Do
assignee:
  - '@claude'
created_date: '2026-11-24T22:13:04Z'
labels:
  - tooling
  - docs
milestone: m-1
dependencies: []
priority: high
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/improvements-from-dh-print.md DH-5. Copy nearly unchanged from ~/1_projects/101_dev/101.33_fvtt-dh-print-ch: tools/env.mjs (loads .env into process.env, existing env wins; exports root), tools/link.mjs (symlink repo to $FOUNDRY_DATA/modules/<id>, id read from module.json), tools/foundry.mjs (start local Foundry: --dataPath, --port, --noupdate, --noupnp, optional --world), tools/smoke.mjs (headless Playwright login to /join, wait for game.ready, import() tests/smoke.mjs in the page, print PASS/FAIL, collect pageerror and console.error, exit 1 on failure). package.json already exists (private, type module, backlog.md dev dep): add scripts link / foundry / smoke and dev dep playwright-core pinned (DH uses 1.65.0). Add .env.example: FOUNDRY_APP, FOUNDRY_DATA, FOUNDRY_PORT, FOUNDRY_WORLD, SMOKE_USER, SMOKE_PASSWORD (+ DEPLOY_TARGET from the deploy task). .gitignore: add .env, .foundry-data/ (node_modules/ already there). Runtime stays build-free; release.yml zips runtime paths only. Run npm audit after adding deps. Until tests/smoke.mjs exists, add a minimal one that asserts the module is active.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 tools/{env,link,foundry,smoke}.mjs exist and read the module id from module.json
- [ ] #2 package.json has link/foundry/smoke scripts; playwright-core pinned exact; npm audit clean or findings reported
- [ ] #3 .env.example lists all vars; .env and .foundry-data/ git-ignored
- [ ] #4 npm run smoke against a local v14 + tor2e world prints PASS for a minimal module-active check
- [ ] #5 README and CLAUDE.md Development Workflow describe the dev loop
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Check in tests/smoke.mjs; `npm run smoke` passes (skip until the smoke tooling exists)
- [ ] #2 Hand check in a v14 + tor2e world if the change has UI: button shows, window opens and prints once, clean preview, no raw `tor2e.*` keys, no console errors
- [ ] #3 README.md and CLAUDE.md (Status, schema notes) updated in the same commit
- [ ] #4 module.json `compatibility` / `relationships` updated if the tested Foundry or tor2e build changed; release tag noted if it ships
<!-- DOD:END -->
