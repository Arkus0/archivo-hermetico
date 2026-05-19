// Reducer único de la partida. Sin dependencias externas.
// Vive bajo <GameStateProvider>. Actions: lista cerrada en ACTIONS.

import { buildStatuses } from "./statusEffects.js";
import { applyEffect, applyEffects, EFFECT_TYPES, extractSceneOpeners } from "./effects.js";
import { rollCheck, isSuccessGrade, GRADE_LABEL } from "./checks.js";
import { getDoomEventsBetween } from "./worldClock.js";
import { pickPoliticalRoundEvent } from "./politicalEvents.js";
import { FACTION_IDS, initialFactionReputation } from "./factions.js";
import { getInitialDisposition, getSponsorsOf } from "./politicianPlacements.js";
import { ENCOUNTERS, pickEncounter, getEncounter } from "./encounters.js";
import { DIALOGUE_TREES, getDialogueNode } from "./dialogues.js";
import { QUESTS, advanceQuestsAfterEffects, getInitialQuestState } from "./quests.js";

export const GAME_STATE_VERSION = 1;

export const ACTIONS = {
  START_GAME: "START_GAME",
  SELECT_LOCATION: "SELECT_LOCATION",
  OPEN_ENCOUNTER: "OPEN_ENCOUNTER",
  OPEN_DIALOGUE: "OPEN_DIALOGUE",
  CHOOSE_OPTION: "CHOOSE_OPTION",
  CLOSE_SCENE: "CLOSE_SCENE",
  SECURE_ENCLAVE: "SECURE_ENCLAVE",
  TOGGLE_DAYNIGHT: "TOGGLE_DAYNIGHT",
  END_ROUND: "END_ROUND",
  DISMISS_DOOM_EVENT: "DISMISS_DOOM_EVENT",
  LOAD_STATE: "LOAD_STATE",
  RESET_GAME: "RESET_GAME",
};

export function makeInitialState(character) {
  const initialThreat = character?.campaignProfile?.initialThreat ?? 0;
  const politicianRep = {};
  if (character?.politician?.id) {
    politicianRep[character.politician.id] = 2;
  }
  return {
    version: GAME_STATE_VERSION,
    meta: {
      startedAt: Date.now(),
      fileNumber: character?.fileNumber || "",
      seed: Math.floor(Math.random() * 1e9),
    },
    character: {
      politician: character?.politician || { id: "", name: "", epitaph: "" },
      stats: character?.stats || {},
      answers: character?.answers || [],
      campaignProfile: character?.campaignProfile || null,
      alias: character?.alias || "Sin alias",
      origin: character?.origin || "",
      focus: character?.focus || "politica",
      matchPercent: character?.matchPercent || 0,
      statuses: buildStatuses(character?.answers || []),
    },
    clock: {
      round: 1,
      maxRounds: 12,
      ap: 4,
      maxApDay: 4,
      maxApNight: 3,
      daynight: "day",
      previousType: null,
    },
    doom: { value: 0, max: 12, lastTriggered: [] },
    control: {},
    influence: 0,
    threat: initialThreat,
    selectedLocationId: null,
    reputation: {
      politicians: politicianRep,
      factions: initialFactionReputation(),
    },
    quests: getInitialQuestState(),
    encountersSeen: {},
    npcs: {},
    currentScene: null,         // { kind: "encounter"|"dialogue", id, nodeId, history, lastCheck }
    pendingDoomEvents: [],      // cola de doom events por mostrar
    log: [],
    eventLog: [],
    finished: null,             // null | "victory" | "defeat" | "doom"
  };
}

// Aplica efectos y enseguida procesa apertura de escenas (último gana).
function applyEffectsAndOpenScenes(state, effects = []) {
  let next = applyEffects(state, effects);
  const openers = extractSceneOpeners(effects);
  for (const opener of openers) {
    if (opener.type === EFFECT_TYPES.OPEN_SCENE && opener.sceneId) {
      next = openEncounterInner(next, opener.sceneId);
    } else if (opener.type === EFFECT_TYPES.OPEN_DIALOGUE && opener.dialogueId) {
      next = openDialogueInner(next, opener.dialogueId, opener.nodeId);
    }
  }
  return next;
}

function openEncounterInner(state, encounterId) {
  const enc = getEncounter(encounterId);
  if (!enc) return state;
  const seen = state.encountersSeen[encounterId] || { count: 0, lastRound: 0 };
  return {
    ...state,
    currentScene: { kind: "encounter", id: encounterId, nodeId: null, history: [], lastCheck: null },
    encountersSeen: { ...state.encountersSeen, [encounterId]: { count: seen.count + 1, lastRound: state.clock.round } },
  };
}

