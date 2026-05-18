// Catálogo de NPCs con diálogo. 8 políticos del banco principal + 7 NPCs nuevos.
// Cada NPC referencia un árbol en dialogues.js.

export const NPCS = {
  // ── Políticos con árbol de diálogo ─────────────────────────────────
  sanchez: {
    id: "sanchez",
    name: "Pedro Sánchez",
    role: "Manual de resistencia",
    faction: "aparato",
    dialogueTreeId: "tree_sanchez",
    flavor: "Te recibe sin pedirte que te sientes. Recita en bajo: «resistir, prometer, indultar».",
    politicianId: "sanchez",
  },
  feijoo: {
    id: "feijoo",
    name: "Alberto Núñez Feijóo",
    role: "Cuatro mayorías y un casi",
    faction: "aparato",
    dialogueTreeId: "tree_feijoo",
    flavor: "Sostiene una piedra del Sil entre el pulgar y el índice. No te invita al café.",
    politicianId: "feijoo",
  },
  ayuso: {
    id: "ayuso",
    name: "Isabel Díaz Ayuso",
    role: "Libertad y cañas",
    faction: "aparato",
    dialogueTreeId: "tree_ayuso",
    flavor: "El perro Pecas olfatea tu chaqueta y estornuda. Mal augurio.",
    politicianId: "ayuso",
  },
  yolanda: {
    id: "yolanda",
    name: "Yolanda Díaz",
    role: "Caldo y reforma",
    faction: "calle",
    dialogueTreeId: "tree_yolanda",
    flavor: "Te ofrece caldo gallego. La pulsera roja sigue sin reemplazar.",
    politicianId: "yolanda",
  },
  abascal: {
    id: "abascal",
    name: "Santiago Abascal",
    role: "Caballo, monte, bandera",
    faction: "aparato",
    dialogueTreeId: "tree_abascal",
    flavor: "Lleva al cinto la navaja ibérica. La afila con la uña mientras te mira.",
    politicianId: "abascal",
  },
  iglesias: {
    id: "iglesias",
    name: "Pablo Iglesias",
    role: "Coleta amputada",
    faction: "calle",
    dialogueTreeId: "tree_iglesias",
    flavor: "En la vitrina del fondo, la coleta enmarcada brilla apenas. Hay luna nueva.",
    politicianId: "iglesias",
  },
  rufian: {
    id: "rufian",
    name: "Gabriel Rufián",
    role: "Diputado de plató",
    faction: "calle",
    dialogueTreeId: "tree_rufian",
    flavor: "Tiene tres frases preparadas y un ojo en la cámara del fondo.",
    politicianId: "rufian",
  },
  errejon: {
    id: "errejon",
    name: "Íñigo Errejón",
    role: "Populista de salón",
    faction: "calle",
    dialogueTreeId: "tree_errejon",
    flavor: "Marca el texto con lápiz rojo mientras hablas. No levanta la vista.",
    politicianId: "errejon",
  },

  // ── NPCs nuevos (no en el banco principal) ─────────────────────────
  cura_jubilado: {
    id: "cura_jubilado",
    name: "Don Antón Sigüenza",
    role: "Cura jubilado de San Antón",
    faction: "iglesia",
    dialogueTreeId: "tree_cura",
    flavor: "Lleva sotana raída y rosario de cuentas grandes. Huele a aguarrás.",
  },
  vidente_rastro: {
    id: "vidente_rastro",
    name: "Doña Rosa la Cardiaca",
    role: "Vidente del Rastro",
    faction: "calle",
    dialogueTreeId: "tree_vidente",
    flavor: "Te tiende tres cartas sin baraja. Sonríe con dos dientes de oro.",
  },
  librero_ciego: {
    id: "librero_ciego",
    name: "Don Roque",
    role: "Librero ciego de Moyano",
    faction: "logia",
    dialogueTreeId: "tree_librero",
    flavor: "Te ofrece exacto el libro que pensabas esconder. Cuarenta euros, ni uno menos.",
  },
  comisario: {
    id: "comisario",
    name: "Comisario Vega",
    role: "Jefe de Información, Sol",
    faction: "aparato",
    dialogueTreeId: "tree_comisario",
    flavor: "Te recibe en pantalones de pijama. Son las once. Está despierto desde las cuatro.",
  },
  agregado_cultural: {
    id: "agregado_cultural",
    name: "M. Bauer",
    role: "Agregado cultural alemán",
    faction: "extranjeros",
    dialogueTreeId: "tree_agregado",
    flavor: "Su español es impecable. Te pregunta por tu apellido segundo dos veces.",
  },
  marquesa: {
    id: "marquesa",
    name: "Marquesa de Squilache",
    role: "Heredera de la cripta",
    faction: "corona",
    dialogueTreeId: "tree_marquesa",
    flavor: "Te ofrece de heredar. Solo admite sí o no. La duda la ofende.",
  },
  baron_territorial: {
    id: "baron_territorial",
    name: "Don Esteban Sancho",
    role: "Barón provincial",
    faction: "aparato",
    dialogueTreeId: "tree_baron",
    flavor: "Te exige cerrar lista autonómica antes de las nueve. Tiene tres móviles encendidos.",
  },
};

export function getNpc(id) {
  return NPCS[id] || null;
}

export const NPC_IDS = Object.keys(NPCS);

// Mapping inverso: politicianId → npcId (cuando hay diálogo asociado)
export const POLITICIAN_TO_NPC = Object.values(NPCS)
  .filter((n) => n.politicianId)
  .reduce((acc, n) => { acc[n.politicianId] = n.id; return acc; }, {});
