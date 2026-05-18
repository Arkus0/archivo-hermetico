// Seis facciones del tablero hermético-político de la Villa.
// La reputación con cada facción oscila entre -3 (hostil) y +3 (cómplice).

export const FACTIONS = {
  logia:       { id: "logia",       name: "La Logia del Tedio", glyph: "⚸", short: "Tutela esotérica del expediente.", color: "#5C1820" },
  aparato:     { id: "aparato",     name: "El Aparato",         glyph: "♚", short: "Maquinaria del partido-Estado.", color: "#1A1410" },
  iglesia:     { id: "iglesia",     name: "La Iglesia",         glyph: "✝", short: "Curia, capellanes y diocesanos.", color: "#3D5C1A" },
  calle:       { id: "calle",       name: "La Calle",           glyph: "☩", short: "Sindicatos, vecinos, barrio.",   color: "#6E3015" },
  corona:      { id: "corona",      name: "La Casa Real",       glyph: "♛", short: "Zarzuela y entorno cortesano.",  color: "#A88B3F" },
  extranjeros: { id: "extranjeros", name: "Los Extranjeros",    glyph: "☾", short: "Embajadas y lobbies foráneos.",  color: "#3F5469" },
};

export const FACTION_IDS = Object.keys(FACTIONS);

export const DISPOSITION_TIERS = [
  { min: -3, max: -3, label: "Cómplice del enemigo", short: "anatema" },
  { min: -2, max: -2, label: "Hostil",                short: "hostil" },
  { min: -1, max: -1, label: "Desconfiada",           short: "fría" },
  { min:  0, max:  0, label: "Neutral",               short: "neutra" },
  { min:  1, max:  1, label: "Cordial",               short: "cordial" },
  { min:  2, max:  2, label: "Aliada",                short: "aliada" },
  { min:  3, max:  3, label: "Cómplice",              short: "cómplice" },
];

export function getDispositionTier(value) {
  const v = Math.max(-3, Math.min(3, value | 0));
  return DISPOSITION_TIERS.find((t) => v >= t.min && v <= t.max) || DISPOSITION_TIERS[3];
}

export function clampReputation(value) {
  return Math.max(-3, Math.min(3, value | 0));
}

export function initialFactionReputation() {
  return FACTION_IDS.reduce((acc, id) => { acc[id] = 0; return acc; }, {});
}