function openDialogueInner(state, dialogueId, nodeId) {
  const tree = DIALOGUE_TREES[dialogueId];
  if (!tree) return state;
  const startNode = nodeId || tree.start;
  const node = getDialogueNode(dialogueId, startNode);
  if (!node) return state;
  const npcId = tree.npcId;
  const npcState = state.npcs[npcId] || { met: false, disposition: getInitialDisposition(npcId), lastSeenRound: 0, flags: {} };
  return {
    ...state,
    currentScene: { kind: "dialogue", id: dialogueId, nodeId: startNode, history: [], lastCheck: null },
    npcs: { ...state.npcs, [npcId]: { ...npcState, met: true, lastSeenRound: state.clock.round } },
  };
}

// Procesa el cruce de umbral del doom y encola los eventos a mostrar.
function queueDoomEvents(state, prevValue) {
  const events = getDoomEventsBetween(prevValue, state.doom.value, state.doom.lastTriggered);
  if (events.length === 0) return state;
  return {
    ...state,
    doom: { ...state.doom, lastTriggered: [...state.doom.lastTriggered, ...events.map((e) => e.id)] },
    pendingDoomEvents: [...state.pendingDoomEvents, ...events],
  };
}

// Evalúa fin de partida después de cualquier cambio relevante.
function evaluateFinish(state) {
  if (state.finished) return state;
  if (state.doom.value >= state.doom.max) return { ...state, finished: "doom" };
  if (state.threat >= 6) return { ...state, finished: "defeat" };
  const profile = state.character.campaignProfile;
  const uniqueControl = Object.values(state.control).filter((v) => v === "controlled").length;
  const questsCompleted = Object.values(state.quests).filter((q) => q.completed).length;
  // Victoria temprana por quest principal del perfil
  if (questsCompleted >= 2 && state.threat <= 4) {
    // dejamos seguir hasta fin de campaña; pero anotamos puerta abierta
  }
  if (state.clock.round > state.clock.maxRounds) {
    const primary = profile?.primary || "influence";
    let won = false;
    if (primary === "control") won = uniqueControl >= 5;
    else if (primary === "stability") won = state.influence >= 12 && state.threat <= 3;
    else won = state.influence >= 14 || uniqueControl >= 5;
    if (questsCompleted >= 2) won = true;
    return { ...state, finished: won ? "victory" : "defeat" };
  }
  return state;
}

// Sub-reducer: ejecuta una opción del modal (escena de encuentro o nodo de diálogo).
function executeChoice(state, choice) {
  if (!choice) return state;
  const sceneBefore = state.currentScene;
  // 1. Pagar coste (AP, recursos)
  let next = state;
  if (choice.cost?.ap) {
    next = applyEffect(next, { type: EFFECT_TYPES.AP, value: -choice.cost.ap });
  }
  // 2. Ejecutar chequeo si lo hay
  let checkResult = null;
  let chosenEffects = [];
  if (choice.check) {
    const statKey = choice.check.stat;
    const statVal = next.character.stats?.[statKey] ?? 5;
    checkResult = rollCheck({ stat: statVal, difficulty: choice.check.difficulty, modifiers: choice.check.modifiers || [] });
    const outcome = choice.outcomes?.[checkResult.grade];
    if (outcome) {
      chosenEffects = outcome.effects || [];
      if (outcome.text) {
        next = applyEffect(next, { type: EFFECT_TYPES.LOG, text: outcome.text, kind: checkResult.grade });
      }
    }
  } else if (choice.onResolve) {
    chosenEffects = choice.onResolve;
    if (choice.onResolveText) {
      next = applyEffect(next, { type: EFFECT_TYPES.LOG, text: choice.onResolveText, kind: "info" });
    }
  }
  // 3. Aplicar doom delta y registrar umbrales antes de aplicar más efectos secundarios
  const prevDoom = next.doom.value;
  next = applyEffectsAndOpenScenes(next, chosenEffects);
  if (next.doom.value !== prevDoom) {
    next = queueDoomEvents(next, prevDoom);
  }
  // 4. Avanzar quests por requisitos automáticos
  next = advanceQuestsAfterEffects(next);
  // 5. Encadenar a otra escena/nodo
  // Si los efectos abrieron una escena distinta a la previa, la respetamos y NO cerramos.
  const sceneChangedToNew = next.currentScene && next.currentScene !== sceneBefore && (next.currentScene.id !== sceneBefore?.id || next.currentScene.kind !== sceneBefore?.kind);
  if (sceneChangedToNew) {
    // mantener la escena recién abierta intacta
  } else if (choice.next && next.currentScene?.kind === "dialogue") {
    next = { ...next, currentScene: { ...next.currentScene, nodeId: choice.next, history: [...(next.currentScene.history || []), next.currentScene.nodeId], lastCheck: checkResult } };
  } else if (checkResult && next.currentScene?.kind === "dialogue") {
    const nextNode = isSuccessGrade(checkResult.grade) ? choice.onSuccess?.next : choice.onFail?.next;
    if (nextNode) {
      next = { ...next, currentScene: { ...next.currentScene, nodeId: nextNode, history: [...(next.currentScene.history || []), next.currentScene.nodeId], lastCheck: checkResult } };
    } else {
      next = { ...next, currentScene: null };
    }
  } else if (choice.closesScene !== false) {
    if (next.currentScene?.kind === "encounter" || next.currentScene?.kind === "dialogue") {
      next = { ...next, currentScene: null, eventLog: [{ id: `${next.clock.round}-evt-${Math.random().toString(36).slice(2, 6)}`, text: choice.label || "Escena resuelta", grade: checkResult?.grade || "success" }, ...next.eventLog].slice(0, 8) };
    }
  }
  next = evaluateFinish(next);
  return next;
}

