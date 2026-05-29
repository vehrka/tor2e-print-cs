import { Tor2eCharacterPrint } from "./modules/apps/character-print.mjs";

const MODULE_ID = "tor2eprint";
const TEMPLATE_PATHS = [
  `modules/${MODULE_ID}/templates/actors/character-print.hbs`
];

Hooks.once("init", () => {
  const loader = foundry.applications?.handlebars?.loadTemplates ?? loadTemplates;
  loader(TEMPLATE_PATHS);
});

function openPrint(actor) {
  if (!actor) return;
  new Tor2eCharacterPrint({ document: actor }).render(true);
}

Hooks.on("getActorSheetHeaderButtons", (sheet, buttons) => {
  const actor = sheet?.actor ?? sheet?.document;
  if (!actor || actor.type !== "character") return;
  if (buttons.some((b) => b.class === "tor2eprint-btn")) return;

  buttons.unshift({
    label: game.i18n.localize("TOR2EPRINT.PrintSheet"),
    class: "tor2eprint-btn",
    icon: "fa-solid fa-print",
    onclick: () => openPrint(actor)
  });
});

Hooks.on("renderActorSheetV2", (app, html) => {
  const actor = app.document;
  if (!actor || actor.type !== "character") return;
  const root = html instanceof HTMLElement ? html : html?.[0];
  if (!root) return;
  const header = root.querySelector(".window-header");
  if (!header || header.querySelector(".tor2eprint-btn")) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "header-control fa-solid fa-print tor2eprint-btn";
  btn.title = game.i18n.localize("TOR2EPRINT.PrintSheet");
  btn.setAttribute("aria-label", game.i18n.localize("TOR2EPRINT.PrintSheet"));
  btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    openPrint(actor);
  });
  const title = header.querySelector(".window-title");
  (title?.after ? title.after.bind(title) : header.appendChild.bind(header))(btn);
});
