// Aplicador puro de efectos. Recibe el estado actual y un efecto, devuelve un parche.
// El reducer en gameState.js es quien orquesta y mezcla los parches.
// Cada efecto es { type, ...payload }. Lista cerrada en EFFECT_TYPES.

import { clampReputation } from "./factions.js";

export const EFFECT_TYPES = {
  INFLUENCE: "INFLUENCE",
  THREAT: "THREAT",
  DOOM: "DOOM",
  AP: "AP",
  STATUS_ADD: "STATUS_ADD",
  STATUS_REMOVE: "STATUS_REMOVE",
  REPUTATION_POL: "REPUTATION_POL",
  REPUTATION_FACTION: "REPUTATION_FACTION",
  CLUE: "CLUE",
  FLAG: "FLAG",
  CONTROL: "CONTROL",
  OPEN_SCENE: "OPEN_SCENE",
  OPEN_DIALOGUE: "OPEN_DIALOGUE",
  ADVANCE_QUEST: "ADVANCE_QUEST",
  START_QUEST: "START_QUEST",
  COMPLETE_QUEST: "COMPLETE_QUEST",
  FAIL_QUEST: "FAIL_QUEST",
  LOG: "LOG",
  TIME_PASS: "TIME_PASS",
};

const VALID_STATUSES = new Set(["Paranoia", "Bendición residual", "Deuda de sangre", "Obsesión", "Protección"]);

// Devuelve un nuevo state aplicando el efecto. NO muta.
export function applyEffect(state, effect) {
  if (!effect || !effect.type) return state;
  switch (effect.type) {
    case EFFECT_TYPES.INFLUENCE:
      return { ...state, influence: Math.max(0, state.influence + (effect.value || 0)) };
    case EFFECT_TYPES.THREAT: {
      const next = Math.max(0, Math.min(6, state.threat + (effect.value || 0)));
      return { ...state, threat: next };
    }
    case EFFECT_TYPES.DOOM: {
      const next = Math.max(0, Math.min(state.doom.max, state.doom.value + (effect.value || 0)));
      return { ...state, doom: { ...state.doom, value: next } };
    }
    case EFFECT_TYPES.AP: {
      const nextAp = Math.max(0, state.clock.ap + (effect.value || 0));
      return { ...state, clock: { ...state.clock, ap: nextAp } };
    }
    case EFFECT_TYPES.STATUS_ADD: {
      if (!VALID_STATUSES.has(effect.status)) return state;
      const has = state.character.statuses.some((s) => s.name === effect.status);
      if (has) return state;
      const detailMap = {
        "Paranoia": "Oyes pasos donde solo hay eco.",
        "Bendición residual": "Una presencia benigna amortigua el daño mental.",
        "Deuda de sangre": "Alguien te cobrará el pacto, con intereses.",
        "Obsesión": "No puedes soltar una pista, aunque te cueste salud.",
        "Protección": "Un sello antiguo desvía parte del riesgo.",
      };
      return {
        ...state,
        character: {
          ...state.character,
          statuses: [...state.character.statuses, { name: effect.status, detail: detailMap[effect.status] || "" }].slice(0, 4),
        },
      };
    }
    case EFFECT_TYPES.STATUS_REMOVE: {
      return {
        ...state,
        character: {
          ...state.character,
          statuses: state.character.statuses.filter((s) => s.name !== effect.status),
        },
      };
    }
    case EFFECT_TYPES.REPUTATION_POL: {
      const id = effect.id;
      if (!id) return state;
      const cur = state.reputation.politicians[id] ?? 0;
      const next = clampReputation(cur + (effect.value || 0));
      return {
        ...state,
        reputation: { ...state.reputation, politicians: { ...state.reputation.politicians, [id]: next } },
      };
    }
    case EFFECT_TYPES.REPUTATION_FACTION: {
      const id = effect.faction;
      if (!id) return state;
      const cur = state.reputation.factions[id] ?? 0;
      const next = clampReputation(cur + (effect.value || 0));
      return {
        ...state,
        reputation: { ...state.reputation, factions: { ...state.reputation.factions, [id]: next } },
      };
    }
    case EFFECT_TYPES.CLUE: {
      const q = state.quests[effect.questId];
      if (!q) return state;
      if (q.clues.includes(effect.clue)) return state;
      return {
        ...state,
        quests: { ...state.quests, [effect.questId]: { ...q, clues: [...q.clues, effect.clue] } },
      };
    }
    case EFFECT_TYPES.FLAG: {
      const q = state.quests[effect.questId];
      if (!q) return state;
      return {
        ...state,
        quests: { ...state.quests, [effect.questId]: { ...q, flags: { ...q.flags, [effect.flag]: effect.value ?? true } } },
      };
    }
    case EFFECT_TYPES.CONTROL: {
      if (!effect.locationId || !effect.value) return state;
      return { ...state, control: { ...state.control, [effect.locationId]: effect.value } };
    }
    case EFFECT_TYPES.START_QUEST: {
      const id = effect.questId;
      if (!id || state.quests[id]) return state;
      return {
        ...state,
        quests: { ...state.quests, [id]: { stage: 0, clues: [], failed: false, completed: false, flags: {} } },
      };
    }
    case EFFECT_TYPES.ADVANCE_QUEST: {
      const q = state.quests[effect.questId];
      if (!q || q.completed || q.failed) return state;
      return {
        ...state,
        quests: { ...state.quests, [effect.questId]: { ...q, stage: q.stage + 1 } },
      };
    }
    case EFFECT_TYPES.COMPLETE_QUEST: {
      const q = state.quests[effect.questId];
      if (!q) return state;
      return {
        ...state,
        quests: { ...state.quests, [effect.questId]: { ...q, completed: true } },
      };
    }
    case EFFECT_TYPES.FAIL_QUEST: {
      const q = state.quests[effect.questId];
      if (!q) return state;
      return {
        ...state,
        quests: { ...state.quests, [effect.questId]: { ...q, failed: true } },
      };
    }
    case EFFECT_TYPES.LOG: {
      const entry = {
        id: effect.id || `log-${state.log.length}-${Math.random().toString(36).slice(2, 7)}`,
        text: effect.text || "",
        kind: effect.kind || "info",
        round: state.clock.round,
      };
      return { ...state, log: [entry, ...state.log].slice(0, 14) };
    }
    case EFFECT_TYPES.TIME_PASS:
      // Marcador: gestionado por el reducer en END_ROUND.
      return state;
    case EFFECT_TYPES.OPEN_SCENE:
    case EFFECT_TYPES.OPEN_DIALOGUE:
      // Estos los maneja el reducer (cambian currentScene).
      return state;
    default:
      return state;
  }
}

export function applyEffects(state, effects = []) {
  return effects.reduce((acc, eff) => applyEffect(acc, eff), state);
}

// Devuelve solo los efectos diferidos para llevar a currentScene (apertura de escenas).
export function extractSceneOpeners(effects = []) {
  return effects.filter((e) => e.type === EFFECT_TYPES.OPEN_SCENE || e.type === EFFECT_TYPES.OPEN_DIALOGUE);
}
