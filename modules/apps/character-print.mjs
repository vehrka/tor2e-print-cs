const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const PIP_MAX = 6;

function pips(value, max = PIP_MAX) {
  const v = Number(value) || 0;
  return Array.from({ length: max }, (_, i) => ({ filled: i < v }));
}

function entries(obj) {
  return Object.entries(obj ?? {}).map(([key, val]) => ({ key, ...val }));
}

async function enrich(html) {
  if (!html) return "";
  return foundry.applications.ux.TextEditor.implementation.enrichHTML(String(html));
}

export class Tor2eCharacterPrint extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "tor2e-character-print-{id}",
    classes: ["tor2e", "tor2eprint", "tor2eprint-window", "print-sheet-window"],
    position: { width: 1180, height: 820 },
    window: { resizable: true, title: "TOR2EPRINT.PrintSheet" }
  };

  static PARTS = {
    sheet: { template: "modules/tor2eprint/templates/actors/character-print.hbs" }
  };

  constructor(options = {}) {
    super(options);
    this.actor = options.document;
  }

  get title() {
    return `${this.actor?.name ?? ""} — ${game.i18n.localize("TOR2EPRINT.PrintSheet")}`;
  }

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    const actor = this.actor;
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
      group: a.system.group?.value ?? "",
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
        description: await enrich(i.system.description?.value ?? "")
      }))
    );

    const history = {
      background: await enrich(s.history?.background?.value),
      company: await enrich(s.history?.company?.value),
      fellowshipPhase: await enrich(s.history?.fellowshipPhase?.value),
      taleOfYears: await enrich(s.history?.taleOfYears?.value),
      notes: await enrich(s.history?.notes?.value)
    };

    const [virtues, rewards, traits] = await Promise.all([
      simpleItems("virtues"),
      simpleItems("reward"),
      simpleItems("trait")
    ]);

    return Object.assign(ctx, {
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
    });
  }

  _onRender(context, options) {
    super._onRender?.(context, options);
    if (options.isFirstRender) {
      const win = this.element?.ownerDocument?.defaultView ?? window;
      setTimeout(() => win.print(), 200);
    }
  }
}
