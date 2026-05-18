import { POLITICIANS } from "./politicians.js";

// Precomputado: por cada (questionId, optionIdx), cuántos políticos
// del pool comparten esa afinidad. Sirve para pesar los hits raros más.
function buildRarityIndex() {
  const counts = {};
  for (const p of POLITICIANS) {
    for (const [qid, opt] of Object.entries(p.affinities)) {
      const key = `${qid}:${opt}`;
      counts[key] = (counts[key] || 0) + 1;
    }
  }
  return counts;
}

const RARITY_INDEX = buildRarityIndex();

function rarityWeight(qid, optionIdx) {
  const n = RARITY_INDEX[`${qid}:${optionIdx}`] || 0;
  if (n === 0) return 0;
  // 1/n da peso máximo a las opciones únicas, mínimo a las muy comunes.
  // Boost ligero para que los hits raros pesen aún más.
  return 1 / Math.sqrt(n);
}

// Score máximo teórico para un político en un quiz dado: la suma de pesos
// de todas sus afinidades elegibles (preguntas presentes en el quiz).
function maxPossibleScore(politician, questions) {
  let max = 0;
  for (const q of questions) {
    const expected = politician.affinities[q.id];
    if (expected !== undefined) {
      max += rarityWeight(q.id, expected);
    }
  }
  return max;
}

// Score real conseguido por un político con las respuestas del usuario.
function actualScore(politician, questions, answers) {
  let score = 0;
  const hitDetails = []; // array de { qid, qText, answerText }
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const userOpt = answers[i];
    const expected = politician.affinities[q.id];
    if (expected !== undefined && expected === userOpt) {
      score += rarityWeight(q.id, userOpt);
      hitDetails.push({
        qid: q.id,
        qText: q.text,
        answerText: q.options[userOpt],
      });
    }
  }
  return { score, hitDetails };
}

// Mapea un ratio (0..1) al porcentaje de afinidad mostrado al usuario.
// Rango: 62 (nada coincide) – 96 (coincide casi todo lo elegible).
// Calibrado con piso para que el top 3 nunca se vea ridículo.
function scoreToPercent(ratio) {
  const pct = 62 + ratio * 34;
  return Math.max(62, Math.min(96, Math.round(pct)));
}

// Genera número de expediente con sabor decimonónico.
function makeFileNumber() {
  const romans = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
  const greek = ["Α","Β","Γ","Δ","Ε","Ζ","Η","Θ","Λ","Μ","Ξ","Π","Σ","Φ","Ψ","Ω"];
  const year = 1700 + Math.floor(Math.random() * 325);
  const a = romans[Math.floor(Math.random()*romans.length)];
  const b = greek[Math.floor(Math.random()*greek.length)];
  const c = romans[Math.floor(Math.random()*romans.length)];
  return `${a}-${year}-${b}-${c}`;
}

// Sentencias finales aleatorias. Una sola frase, sin esperanza.
const VERDICTS = [
  "El sujeto firmará lo que firme y será firmado a su vez.",
  "El expediente se cierra sin que nadie lo haya abierto del todo.",
  "Toda afinidad histórica es una deuda contraída por adelantado.",
  "El archivo confirma lo que el sujeto ya temía: alguien firmó por él.",
  "La sangre no se elige, pero los pactos heredados, tampoco.",
  "El sujeto repetirá tres veces lo que cree haber escapado una.",
  "La política española no se entiende sin el rumor que la sostiene.",
  "Quien se reconoce en estos espejos no sale ya por la misma puerta.",
  "La logia toma nota y archiva sin emitir juicio: el juicio se emite solo.",
  "El sujeto se quedará a las puertas de Moncloa por motivos que no son los suyos.",
  "Lo que el archivo declara, el tiempo lo subraya con tinta más oscura.",
  "Conviene al sujeto cambiar de barbero y de confesor en el mismo otoño.",
];

function pickVerdict() {
  return VERDICTS[Math.floor(Math.random() * VERDICTS.length)];
}

/**
 * Función principal del matcher.
 * @param {Array} questions - preguntas del quiz actual (subset del banco).
 * @param {Array<number>} answers - índice 0..3 de la opción elegida por cada pregunta.
 * @returns objeto con file_number, matches[3] (con name, epitaph, match_percent,
 *   justification, hits) y verdict.
 */
export function runMatcher(questions, answers) {
  if (questions.length !== answers.length) {
    throw new Error("Inconsistencia entre preguntas y respuestas.");
  }

  const scored = POLITICIANS.map((p) => {
    const { score, hitDetails } = actualScore(p, questions, answers);
    const maxScore = maxPossibleScore(p, questions);
    // Si un político tiene 0 afinidades elegibles en este quiz, le damos un
    // score mínimo para que no desbalancee. Caso raro pero posible.
    const ratio = maxScore > 0 ? score / maxScore : 0;
    // Penalización suave si tiene MUY pocas afinidades elegibles: matchear 2/2 no
    // debería darte 100% match. Usamos una función de confianza basada en cantidad.
    const confidence = Math.min(1, maxScore / 1.5);
    const adjustedRatio = ratio * confidence;
    return {
      politician: p,
      rawScore: score,
      maxScore,
      ratio,
      adjustedRatio,
      hits: hitDetails,
    };
  });

  // Ordenamos por ratio ajustado.
  scored.sort((a, b) => b.adjustedRatio - a.adjustedRatio);

  // Aseguramos que los tres primeros no sean idénticos en porcentaje:
  // si hay empate exacto, desempate aleatorio (la barajamos antes).
  const top3 = scored.slice(0, 3);

  const matches = top3.map((s, i) => {
    // El primero arriba, los demás desciendan claramente.
    // Ajuste de visual: damos un mínimo de separación entre puestos.
    let pct = scoreToPercent(s.adjustedRatio);
    if (i === 0) {
      // El primero siempre 4+ puntos por encima del segundo
      const second = scoreToPercent(top3[1]?.adjustedRatio || 0);
      if (pct - second < 4) pct = Math.min(96, second + 4);
    } else if (i === 2) {
      // El tercero siempre 2+ por debajo del segundo
      const second = scoreToPercent(top3[1]?.adjustedRatio || 0);
      if (second - pct < 2) pct = Math.max(62, second - 2);
    }
    return {
      id: s.politician.id,
      name: s.politician.name,
      epitaph: s.politician.epitaph,
      justification: s.politician.justification,
      match_percent: pct,
      hits: s.hits.slice(0, 5), // hasta 5 coincidencias visibles
    };
  });

  return {
    file_number: makeFileNumber(),
    matches,
    verdict: pickVerdict(),
  };
}

// Helper para barajar el banco antes de cada partida.
export function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
