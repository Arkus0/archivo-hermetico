// Reglas de campaña y mapping enclave→stat. El núcleo de chequeos vive en checks.js;
// los efectos en effects.js; el flujo de juego en gameState.js. Este archivo declara
// los conceptos macro del tablero (qué stat se prueba en cada enclave, su dificultad,
// el coste de acción y la condición de victoria).

import { rollCheck } from "./checks.js";

export const TYPE_TO_STAT = {
  templo: "voluntad",
  palacio: "carisma",
  cementerio: "sangre_fria",
  saber: "perspicacia",
  memoria: "ritualismo",
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

export function actionCost({ selectedType, selectedControlState, previousType, daynight = "day" }) {
  let cost = 2;
  if (selectedControlState === CONTROL_STATES.controlled) cost += 1;
  if (selectedControlState === CONTROL_STATES.contested) cost += 1;
  if (previousType === selectedType) cost += 1;
  if (selectedType === "memoria") cost += 1;
  if (daynight === "night") cost = Math.max(1, cost - 1);
  return cost;
}

// evaluateVictory extendida: contempla doom, quests completadas y umbrales nuevos.
export function evaluateVictory({ campaignProfile, influence, uniqueControl, threat, round, maxRounds, doom = 0, doomMax = 12, questsCompleted = 0 }) {
  if (doom >= doomMax) return false;
  if (threat >= 6) return false;
  if (round <= maxRounds) return false;
  if (questsCompleted >= 2 && threat <= 4) return true;
  const primary = campaignProfile?.primary || "influence";
  if (primary === "control") return uniqueControl >= 5;
  if (primary === "stability") return influence >= 12 && threat <= 3;
  return influence >= 14 || uniqueControl >= 5;
}

// Compat: re-export para mapa.
export { rollCheck };
