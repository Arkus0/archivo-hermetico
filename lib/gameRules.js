import { buildPerks } from "./perks.js";
import { buildStatuses } from "./statusEffects.js";
import { NPC_EVENTS } from "./npcEvents.js";

export const TYPE_TO_STAT = {
  templo: "voluntad",
  palacio: "carisma",
  cementerio: "sangre_fria",
  saber: "perspicacia",
  memoria: "paranoia",
};

export const TYPE_DIFFICULTY = {
  templo: 9,
  palacio: 10,
  cementerio: 8,
  saber: 9,
  memoria: 10,
};

export const CONTROL_STATES = {
  neutral: "neutral",
  contested: "contested",
  controlled: "controlled",
};

function getArchetype(character) {
  return buildPerks(character.stats).archetype;
}

function getStatusSet(character) {
  return new Set(buildStatuses(character.answers).map((s) => s.name));
}

function pickWeightedEvent({ threat, selectedType, archetype, lastEventId }) {
  const candidates = NPC_EVENTS.filter((e) => e.id !== lastEventId);
  const scored = candidates.map((e) => {
    let w = 1;
    if (threat >= 4) w += 1;
    if (e.test === "carisma" && archetype === "operador") w += 2;
    if (e.test === "perspicacia" && archetype === "investigador") w += 2;
    if (e.test === "ritualismo" && archetype === "medium") w += 2;
    if (selectedType === "palacio" && e.test === "carisma") w += 1;
    if (selectedType === "saber" && e.test === "perspicacia") w += 1;
    return { e, w };
  });
  const total = scored.reduce((a, b) => a + b.w, 0);
  let roll = Math.random() * total;
  for (const item of scored) {
    roll -= item.w;
    if (roll <= 0) return item.e;
  }
  return scored[0].e;
}

export function evaluateVictory({ campaignProfile, influence, uniqueControl, threat, round, maxRounds }) {
  if (threat >= 6) return false;
  if (round <= maxRounds) return false;
  const primary = campaignProfile?.primary || "influence";
  if (primary === "control") return uniqueControl >= 6;
  if (primary === "stability") return influence >= 13 && threat <= 3;
  return influence >= 16 || uniqueControl >= 6;
}

export function actionCost({ selectedType, selectedControlState, previousType }) {
  let cost = 2;
  if (selectedControlState === CONTROL_STATES.controlled) cost += 1;
  if (selectedControlState === CONTROL_STATES.contested) cost += 1;
  if (previousType === selectedType) cost += 1;
  if (selectedType === "memoria") cost += 1;
  return cost;
}

export function resolveAction({ character, selectedLocation, selectedControlState, round, influence, threat, ap, previousType, lastEventId }) {
  const archetype = getArchetype(character);
  const statuses = getStatusSet(character);

  const statKey = TYPE_TO_STAT[selectedLocation.type] === "paranoia" ? "voluntad" : TYPE_TO_STAT[selectedLocation.type];
  const baseStat = character.stats?.[statKey] ?? 5;
  const statusMod = statuses.has("Paranoia") ? -1 : 0;
  const perkMod = archetype === "operador" && selectedLocation.type === "palacio" ? 1 : 0;
  const effectiveStat = Math.max(1, baseStat + statusMod + perkMod);

  const difficulty = TYPE_DIFFICULTY[selectedLocation.type] + (selectedControlState !== CONTROL_STATES.neutral ? 1 : 0);
  const dice = Math.floor(Math.random() * 6) + 1;
  const total = dice + Math.floor(effectiveStat / 2);
  const success = total >= difficulty;

  const event = pickWeightedEvent({ threat, selectedType: selectedLocation.type, archetype, lastEventId });
  const eventStat = character.stats?.[event.test] ?? 5;
  const eventDice = Math.floor(Math.random() * 6) + 1;
  const eventSuccess = eventDice + Math.floor(eventStat / 2) >= event.difficulty;

  const nextControlState = success
    ? CONTROL_STATES.controlled
    : (selectedControlState === CONTROL_STATES.controlled ? CONTROL_STATES.contested : CONTROL_STATES.contested);

  const influenceDelta = (success ? 3 : 1) + (eventSuccess ? event.success.influence : event.fail.influence);
  const threatDeltaBase = (success ? 0 : 1) + (eventSuccess ? event.success.threat : event.fail.threat);
  const threatDelta = statuses.has("Protección") ? Math.max(0, threatDeltaBase - 1) : threatDeltaBase;

  return {
    apSpent: actionCost({ selectedType: selectedLocation.type, selectedControlState, previousType }),
    success,
    dice,
    statKey,
    effectiveStat,
    difficulty,
    total,
    event,
    eventSuccess,
    eventDice,
    influenceDelta,
    threatDelta,
    nextControlState,
    triggerReason: threat >= 4 ? "Escalada por amenaza alta" : `Pulso en ${selectedLocation.type}`,
    round,
    influence,
  };
}
