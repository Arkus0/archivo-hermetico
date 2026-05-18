export const PERK_CATALOG = {
  sangre_fria: { name: "Sangre Fría", type: "mundano", effect: "+1 Sangre fría en escenas de crisis.", cost: "-1 Empatía en eventos sociales." },
  operador_de_pasillos: { name: "Operador de Pasillos", type: "mundano", effect: "+1 Carisma en negociaciones discretas.", cost: "Mayor exposición a traiciones internas." },
  lector_de_sumarios: { name: "Lector de Sumarios", type: "mundano", effect: "+1 Perspicacia al evaluar rumores.", cost: "-1 Voluntad ante obsesiones." },
  medium_de_archivo: { name: "Médium de Archivo", type: "ocultista", effect: "+1 Sensibilidad y acceso a pistas espectrales.", cost: "Riesgo de Paranoia al descansar." },
  juramento_de_sotano: { name: "Juramento de Sótano", type: "ocultista", effect: "+1 Ritualismo en pactos y sellos.", cost: "Deuda de sangre con la logia." },
  cartografo_de_bruno: { name: "Cartógrafo de Bruno", type: "ocultista", effect: "+1 Conocimiento arcano en localizaciones antiguas.", cost: "-1 Recursos por mantenimiento de reliquias." },
};

const ARCHETYPES = {
  investigador: ["lector_de_sumarios", "sangre_fria", "medium_de_archivo"],
  operador: ["operador_de_pasillos", "sangre_fria", "juramento_de_sotano"],
  medium: ["medium_de_archivo", "cartografo_de_bruno", "lector_de_sumarios"],
};

export function buildPerks(stats) {
  let archetype = "investigador";
  if (stats.carisma + stats.recursos > stats.conocimiento_arcano + stats.sensibilidad) archetype = "operador";
  if (stats.sensibilidad + stats.ritualismo >= 15) archetype = "medium";

  const [p1, p2, p3] = ARCHETYPES[archetype];
  return {
    archetype,
    perks: [PERK_CATALOG[p1], PERK_CATALOG[p2]],
    drawback: PERK_CATALOG[p3],
  };
}
