// Deriva los stats finales del personaje mezclando:
//   1) los stats base del político elegido (POLITICIAN_STATS)
//   2) modulación por las respuestas del quiz del usuario
//
// Cada respuesta puede sumar a un atributo concreto. Se normaliza al final
// para que el ajuste no salga del rango ±2 sobre la base.

import { POLITICIAN_STATS } from "./politicianStats.js";

// Mapa pregunta → opción → atributo modulado.
// No están todas las 90: solo aquellas donde el sesgo es claro.
const QUESTION_STAT_MAP = {
  1:  { 0: "ocultismo", 1: "astucia", 2: "astucia", 3: "carisma" },
  2:  { 0: "ocultismo", 1: "ocultismo", 2: "ocultismo", 3: "astucia" },
  4:  { 0: "astucia", 1: "resistencia", 2: "ocultismo", 3: "astucia" },
  5:  { 0: "astucia", 1: "resistencia", 2: "resistencia", 3: "ocultismo" },
  6:  { 0: "astucia", 1: "ocultismo", 2: "resistencia", 3: "carisma" },
  8:  { 0: "ocultismo", 1: "astucia", 2: "resistencia", 3: "ocultismo" },
  10: { 0: "astucia", 1: "ocultismo", 2: "astucia", 3: "carisma" },
  11: { 0: "resistencia", 1: "carisma", 2: "carisma", 3: "ocultismo" },
  12: { 0: "ocultismo", 1: "resistencia", 2: "astucia", 3: "astucia" },
  13: { 0: "astucia", 1: "astucia", 2: "resistencia", 3: "carisma" },
  15: { 0: "ocultismo", 1: "resistencia", 2: "astucia", 3: "ocultismo" },
  17: { 0: "astucia", 1: "carisma", 2: "astucia", 3: "verbo" },
  18: { 0: "astucia", 1: "astucia", 2: "astucia", 3: "carisma" },
  22: { 0: "carisma", 1: "astucia", 2: "verbo", 3: "carisma" },
  23: { 0: "ocultismo", 1: "astucia", 2: "resistencia", 3: "astucia" },
  24: { 0: "ocultismo", 1: "ocultismo", 2: "astucia", 3: "carisma" },
  26: { 0: "astucia", 1: "verbo", 2: "resistencia", 3: "astucia" },
  27: { 0: "resistencia", 1: "carisma", 2: "ocultismo", 3: "astucia" },
  30: { 0: "carisma", 1: "carisma", 2: "astucia", 3: "carisma" },
  35: { 0: "carisma", 1: "astucia", 2: "ocultismo", 3: "verbo" },
  36: { 0: "carisma", 1: "verbo", 2: "astucia", 3: "astucia" },
  37: { 0: "astucia", 1: "carisma", 2: "ocultismo", 3: "ocultismo" },
  43: { 0: "astucia", 1: "verbo", 2: "astucia", 3: "ocultismo" },
  44: { 0: "astucia", 1: "carisma", 2: "verbo", 3: "ocultismo" },
  45: { 0: "astucia", 1: "ocultismo", 2: "resistencia", 3: "verbo" },
  46: { 0: "verbo", 1: "carisma", 2: "resistencia", 3: "resistencia" },
  50: { 0: "ocultismo", 1: "carisma", 2: "astucia", 3: "astucia" },
  51: { 0: "ocultismo", 1: "astucia", 2: "astucia", 3: "ocultismo" },
  56: { 0: "resistencia", 1: "astucia", 2: "astucia", 3: "carisma" },
  57: { 0: "astucia", 1: "verbo", 2: "astucia", 3: "resistencia" },
  60: { 0: "astucia", 1: "astucia", 2: "resistencia", 3: "astucia" },
  61: { 0: "ocultismo", 1: "verbo", 2: "verbo", 3: "astucia" },
  65: { 0: "ocultismo", 1: "verbo", 2: "verbo", 3: "verbo" },
  66: { 0: "carisma", 1: "astucia", 2: "astucia", 3: "ocultismo" },
  67: { 0: "astucia", 1: "resistencia", 2: "astucia", 3: "carisma" },
  69: { 0: "astucia", 1: "verbo", 2: "astucia", 3: "ocultismo" },
  70: { 0: "ocultismo", 1: "astucia", 2: "resistencia", 3: "resistencia" },
  72: { 0: "carisma", 1: "astucia", 2: "resistencia", 3: "astucia" },
  75: { 0: "astucia", 1: "ocultismo", 2: "verbo", 3: "astucia" },
  76: { 0: "astucia", 1: "verbo", 2: "ocultismo", 3: "resistencia" },
  77: { 0: "ocultismo", 1: "ocultismo", 2: "ocultismo", 3: "ocultismo" },
  78: { 0: "astucia", 1: "astucia", 2: "carisma", 3: "resistencia" },
  81: { 0: "ocultismo", 1: "astucia", 2: "resistencia", 3: "ocultismo" },
  83: { 0: "ocultismo", 1: "astucia", 2: "carisma", 3: "astucia" },
  84: { 0: "astucia", 1: "astucia", 2: "verbo", 3: "carisma" },
  85: { 0: "ocultismo", 1: "ocultismo", 2: "ocultismo", 3: "ocultismo" },
  86: { 0: "resistencia", 1: "astucia", 2: "resistencia", 3: "resistencia" },
  88: { 0: "astucia", 1: "carisma", 2: "ocultismo", 3: "ocultismo" },
  89: { 0: "resistencia", 1: "astucia", 2: "verbo", 3: "carisma" },
  90: { 0: "carisma", 1: "astucia", 2: "verbo", 3: "carisma" },
};

