const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const TEMPLATE_ROOT = "modules/tor2eprint/templates/actors";

/** Print formats: id -> sheet template. The toolbar shows one button per entry. */
const FORMATS = {
  classic: `${TEMPLATE_ROOT}/character-print.hbs`,
  form: `${TEMPLATE_ROOT}/character-print-form.hbs`
};

const PIP_MAX = 6;

function pips(value, max = PIP_MAX) {
  const v = Number(value) || 0;
  return Array.from({ length: max }, (_, i) => ({ filled: i < v }));
}

function entries(obj) {
  return Object.entries(obj ?? {}).map(([key, val]) => ({ key, ...val }));
}

/**
 * Enrich HTML for print. secrets is always false: a printout is a handout, even when a GM prints.
 * @param {string} html
 * @param {Document} relativeTo  resolves relative @UUID links
 * @param {object} rollData      resolves @attr in inline rolls
 */
async function enrich(html, relativeTo, rollData) {
  if (!html) return "";
  return foundry.applications.ux.TextEditor.implementation.enrichHTML(String(html), { relativeTo, rollData, secrets: false });
}

/** A description that is only a journal link: tor2e inlines the page text (utilities.js buildDescription). */
const JOURNAL_ONLY_DESCRIPTION = /^<p>@UUID\[(JournalEntry.*)](\{(.*)})?<\/p>$/;

/**
 * Enrich an item description like the tor2e sheet: with the system setting
 * inlineElementFromUuidInDescription on, a description that is only a JournalEntry @UUID
 * prints the linked page text. Anything else, or an unresolvable link, enriches as is.
 * @param {Item} item
 * @param {object} rollData
 */
async function itemDescription(item, rollData) {
  const html = item.system.description?.value ?? "";
  const link = game.settings.get("tor2e", "inlineElementFromUuidInDescription") && html.match(JOURNAL_ONLY_DESCRIPTION)?.[1];
  if (link) {
    const page = await fromUuid(link).catch(() => null);
    const text = page?.text?.content;
    if (text) return enrich(text, page, rollData);
  }
  return enrich(html, item, rollData);
}

/** Fixed combat proficiency order on the form layout (alphabetical, as on the printed sheet). */
const FORM_PROFICIENCIES = ["axes", "bows", "spears", "swords"];

/**
 * Exactly `n` entries: the first `n` items, then `{ empty: true }` placeholders (blank lines to write on).
 * @param {object[]} list
 * @param {number} n
 */
function slots(list, n) {
  return Array.from({ length: n }, (_, i) => list[i] ?? { empty: true });
}

/**
 * Extra fields for the form layout. Sources confirmed at runtime against the tor2e 6.3.0 sheet (task-22).
 * @param {Actor} actor
 * @param {object} base  the classic context (weapons, equipment, proficiencies)
 */
