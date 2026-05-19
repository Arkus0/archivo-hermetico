import { EFFECT_TYPES } from "./effects.js";

const E = EFFECT_TYPES;

export const POLITICAL_ROUND_EVENTS = [
  {
    id: "pe_crisis_coalicion",
    title: "Crisis de coalición",
    text: "Uno de los socios de gobierno amenaza con romper el pacto de investidura. Los portavoces llevan tres horas en una sala sin salida pública.",
    effects: [{ type: E.THREAT, value: 1 }],
  },
  {
    id: "pe_escandalo_finanzas",
    title: "Escándalo de financiación",
    text: "Sale a la luz una donación irregular en el partido. El gabinete de comunicación no responde el teléfono desde las ocho de la mañana.",
    effects: [{ type: E.REPUTATION_FACTION, faction: "aparato", value: -1 }, { type: E.THREAT, value: 1 }],
  },
  {
    id: "pe_huelga_general",
    title: "Convocatoria de huelga",
    text: "Los sindicatos convocan huelga general para la semana que viene. La Calle toma nota de quién apoya y quién calla.",
    effects: [{ type: E.REPUTATION_FACTION, faction: "calle", value: 1 }, { type: E.THREAT, value: 1 }],
  },
  {
    id: "pe_cumbre_europea",
    title: "Cumbre europea urgente",
    text: "Madrid acoge una cumbre de emergencia sobre presupuestos comunitarios. Los Extranjeros están atentos a quién aparece en las fotos.",
    effects: [{ type: E.REPUTATION_FACTION, faction: "extranjeros", value: 1 }, { type: E.INFLUENCE, value: 1 }],
  },
  {
    id: "pe_mocion_procedimiento",
    title: "Moción de procedimiento",
    text: "La oposición activa una moción de procedimiento en el Congreso. Menor en forma, mayor en intención. El hemiciclo lleva dos horas vaciando el bar.",
    effects: [{ type: E.THREAT, value: 1 }],
  },
  {
    id: "pe_debate_investidura",
    title: "Debate de investidura fallido",
    text: "El candidato no consigue los votos en primera votación. El partido busca culpables. Todos miran hacia los mismos despachos.",
    effects: [{ type: E.INFLUENCE, value: -1 }, { type: E.THREAT, value: 1 }],
  },
];

export function pickPoliticalRoundEvent(state) {
  const seen = new Set(state.eventLog?.map((e) => e.id) || []);
  const available = POLITICAL_ROUND_EVENTS.filter((e) => !seen.has(e.id));
  if (available.length === 0) return POLITICAL_ROUND_EVENTS[Math.floor(Math.random() * POLITICAL_ROUND_EVENTS.length)];
  return available[Math.floor(Math.random() * available.length)];
}
