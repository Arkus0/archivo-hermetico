// Reloj de la Logia: doom track 0-12. Cada umbral cruzado dispara un evento global
// con efectos narrativos y mecánicos. Idempotente: cada evento se dispara una sola vez.

import { EFFECT_TYPES } from "./effects.js";

export const DOOM_EVENTS = [
  {
    id: "doom_1",
    threshold: 1,
    title: "Un sobre sin remite",
    text: "Aparece en tu correo interno un sobre marrón con una sola palabra: «recuerda». No hay firma. La Logia toma nota.",
    effects: [
      { type: EFFECT_TYPES.LOG, text: "La Logia ha abierto expediente sombra. Cuidado.", kind: "doom" },
    ],
  },
  {
    id: "doom_2",
    threshold: 2,
    title: "Goteo en la prensa",
    text: "Un cronista parlamentario publica un párrafo ambiguo que solo tú puedes leer entre líneas. No hay mentira; hay aviso.",
    effects: [
      { type: EFFECT_TYPES.REPUTATION_FACTION, faction: "aparato", value: -1 },
    ],
  },
  {
    id: "doom_3",
    threshold: 3,
    title: "Filtración en El País",
    text: "Aparece tu nombre vinculado a una sociedad pantalla. Nadie firma la información, pero las fuentes existen.",
    effects: [
      { type: EFFECT_TYPES.THREAT, value: 1 },
      { type: EFFECT_TYPES.REPUTATION_FACTION, faction: "aparato", value: -1 },
      { type: EFFECT_TYPES.REPUTATION_FACTION, faction: "calle", value: 1 },
    ],
  },
  {
    id: "doom_4",
    threshold: 4,
    title: "Llamada anónima a las 3:33",
    text: "El teléfono fijo suena tres veces y se corta. Al cuarto timbre alguien respira al otro lado. Quien sea, conoce tu nombre de pila.",
    effects: [
      { type: EFFECT_TYPES.STATUS_ADD, status: "Paranoia" },
    ],
  },
  {
    id: "doom_5",
    threshold: 5,
    title: "Las viudas de San Isidro",
    text: "Tres mujeres enlutadas se han visto a la entrada del cementerio. Preguntan por tu fecha de nacimiento.",
    effects: [
      { type: EFFECT_TYPES.DOOM, value: 0 },
      { type: EFFECT_TYPES.LOG, text: "Algo te busca por San Isidro.", kind: "doom" },
    ],
  },
  {
    id: "doom_6",
    threshold: 6,
    title: "Despertar de la Logia",
    text: "El Sumidero del Tedio recibe visita inesperada. El Cronoarchivo se reorganiza solo en mitad de la noche. Tres páginas en blanco aparecen marcadas con tu inicial.",
    effects: [
      { type: EFFECT_TYPES.REPUTATION_FACTION, faction: "logia", value: 1 },
      { type: EFFECT_TYPES.THREAT, value: 1 },
    ],
  },
  {
    id: "doom_7",
    threshold: 7,
    title: "Eclosión de rumores",
    text: "La calle empieza a hablar de ti con un mote nuevo. No es ofensivo todavía, pero la versión que circula no es la oficial.",
    effects: [
      { type: EFFECT_TYPES.REPUTATION_FACTION, faction: "calle", value: -1 },
      { type: EFFECT_TYPES.INFLUENCE, value: -1 },
    ],
  },
  {
    id: "doom_8",
    threshold: 8,
    title: "Crisis de gabinete",
    text: "Alguien de tu confianza desaparece de la agenda durante 72 horas. Cuando vuelve, no recuerda haberse ido.",
    effects: [
      { type: EFFECT_TYPES.STATUS_ADD, status: "Obsesión" },
      { type: EFFECT_TYPES.THREAT, value: 1 },
    ],
  },
  {
    id: "doom_9",
    threshold: 9,
    title: "Acta del Inquisidor",
    text: "Una resolución del Santo Oficio fechada en 1771 reaparece en un legajo perdido del Archivo Histórico. El nombre raspado se asemeja al tuyo.",
    effects: [
      { type: EFFECT_TYPES.REPUTATION_FACTION, faction: "iglesia", value: -1 },
      { type: EFFECT_TYPES.DOOM, value: 1 },
    ],
  },
  {
    id: "doom_10",
    threshold: 10,
    title: "Cita en Zarzuela",
    text: "Te citan en Palacio sin antelación. La invitación no figura en agenda oficial. Recuerda no llevar reloj que dé las horas en voz alta.",
    effects: [
      { type: EFFECT_TYPES.REPUTATION_FACTION, faction: "corona", value: -1 },
    ],
  },
  {
    id: "doom_11",
    threshold: 11,
    title: "Aniversario sin convidados",
    text: "Una fecha del calendario republicano vuelve a tener relieve. El agua del estanque de Debod sube media línea aquella noche.",
    effects: [
      { type: EFFECT_TYPES.THREAT, value: 1 },
      { type: EFFECT_TYPES.STATUS_ADD, status: "Deuda de sangre" },
    ],
  },
  {
    id: "doom_12",
    threshold: 12,
    title: "Caída del expediente",
    text: "La Logia cierra el expediente. Sin nota al margen. Las páginas se quedan en blanco una a una, mientras tú sigues leyendo.",
    effects: [
      { type: EFFECT_TYPES.LOG, text: "La Logia ha cerrado tu expediente. Game over inminente.", kind: "doom-final" },
    ],
  },
];

export function getDoomEventsBetween(prevValue, nextValue, alreadyTriggered = []) {
  const triggered = new Set(alreadyTriggered);
  return DOOM_EVENTS.filter(
    (e) => e.threshold > prevValue && e.threshold <= nextValue && !triggered.has(e.id)
  );
}

export function getDoomEvent(id) {
  return DOOM_EVENTS.find((e) => e.id === id) || null;
}