function buildFormFields(actor, { weapons, equipment, proficiencies }) {
  const s = actor.system;
  const K = CONFIG.tor2e?.constants ?? {};
  const num = (v) => Number(v) || 0;

  // First equipped armour item per group, like the sheet (mail before leather).
  const equipped = actor.items.filter((i) => i.type === "armour" && i.system.equipped?.value === true);
  const inGroup = (...groups) => equipped.find((i) => groups.includes(i.system.group?.value));
  const gearRow = (item) => item
    ? { name: item.name, protection: num(item.system.protection?.value), load: num(item.system.load?.value) }
    : { empty: true };
  const armour = inGroup(K.mailArmour ?? "mail") ?? inGroup(K.leatherArmour ?? "leather");
  const helm = inGroup(K.headgear ?? "head");
  const shield = inGroup(K.shield ?? "shield");

  // Item load: every not-dropped item with load. extendedData is tor2e internal: fall back to the same sum.
  const itemLoad = actor.extendedData?._getItemLoad?.()
    ?? actor.items.filter((i) => !i.system.dropped?.value).reduce((n, i) => n + Math.max(0, num(i.system.load?.value)), 0);

  // Parry: base + Active Effect shield bonus (getParryBonus) + equipped shield.
  const parryBase = num(s.combatAttributes?.parry?.value);
  const parryBonus = actor.extendedData?.getParryBonus?.() ?? parryBase + num(s.bonuses?.defense?.shieldParry);
  const shieldValue = num(shield?.system.protection?.value);

  // Conditions from token statuses: system.stateOfHealth.* goes stale (task-22).
  const has = (id) => actor.statuses?.has(id) ?? false;
  const wounded = has("wounded");

  const byKey = Object.fromEntries(proficiencies.map((p) => [p.key, p]));

  return {
    points: { adventure: num(s.adventurePoints?.value), skill: num(s.skillPoints?.value) },
    treasure: num(s.treasure?.value),
    distinctiveFeatures: actor.items
      .filter((i) => i.type === "trait" && i.system.group?.value === (K.distinctiveFeature ?? "distinctiveFeature"))
      .map((i) => i.name),
    conditions: { weary: has("weary"), miserable: has("miserable"), wounded, poisoned: has("poisoned") },
    // Wounded value = injury duration the Wounded effect carries; print it only while wounded.
    injury: wounded && num(s.stateOfHealth?.wounded?.value) > 0 ? num(s.stateOfHealth.wounded.value) : null,
    endurance: { value: num(s.resources?.endurance?.value), max: num(s.resources?.endurance?.max) },
    hope: { value: num(s.resources?.hope?.value), max: num(s.resources?.hope?.max) },
    load: { items: itemLoad, fatigue: num(s.resources?.travelLoad?.value) },
    shadow: { temporary: num(s.resources?.shadow?.temporary?.value), scars: num(s.resources?.shadow?.shadowScars?.value) },
    gear: { armour: gearRow(armour), helm: gearRow(helm), shield: gearRow(shield) },
    parry: { base: parryBase, shield: shieldValue, total: parryBonus + shieldValue },
    protection: num(armour?.system.protection?.value) + num(helm?.system.protection?.value),
    formProficiencies: FORM_PROFICIENCIES.map((k) => byKey[k]).filter(Boolean),
    weaponSlots: slots(weapons, 4),
    usefulItems: slots(equipment, 6)
  };
}

async function buildCharacterContext(actor) {
  const s = actor.system;

  const localizeKey = (prefix, key) => {
    if (!key) return "";
    const full = `${prefix}.${key}`;
    const out = game.i18n.localize(full);
    return out === full ? key : out;
  };

  const baseTN = game.settings.get("tor2e", "tnBaseValue") || 20;
  const attrTN = (key) =>
    baseTN - (Number(s.attributes?.[key]?.value) || 0) + (Number(s.bonuses?.tn?.[key]) || 0);

  const rollData = actor.getRollData();
  const itemsByType = (type) => actor.items.filter((i) => i.type === type);

  const skills = entries(s.commonSkills).map((sk) => ({
    key: sk.key,
    label: sk.label,
    value: sk.value,
    pips: pips(sk.value),
    favoured: !!sk.favoured?.value,
    magical: !!sk.magical?.value,
    attribute: sk.roll?.associatedAttribute
  }));

  const skillsByAttr = {
    strength: skills.filter((sk) => sk.attribute === "strength"),
    heart: skills.filter((sk) => sk.attribute === "heart"),
    wits: skills.filter((sk) => sk.attribute === "wits")
  };

  const proficiencies = entries(s.combatProficiencies).map((p) => ({
    key: p.key,
    label: p.label,
    value: p.value,
    pips: pips(p.value),
    attribute: p.roll?.associatedAttribute
  }));

  const weapons = itemsByType("weapon").map((w) => ({
    id: w.id,
    name: w.name,
    img: w.img,
    damage: w.system.damage?.value ?? 0,
    injury: w.system.injury?.value ?? 0,
    load: w.system.load?.value ?? 0,
    skillName: w.system.skill?.name ?? "",
    skillValue: w.system.skill?.value ?? 0,
    notes: w.system.notes?.value ?? "",
    ranged: !!w.system.ranged?.value,
    equipped: !!w.system.equipped?.value
  }));

  const armours = itemsByType("armour").map((a) => ({
    id: a.id,
    name: a.name,
    img: a.img,
    protection: a.system.protection?.value ?? 0,
    load: a.system.load?.value ?? 0,
    equipped: !!a.system.equipped?.value
  }));

  const equipment = itemsByType("miscellaneous").map((i) => {
    const quantity = i.system.quantity ?? 1;
    return { id: i.id, name: i.name, quantity, showQty: quantity > 1 };
  });

  const simpleItems = async (type) => Promise.all(
    itemsByType(type).map(async (i) => ({
      id: i.id,
      name: i.name,
      img: i.img,
      description: await itemDescription(i, rollData)
    }))
  );

  const history = {
    background: await enrich(s.history?.background?.value, actor, rollData),
    company: await enrich(s.history?.company?.value, actor, rollData),
    fellowshipPhase: await enrich(s.history?.fellowshipPhase?.value, actor, rollData),
    taleOfYears: await enrich(s.history?.taleOfYears?.value, actor, rollData),
    notes: await enrich(s.history?.notes?.value, actor, rollData)
  };

  const [virtues, rewards, traits] = await Promise.all([
    simpleItems("virtues"),
    simpleItems("reward"),
    simpleItems("trait")
  ]);

  const base = {
    actor,
    system: s,
    name: actor.name,
    img: actor.img,
    attributes: {
      strength: { ...s.attributes?.strength, tn: attrTN("strength") },
      heart: { ...s.attributes?.heart, tn: attrTN("heart") },
      wits: { ...s.attributes?.wits, tn: attrTN("wits") }
    },
    callingLabel: localizeKey("tor2e.callings.groups", s.biography?.calling?.value),
    standardOfLivingLabel: localizeKey("tor2e.standardOfLivingGroups", s.biography?.standardOfLiving?.value),
    stature: s.stature,
    resources: s.resources,
    combatAttributes: s.combatAttributes,
    stateOfHealth: s.stateOfHealth,
    biography: s.biography,
    history,
    fellowship: s.fellowship,
    skills,
    skillsByAttr,
    proficiencies,
    weapons,
    armours,
    equipment,
    virtues,
    rewards,
    traits
  };
  return Object.assign(base, buildFormFields(actor, base));
}

