// Mapping de qué políticos patrocinan cada enclave de Madrid.
// Un político puede patrocinar 1-3 enclaves; cada enclave puede tener 1-3 patrocinadores.
// La facción aquí declarada complementa a la del registro principal en politicians.js.

export const POLITICIAN_FACTIONS = {
  sanchez:     "aparato",
  feijoo:      "aparato",
  abascal:     "aparato",
  yolanda:     "calle",
  iglesias:    "calle",
  ayuso:       "aparato",
  puigdemont:  "extranjeros",
  otegi:       "calle",
  errejon:     "calle",
  olona:       "aparato",
  rufian:      "calle",
  colau:       "calle",
  felipe:      "corona",
  aznar:       "aparato",
  zapatero:    "aparato",
  rajoy:       "aparato",
  suarez:      "corona",
  fraga:       "aparato",
  anguita:     "calle",
  aguirre:     "aparato",
  franco:      "iglesia",
  pasionaria:  "calle",
  carrero:     "iglesia",
  azana:       "logia",
  durruti:     "calle",
  joseantonio: "iglesia",
  olivares:    "corona",
  godoy:       "corona",
  canovas:     "aparato",
  prim:        "corona",
};

// Disposición inicial por defecto del político hacia el jugador (sin antes haberse encontrado).
// Cuanto más cercano al político-avatar del jugador, más cordial; los rivales arrancan fríos.
export const POLITICIAN_INITIAL_DISPOSITION = {
  franco: -1, joseantonio: -1, carrero: -1,
  durruti: -1, pasionaria: -1, anguita: 0,
  abascal: -1, ayuso: 0,
};

// Quién habita qué enclave. Lista de [politicianId, enclaveId].
// 30 políticos × 1-2 enclaves ≈ 50 emparejamientos.
export const PLACEMENTS = [
  // Templos
  ["franco",       "debod"],
  ["carrero",      "debod"],
  ["joseantonio",  "debod"],
  ["fraga",        "san-anton"],
  ["aznar",        "san-anton"],
  ["iglesias",     "san-anton"],
  ["zapatero",     "almudena-cripta"],
  ["felipe",       "almudena-cripta"],
  ["franco",       "almudena-cripta"],
  // Palacios
  ["sanchez",      "linares"],
  ["ayuso",        "linares"],
  ["aguirre",      "linares"],
  ["felipe",       "siete-chimeneas"],
  ["suarez",       "siete-chimeneas"],
  ["godoy",        "siete-chimeneas"],
  ["canovas",      "plaza-villa"],
  ["prim",         "plaza-villa"],
  ["azana",        "plaza-villa"],
  ["felipe",       "plaza-oriente"],
  ["olivares",     "plaza-oriente"],
  ["godoy",        "plaza-oriente"],
  // Cementerios
  ["azana",        "san-isidro"],
  ["canovas",      "san-isidro"],
  ["prim",         "san-isidro"],
  ["franco",       "almudena-cementerio"],
  ["pasionaria",   "almudena-cementerio"],
  ["durruti",      "almudena-cementerio"],
  // Saber
  ["olivares",     "observatorio"],
  ["fraga",        "observatorio"],
  ["aznar",        "observatorio"],
  ["azana",        "moyano"],
  ["anguita",      "moyano"],
  ["errejon",      "moyano"],
  ["zapatero",     "moyano"],
  // Memoria
  ["carrero",      "claudio-coello"],
  ["rajoy",        "claudio-coello"],
  ["abascal",      "claudio-coello"],
  ["canovas",      "san-gines"],
  ["sanchez",      "san-gines"],
  ["feijoo",       "san-gines"],
  // Reparto opcional para cubrir los menos colocados
  ["yolanda",      "moyano"],
  ["yolanda",      "linares"],
  ["rufian",       "plaza-villa"],
  ["rufian",       "claudio-coello"],
  ["colau",        "san-isidro"],
  ["colau",        "almudena-cementerio"],
  ["puigdemont",   "siete-chimeneas"],
  ["puigdemont",   "plaza-oriente"],
  ["otegi",        "claudio-coello"],
  ["otegi",        "almudena-cementerio"],
  ["olona",        "san-anton"],
  ["pasionaria",   "san-isidro"],
];

export function getSponsorsOf(locationId) {
  return PLACEMENTS.filter(([, loc]) => loc === locationId).map(([pol]) => pol);
}

export function getLocationsOf(politicianId) {
  return PLACEMENTS.filter(([pol]) => pol === politicianId).map(([, loc]) => loc);
}

export function getPoliticianFaction(politicianId) {
  return POLITICIAN_FACTIONS[politicianId] || "aparato";
}

export function getInitialDisposition(politicianId) {
  return POLITICIAN_INITIAL_DISPOSITION[politicianId] ?? 0;
}
