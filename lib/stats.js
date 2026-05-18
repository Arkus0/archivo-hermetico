import { POLITICIAN_STATS } from "./politicianStats.js";

const QUESTION_STAT_MAP = {
  1: { 0: "ritualismo", 1: "recursos", 2: "perspicacia", 3: "carisma" },
  6: { 0: "conocimiento_arcano", 1: "ritualismo", 2: "voluntad", 3: "carisma" },
  8: { 0: "sensibilidad", 1: "perspicacia", 2: "sangre_fria", 3: "ritualismo" },
  10: { 0: "voluntad", 1: "sensibilidad", 2: "perspicacia", 3: "carisma" },
  15: { 0: "sensibilidad", 1: "sangre_fria", 2: "perspicacia", 3: "conocimiento_arcano" },
  23: { 0: "ritualismo", 1: "perspicacia", 2: "voluntad", 3: "conocimiento_arcano" },
  24: { 0: "sensibilidad", 1: "conocimiento_arcano", 2: "voluntad", 3: "carisma" },
  35: { 0: "sensibilidad", 1: "perspicacia", 2: "conocimiento_arcano", 3: "carisma" },
  51: { 0: "sensibilidad", 1: "perspicacia", 2: "voluntad", 3: "ritualismo" },
  57: { 0: "voluntad", 1: "carisma", 2: "recursos", 3: "sangre_fria" },
  60: { 0: "carisma", 1: "recursos", 2: "sangre_fria", 3: "perspicacia" },
  65: { 0: "conocimiento_arcano", 1: "carisma", 2: "voluntad", 3: "perspicacia" },
  70: { 0: "ritualismo", 1: "perspicacia", 2: "sangre_fria", 3: "voluntad" },
  75: { 0: "conocimiento_arcano", 1: "ritualismo", 2: "carisma", 3: "recursos" },
  77: { 0: "sensibilidad", 1: "ritualismo", 2: "conocimiento_arcano", 3: "perspicacia" },
  81: { 0: "ritualismo", 1: "perspicacia", 2: "voluntad", 3: "conocimiento_arcano" },
  85: { 0: "ritualismo", 1: "sensibilidad", 2: "voluntad", 3: "conocimiento_arcano" },
  88: { 0: "perspicacia", 1: "carisma", 2: "voluntad", 3: "sensibilidad" },
};

const STAT_KEYS = ["voluntad", "carisma", "perspicacia", "sangre_fria", "recursos", "sensibilidad", "ritualismo", "conocimiento_arcano"];

const STAT_META = {
  voluntad: { label: "Voluntad", glyph: "✦", description: "Aguante mental frente al pánico." },
  carisma: { label: "Carisma", glyph: "♚", description: "Influencia social y liderazgo." },
  perspicacia: { label: "Perspicacia", glyph: "☉", description: "Lectura de mentiras y patrones." },
  sangre_fria: { label: "Sangre fría", glyph: "⛨", description: "Control en escenas violentas." },
  recursos: { label: "Recursos", glyph: "⚖", description: "Red de contactos, dinero y cobertura." },
  sensibilidad: { label: "Sensibilidad", glyph: "☾", description: "Percepción de presencias y anomalías." },
  ritualismo: { label: "Ritualismo", glyph: "🜂", description: "Capacidad para ejecutar ritos sin quebrarte." },
  conocimiento_arcano: { label: "Conocimiento arcano", glyph: "⚸", description: "Saber prohibido, grimorios y claves." },
};

function convertLegacyBase(base) {
  return {
    voluntad: base.resistencia,
    carisma: base.carisma,
    perspicacia: base.astucia,
    sangre_fria: Math.max(1, Math.min(10, Math.round((base.resistencia + base.astucia) / 2))),
    recursos: Math.max(1, Math.min(10, Math.round((base.astucia + base.verbo) / 2))),
    sensibilidad: base.ocultismo,
    ritualismo: Math.max(1, Math.min(10, Math.round((base.ocultismo + base.verbo) / 2))),
    conocimiento_arcano: Math.max(1, Math.min(10, Math.round((base.ocultismo + base.astucia) / 2))),
  };
}

export function computeStats(politicianId, questions, answers) {
  const legacyBase = POLITICIAN_STATS[politicianId];
  const base = legacyBase ? convertLegacyBase(legacyBase) : Object.fromEntries(STAT_KEYS.map((k) => [k, 5]));

  const counts = Object.fromEntries(STAT_KEYS.map((k) => [k, 0]));
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const mapForQ = QUESTION_STAT_MAP[q.id];
    if (!mapForQ) continue;
    const stat = mapForQ[answers[i]];
    if (stat) counts[stat] += 1;
  }

  const sorted = STAT_KEYS.map((k) => ({ k, n: counts[k] })).sort((a, b) => b.n - a.n);
  const mod = Object.fromEntries(STAT_KEYS.map((k) => [k, 0]));
  if (sorted[0].n > 0) mod[sorted[0].k] = 2;
  if (sorted[1].n > 0) mod[sorted[1].k] = 1;
  if (sorted.at(-1).n === 0 && sorted[0].n > 0) mod[sorted.at(-1).k] = -1;

  return Object.fromEntries(STAT_KEYS.map((k) => [k, Math.max(1, Math.min(10, base[k] + mod[k]))]));
}

export const statKeys = () => [...STAT_KEYS];
export const statMeta = (k) => STAT_META[k];
