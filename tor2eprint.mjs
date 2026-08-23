import { Tor2eCharacterPrint } from "./modules/apps/character-print.mjs";

const MODULE_ID = "tor2eprint";
const BUTTON_CLASS = "tor2eprint-btn";
const TEMPLATE_PATHS = [
  `modules/${MODULE_ID}/templates/actors/character-print.hbs`
];

Hooks.once("init", () => {
  foundry.applications.handlebars.loadTemplates(TEMPLATE_PATHS);
});

function openPrint(actor) {
  if (!actor) return;
  new Tor2eCharacterPrint({ document: actor }).render(true);
}

/**
 * Resolve the printable character Actor an ApplicationV2 sheet is displaying.
 * @param {ApplicationV2} app
 * @returns {Actor|null}
 */
function printableActor(app) {
  const actor = app?.document;
  if (!actor || actor.documentName !== "Actor" || actor.type !== "character") return null;
  return actor;
}

/**
 * Preferred injection path: ApplicationV2 header controls.
 * Foundry renders the entry in the window header (or its overflow menu) and
 * dispatches the action through the app's action handlers.
 */
Hooks.on("getHeaderControlsApplicationV2", (app, controls) => {
  const actor = printableActor(app);
  if (!actor) return;
  if (controls.some((c) => c.action === BUTTON_CLASS)) return;

  controls.push({
    icon: "fa-solid fa-print",
    label: "TOR2EPRINT.PrintSheet",
    action: BUTTON_CLASS,
    onClick: () => openPrint(actor)
  });
});

/**
 * Fallback injection: some sheets consume header controls without honouring
 * `onClick`. Bind the rendered control directly, or inject one if absent.
 */
Hooks.on("renderActorSheetV2", (app, html) => {
  const actor = printableActor(app);
  if (!actor) return;
  const root = html instanceof HTMLElement ? html : html?.[0];
  const header = root?.querySelector(".window-header");
  if (!header) return;

  const existing = root.querySelector(`[data-action="${BUTTON_CLASS}"]`);
  if (existing) {
    if (existing.dataset.tor2eprintBound) return;
    existing.dataset.tor2eprintBound = "1";
    existing.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      openPrint(actor);
    });
    return;
  }

  if (header.querySelector(`.${BUTTON_CLASS}`)) return;
  const label = game.i18n.localize("TOR2EPRINT.PrintSheet");
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `header-control icon fa-solid fa-print ${BUTTON_CLASS}`;
  btn.dataset.tor2eprintBound = "1";
  btn.title = label;
  btn.setAttribute("aria-label", label);
  btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    openPrint(actor);
  });
  const title = header.querySelector(".window-title");
  if (title) title.after(btn);
  else header.appendChild(btn);
});