export function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SELECT_LOCATION:
      return { ...state, selectedLocationId: action.locationId };

    case ACTIONS.OPEN_ENCOUNTER: {
      // Selecciona una escena según locationId + fase actual + estado
      let encounterId = action.encounterId;
      if (!encounterId) {
        const enc = pickEncounter({
          locationId: action.locationId,
          daynight: state.clock.daynight,
          state,
        });
        if (!enc) return state;
        encounterId = enc.id;
      }
      // Coste AP de abrir maniobra
      const apCost = action.apCost ?? 2;
      if (state.clock.ap < apCost) return state;
      let next = applyEffect(state, { type: EFFECT_TYPES.AP, value: -apCost });
      next = openEncounterInner(next, encounterId);
      next = { ...next, clock: { ...next.clock, previousType: action.locationType || next.clock.previousType } };
      return next;
    }

    case ACTIONS.OPEN_DIALOGUE: {
      const apCost = action.apCost ?? 1;
      if (state.clock.ap < apCost) return state;
      let next = applyEffect(state, { type: EFFECT_TYPES.AP, value: -apCost });
      next = openDialogueInner(next, action.dialogueId, action.nodeId);
      return next;
    }

    case ACTIONS.CHOOSE_OPTION: {
      return executeChoice(state, action.choice);
    }

    case ACTIONS.CLOSE_SCENE:
      return { ...state, currentScene: null };

    case ACTIONS.SECURE_ENCLAVE: {
      if (state.clock.ap < 1) return state;
      let next = applyEffect(state, { type: EFFECT_TYPES.THREAT, value: -1 });
      next = applyEffect(next, { type: EFFECT_TYPES.AP, value: -1 });
      next = applyEffect(next, { type: EFFECT_TYPES.LOG, text: "Aseguras un enclave: −1 amenaza.", kind: "defensive" });
      return next;
    }

    case ACTIONS.TOGGLE_DAYNIGHT: {
      const isNight = state.clock.daynight === "night";
      const nextDayNight = isNight ? "day" : "night";
      const nextAp = isNight ? state.clock.maxApDay : Math.min(state.clock.ap, state.clock.maxApNight);
      return {
        ...state,
        clock: {
          ...state.clock,
          daynight: nextDayNight,
          ap: isNight ? state.clock.ap : nextAp,   // de noche conservas AP, no rebasas el techo
        },
      };
    }

    case ACTIONS.END_ROUND: {
      let next = state;
      // Decrementa Paranoia: si tiene Paranoia y resuelve cualquier maniobra esta ronda, sigue.
      // Simple: decrementa Paranoia con 50% si está activo.
      if (next.character.statuses.some((s) => s.name === "Paranoia") && Math.random() < 0.5) {
        next = applyEffect(next, { type: EFFECT_TYPES.STATUS_REMOVE, status: "Paranoia" });
      }
      // Avanza ronda
      next = {
        ...next,
        clock: {
          ...next.clock,
          round: next.clock.round + 1,
          ap: next.clock.maxApDay,
          daynight: "day",
          previousType: null,
        },
      };
      next = applyEffect(next, { type: EFFECT_TYPES.LOG, text: `Comienza la ronda ${next.clock.round}.`, kind: "round" });
      // Con probabilidad 35%, disparar un evento político de ronda
      if (Math.random() < 0.35) {
        const polEvent = pickPoliticalRoundEvent(next);
        if (polEvent) {
          next = { ...next, pendingDoomEvents: [...next.pendingDoomEvents, { ...polEvent, isPolitical: true, round: next.clock.round }] };
          next = applyEffect(next, { type: EFFECT_TYPES.LOG, text: `${polEvent.title} · Evento político.`, kind: "political" });
        }
      }
      next = evaluateFinish(next);
      return next;
    }

    case ACTIONS.DISMISS_DOOM_EVENT: {
      if (state.pendingDoomEvents.length === 0) return state;
      const [head, ...rest] = state.pendingDoomEvents;
      let next = { ...state, pendingDoomEvents: rest };
      const prevDoom = next.doom.value;
      next = applyEffectsAndOpenScenes(next, head.effects || []);
      if (next.doom.value !== prevDoom) next = queueDoomEvents(next, prevDoom);
      next = applyEffect(next, { type: EFFECT_TYPES.LOG, text: head.title + " · " + head.text, kind: "doom" });
      next = evaluateFinish(next);
      return next;
    }

    case ACTIONS.LOAD_STATE: {
      if (!action.state) return state;
      return action.state;
    }

    case ACTIONS.RESET_GAME:
      return makeInitialState(action.character);

    default:
      return state;
  }
}
