// Cuatro arcos narrativos con tres actos cada uno. Persisten entre rondas.
// El reducer marca progreso vía CLUE/FLAG/ADVANCE_QUEST/COMPLETE_QUEST/FAIL_QUEST.
// advanceQuestsAfterEffects sube de acto cuando los requisitos se cumplen.

import { EFFECT_TYPES } from "./effects.js";

const E = EFFECT_TYPES;

export const QUESTS = {
  // Acto 0: descubrir; Acto 1: investigar; Acto 2: resolver.
  tres_losas: {
    id: "tres_losas",
    title: "Las tres losas sin epitafio",
    premise: "Tres regidores del XVI yacen bajo Casa de Cisneros sin nombre. Alguien borró.",
    via: "saber",
    acts: [
      { id: "acto_descubrir", goal: "Descubrir la cripta gótica y oír sus rumores.", requires: { cluesMin: 1 }, reward: [{ type: E.INFLUENCE, value: 1 }] },
      { id: "acto_investigar", goal: "Reunir dos pistas más sobre los tres regidores.", requires: { cluesMin: 3 }, reward: [{ type: E.INFLUENCE, value: 2 }, { type: E.REPUTATION_FACTION, faction: "logia", value: 1 }] },
      { id: "acto_resolver", goal: "Visitar Plaza de la Villa de noche y levantar la losa marcada.", requires: { flag: "cripta_resuelta" }, reward: [{ type: E.INFLUENCE, value: 3 }, { type: E.DOOM, value: -1 }] },
    ],
    failConditions: { doomMin: 11 },
  },

  pacto_carrero: {
    id: "pacto_carrero",
    title: "El pacto del 20-D",
    premise: "Una órbita irregular cada once años. Te tocará firmar algo en Claudio Coello a las 09:35.",
    via: "poder",
    acts: [
      { id: "acto_descubrir", goal: "Encontrar referencias al 20-D y a la órbita irregular.", requires: { cluesMin: 1 }, reward: [{ type: E.INFLUENCE, value: 1 }] },
      { id: "acto_investigar", goal: "Triangular tres claves: hora impar, fecha real, tres llaves.", requires: { cluesMin: 3 }, reward: [{ type: E.INFLUENCE, value: 2 }, { type: E.REPUTATION_FACTION, faction: "iglesia", value: 1 }] },
      { id: "acto_resolver", goal: "Firmar (o no) el pacto en Claudio Coello, fase noche.", requires: { flag: "pacto_resuelto" }, reward: [{ type: E.INFLUENCE, value: 3 }, { type: E.REPUTATION_FACTION, faction: "iglesia", value: 1 }] },
    ],
    failConditions: { doomMin: 12 },
  },

  reloj_observatorio: {
    id: "reloj_observatorio",
    title: "El reloj del Observatorio",
    premise: "Olivares consultaba a Saturno por persona interpuesta. Tú podrías ser la siguiente.",
    via: "ocultismo",
    acts: [
      { id: "acto_descubrir", goal: "Conocer al astrónomo empolvado o a su sucesor.", requires: { cluesMin: 1 }, reward: [{ type: E.INFLUENCE, value: 1 }] },
      { id: "acto_investigar", goal: "Calcular la fecha y obtener el nombre del alquimista.", requires: { cluesMin: 3 }, reward: [{ type: E.INFLUENCE, value: 2 }, { type: E.REPUTATION_FACTION, faction: "logia", value: 1 }] },
      { id: "acto_resolver", goal: "Bajar a la cripta del Palacio Real y pronunciar el nombre.", requires: { flag: "alquimista_nombrado" }, reward: [{ type: E.INFLUENCE, value: 3 }, { type: E.DOOM, value: -1 }] },
    ],
    failConditions: { doomMin: 11 },
  },

  canovas_servilleta: {
    id: "canovas_servilleta",
    title: "La servilleta de Cánovas",
    premise: "Aún hay pactos sin firmar. La calle conserva memoria larga; el siglo XIX no se ha ido del todo.",
    via: "calle",
    acts: [
      { id: "acto_descubrir", goal: "Recoger ecos del turnismo en Madrid central.", requires: { cluesMin: 1 }, reward: [{ type: E.INFLUENCE, value: 1 }] },
      { id: "acto_investigar", goal: "Cruzar firmas y memoria oral: Azaña, Larra, Goya.", requires: { cluesMin: 3 }, reward: [{ type: E.INFLUENCE, value: 2 }, { type: E.REPUTATION_FACTION, faction: "calle", value: 1 }] },
      { id: "acto_resolver", goal: "Firmar la servilleta en San Ginés, fase noche.", requires: { flag: "turnismo_firmado" }, reward: [{ type: E.INFLUENCE, value: 3 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 1 }] },
    ],
    failConditions: { doomMin: 12 },
  },
};