const STAT_KEYS = ["astucia", "verbo", "ocultismo", "carisma", "resistencia"];

const STAT_META = {
  astucia:     { label: "Astucia",     glyph: "✦", description: "Manejo del tablero. Hilos invisibles. Tres jugadas vista." },
  verbo:       { label: "Verbo",       glyph: "☉", description: "Hechizo retórico. Vocablo que ata. Voz que somete." },
  ocultismo:   { label: "Ocultismo",   glyph: "⚸", description: "Afinidad con lo invisible. Pactos no protocolarios." },
  carisma:     { label: "Carisma",     glyph: "♚", description: "Gravitación personal. Reclutar sin prometer." },
  resistencia: { label: "Resistencia", glyph: "⛨", description: "Aguante en derrotas. Capacidad de regresar tres veces." },
};

export function computeStats(politicianId, questions, answers) {
  const base = POLITICIAN_STATS[politicianId];
  if (!base) {
    return {
      astucia: 5, verbo: 5, ocultismo: 5, carisma: 5, resistencia: 5,
    };
  }

  const counts = { astucia: 0, verbo: 0, ocultismo: 0, carisma: 0, resistencia: 0 };

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const a = answers[i];
    const mapForQ = QUESTION_STAT_MAP[q.id];
    if (!mapForQ) continue;
    const stat = mapForQ[a];
    if (stat) counts[stat] += 1;
  }

  // Normalizamos al rango ±2: el stat que más se haya marcado sube 2, el segundo +1.
  const sorted = STAT_KEYS
    .map((k) => ({ k, n: counts[k] }))
    .sort((a, b) => b.n - a.n);

  const mod = { astucia: 0, verbo: 0, ocultismo: 0, carisma: 0, resistencia: 0 };
  if (sorted[0].n > 0) mod[sorted[0].k] = 2;
  if (sorted[1].n > 0 && sorted[1].n >= sorted[0].n - 1) mod[sorted[1].k] = 1;
  // Penalizar levemente el menos marcado, solo si hubo alguna marca
  if (sorted[0].n > 0 && sorted[4].n === 0) mod[sorted[4].k] = -1;

  const final = {};
  for (const k of STAT_KEYS) {
    final[k] = Math.min(10, Math.max(1, base[k] + mod[k]));
  }
  return final;
}

export function statKeys() {
  return [...STAT_KEYS];
}

export function statMeta(key) {
  return STAT_META[key];
}
