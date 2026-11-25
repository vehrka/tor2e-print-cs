---
id: TASK-21
title: 'Format toolbar: pick layout, print once per pick'
status: To Do
assignee:
  - '@claude'
created_date: '2026-11-24T22:15:43Z'
labels:
  - code
  - template
  - i18n
  - docs
milestone: m-2
dependencies: []
priority: high
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Source: PRPs/new-layout-cs-v1.md (target image ref/img/new_cs_v1.jpg). §5, decision D2 (add a layout, don't replace). Copy the DH pattern, not its card picker: ~/1_projects/101_dev/101.33_fvtt-dh-print-ch/scripts/apps/print-window.mjs, templates/print-toolbar.hbs, templates/print-sheet.hbs, styles/print.css:12-13. Tor2eCharacterPrint gets static PARTS = { toolbar, sheet }; toolbar renders one button per format (data-action="format" data-format="<id>", class active on current); sheet is a wrapper {{#if formatTemplate}}{{> (lookup this "formatTemplate")}}{{else}}<p>{{localize "TOR2EPRINT.ChooseFormat"}}</p>{{/if}}. Instance state format = null; _prepareContext returns format, formatTemplate, formats [{id,label,active}] and builds actor context only when a format is set. DEFAULT_OPTIONS.actions.format -> printFormat(id): set format, set private #printPending, await this.render(); _onRender calls win.print() once when #printPending, then clears it. Remove the options.isFirstRender auto-print. FORMATS constant: classic (current landscape template) now; form added by the template task. Templates: keep character-print.hbs as classic (or move to templates/actors/formats/), add templates/actors/print-toolbar.hbs + print-sheet.hbs, preload all in TEMPLATE_PATHS. Toolbar sits outside .tor2e-print so chrome-hiding rules keep it off paper. lang: TOR2EPRINT.Format.classic, TOR2EPRINT.ChooseFormat. Behaviour change: CLAUDE.md Engineering Principle 3 and verification checklist ('window auto-prints', 'fires once on first render only') become 'fires once per format pick'. Resolves DH-13 (task-18). If task-10 (wait for fonts/images) is done, move its wait into the print-pending path.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Window opens with toolbar + hint and does not print
- [ ] #2 Clicking Classic renders the current layout unchanged and prints exactly once; clicking again reprints once
- [ ] #3 Toolbar does not appear in print preview
- [ ] #4 CLAUDE.md acceptance (Principle 3, verification checklist) and README updated to the toolbar flow
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Check in tests/smoke.mjs; `npm run smoke` passes (skip until the smoke tooling exists)
- [ ] #2 Hand check in a v14 + tor2e world if the change has UI: button shows, window opens and prints once, clean preview, no raw `tor2e.*` keys, no console errors
- [ ] #3 README.md and CLAUDE.md (Status, schema notes) updated in the same commit
- [ ] #4 module.json `compatibility` / `relationships` updated if the tested Foundry or tor2e build changed; release tag noted if it ships
<!-- DOD:END -->