export const QUEST_IDS = Object.keys(QUESTS);

export function getInitialQuestState() {
  return QUEST_IDS.reduce((acc, id) => {
    acc[id] = { stage: 0, clues: [], failed: false, completed: false, flags: {} };
    return acc;
  }, {});
}

export function getActiveActs(state) {
  return QUEST_IDS
    .map((id) => ({ quest: QUESTS[id], state: state.quests[id] }))
    .filter((q) => !q.state.failed && !q.state.completed)
    .map((q) => ({ ...q, act: q.quest.acts[Math.min(q.state.stage, q.quest.acts.length - 1)] }));
}

export function advanceQuestsAfterEffects(state) {
  let next = state;
  for (const qid of QUEST_IDS) {
    const def = QUESTS[qid];
    const q = next.quests[qid];
    if (!q || q.completed || q.failed) continue;
    // Fail por doom?
    if (def.failConditions?.doomMin && next.doom.value >= def.failConditions.doomMin) {
      next = { ...next, quests: { ...next.quests, [qid]: { ...q, failed: true } } };
      continue;
    }
    const act = def.acts[q.stage];
    if (!act) continue;
    const req = act.requires || {};
    let meets = true;
    if (req.cluesMin && q.clues.length < req.cluesMin) meets = false;
    if (req.flag && !q.flags?.[req.flag]) meets = false;
    if (meets) {
      // Recompensa del acto
      let r = next;
      for (const eff of act.reward || []) {
        // Aplicar uno a uno usando applyEffect del módulo effects:
        r = applyEffectInline(r, eff);
      }
      // Avanzar de acto
      const isLast = q.stage + 1 >= def.acts.length;
      r = {
        ...r,
        quests: {
          ...r.quests,
          [qid]: { ...q, stage: q.stage + 1, completed: isLast ? true : q.completed },
        },
      };
      next = r;
    }
  }
  return next;
}

// Inline mini-applier to avoid circular import with effects.js
function applyEffectInline(state, effect) {
  switch (effect.type) {
    case "INFLUENCE": return { ...state, influence: Math.max(0, state.influence + (effect.value || 0)) };
    case "THREAT":    return { ...state, threat: Math.max(0, Math.min(6, state.threat + (effect.value || 0))) };
    case "DOOM":      return { ...state, doom: { ...state.doom, value: Math.max(0, Math.min(state.doom.max, state.doom.value + (effect.value || 0))) } };
    case "REPUTATION_FACTION": {
      const id = effect.faction;
      const cur = state.reputation.factions[id] ?? 0;
      const next = Math.max(-3, Math.min(3, cur + (effect.value || 0)));
      return { ...state, reputation: { ...state.reputation, factions: { ...state.reputation.factions, [id]: next } } };
    }
    case "REPUTATION_POL": {
      const id = effect.id;
      const cur = state.reputation.politicians[id] ?? 0;
      const next = Math.max(-3, Math.min(3, cur + (effect.value || 0)));
      return { ...state, reputation: { ...state.reputation, politicians: { ...state.reputation.politicians, [id]: next } } };
    }
    default: return state;
  }
}

export function getQuest(id) {
  return QUESTS[id] || null;
}