/**
 * Print window for one character. The toolbar picks a format; each pick renders
 * that format and calls window.print() once.
 */
export class Tor2eCharacterPrint extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "tor2e-character-print-{id}",
    classes: ["tor2eprint", "tor2eprint-window", "print-sheet-window"],
    position: { width: 1180, height: 820 },
    window: { resizable: true, title: "TOR2EPRINT.PrintSheet" },
    actions: {
      format: Tor2eCharacterPrint.#onFormat
    }
  };

  static PARTS = {
    toolbar: { template: `${TEMPLATE_ROOT}/print-toolbar.hbs` },
    sheet: { template: `${TEMPLATE_ROOT}/print-sheet.hbs` }
  };

  /** Format templates, preloaded at init so the sheet part can use them as partials. */
  static TEMPLATES = [...Object.values(FORMATS), `${TEMPLATE_ROOT}/form-skill.hbs`];

  /** @type {string|null} format shown in the sheet part */
  format = null;

  /** True between a format pick and the render that prints it. */
  #printPending = false;

  constructor(options = {}) {
    super(options);
    this.actor = options.document;
  }

  get title() {
    return `${this.actor?.name ?? ""} — ${game.i18n.localize("TOR2EPRINT.PrintSheet")}`;
  }

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    const character = this.format ? await buildCharacterContext(this.actor) : {};
    return Object.assign(ctx, character, {
      format: this.format,
      formatTemplate: FORMATS[this.format] ?? null,
      formats: Object.keys(FORMATS).map((id) => ({
        id,
        label: `TOR2EPRINT.Format.${id}`,
        active: id === this.format
      }))
    });
  }

  /** Render `format` and print it once. */
  async printFormat(format) {
    if (!FORMATS[format]) throw new Error(`Unknown print format: ${format}`);
    this.format = format;
    this.#printPending = true;
    await this.render();
  }

  _onRender(context, options) {
    super._onRender(context, options);
    if (!this.#printPending) return;
    this.#printPending = false;
    this.#printWhenReady();
  }

  /** Print once fonts are loaded and every image has decoded (or failed), so the portrait makes it to paper. */
  async #printWhenReady() {
    const doc = this.element?.ownerDocument ?? document;
    const images = [...(this.element?.querySelectorAll("img") ?? [])];
    await Promise.all([doc.fonts.ready, Promise.allSettled(images.map((img) => img.decode()))]);
    // Let the browser lay out the new part before the print dialog snapshots it.
    const win = doc.defaultView ?? window;
    win.requestAnimationFrame(() => win.print());
  }

  static #onFormat(event, target) {
    return this.printFormat(target.dataset.format);
  }
}
