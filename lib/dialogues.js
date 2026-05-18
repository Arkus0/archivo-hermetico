// Árboles de diálogo de NPCs. Cada árbol tiene:
//   - npcId, start (nodeId inicial), nodes: { [nodeId]: { text, options:[] } }
// Cada opción puede tener: label, requires, cost, check, onResolve, outcomes,
// next, onSuccess.next, onFail.next, isExit.

import { EFFECT_TYPES } from "./effects.js";

const E = EFFECT_TYPES;

export const DIALOGUE_TREES = {
  // ── Sánchez ───────────────────────────────────────────────────────
  tree_sanchez: {
    npcId: "sanchez",
    start: "open",
    nodes: {
      open: {
        text: "Sánchez no se sienta. Camina descalzo sobre el mármol y repite resistir en cadencia binaria. Te mira sin detenerse: «Habla. Tengo cuarenta segundos antes de que vuelvan los amanuenses».",
        options: [
          { label: "Pedirle que pacte una amnistía simbólica", check: { stat: "carisma", difficulty: 10 },
            outcomes: {
              critical: { text: "Sánchez asiente sin parar de caminar. Dice: «hecho» y desaparece.", effects: [{ type: E.INFLUENCE, value: 4 }, { type: E.REPUTATION_POL, id: "sanchez", value: 1 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 1 }] },
              success:  { text: "Asiente sin entusiasmo. Algo cambiará.", effects: [{ type: E.INFLUENCE, value: 2 }, { type: E.REPUTATION_POL, id: "sanchez", value: 1 }] },
              fail:     { text: "Para. Te mira un segundo. Sigue caminando.", effects: [{ type: E.THREAT, value: 1 }] },
              fumble:   { text: "Te recita el Manual entero hasta que tú mismo te marchas.", effects: [{ type: E.STATUS_ADD, status: "Obsesión" }, { type: E.THREAT, value: 1 }] },
            },
          },
          { label: "Filtrarle un nombre", check: { stat: "perspicacia", difficulty: 9 },
            outcomes: {
              critical: { text: "El nombre desaparece de la agenda al día siguiente.", effects: [{ type: E.INFLUENCE, value: 3 }, { type: E.DOOM, value: 1 }] },
              success:  { text: "Toma nota mental. No promete.", effects: [{ type: E.INFLUENCE, value: 1 }] },
              fail:     { text: "Te corta: «otro día».", effects: [] },
              fumble:   { text: "Convoca a los amanuenses. Sales escoltado.", effects: [{ type: E.REPUTATION_FACTION, faction: "aparato", value: -1 }] },
            },
          },
          { label: "Despedirte con frase ambigua", onResolve: [{ type: E.REPUTATION_POL, id: "sanchez", value: 0 }], onResolveText: "Te despides. Él ya no estaba escuchando." },
        ],
      },
    },
  },

  // ── Feijóo ────────────────────────────────────────────────────────
  tree_feijoo: {
    npcId: "feijoo",
    start: "open",
    nodes: {
      open: {
        text: "Feijóo te recibe en una sala con olor a tabaco frío. Hace girar la piedra entre los dedos: «aguantar». No te ofrece nada.",
        options: [
          { label: "Proponer alianza táctica en Galicia", check: { stat: "carisma", difficulty: 9, modifiers: [{ value: 1, label: "Gallego" }] },
            outcomes: {
              critical: { text: "Sonríe sin enseñar los dientes. Te tiende la piedra.", effects: [{ type: E.INFLUENCE, value: 3 }, { type: E.REPUTATION_POL, id: "feijoo", value: 2 }] },
              success:  { text: "«Lo pensaré». No suena a no.", effects: [{ type: E.REPUTATION_POL, id: "feijoo", value: 1 }] },
              fail:     { text: "«Otra vez será». Lo dice tres veces.", effects: [] },
              fumble:   { text: "Te mira con la decepción de un padre rural.", effects: [{ type: E.REPUTATION_POL, id: "feijoo", value: -1 }] },
            },
          },
          { label: "Preguntarle por el primo segundo de 1981", check: { stat: "perspicacia", difficulty: 11 },
            outcomes: {
              critical: { text: "Se levanta. Va al armario. Saca un sobre. No te lo da, pero te enseña la primera línea.", effects: [{ type: E.CLUE, questId: "canovas_servilleta", clue: "feijoo_recuerdo" }, { type: E.STATUS_ADD, status: "Obsesión" }] },
              success:  { text: "«Eso no toca».", effects: [{ type: E.REPUTATION_POL, id: "feijoo", value: -1 }] },
              fail:     { text: "Suelta la piedra. Cae a la moqueta sin ruido. Sales.", effects: [{ type: E.THREAT, value: 1 }] },
              fumble:   { text: "La piedra se le descascarilla en la mano. Mal augurio.", effects: [{ type: E.DOOM, value: 1 }] },
            },
          },
          { label: "Marcharte sin pedir nada", onResolve: [], onResolveText: "Sale de la sala antes que tú." },
        ],
      },
    },
  },

  // ── Ayuso ─────────────────────────────────────────────────────────
  tree_ayuso: {
    npcId: "ayuso",
    start: "open",
    nodes: {
      open: {
        text: "Te recibe con un escapulario en celofán. Pecas ronda tus zapatos. «¿Cañas o cruz? Elige bien».",
        options: [
          { label: "Pedirle estado en la radio de Madrid", check: { stat: "carisma", difficulty: 9 },
            outcomes: {
              critical: { text: "Le pasa al jefe de gabinete tu nombre por escrito.", effects: [{ type: E.INFLUENCE, value: 3 }, { type: E.REPUTATION_POL, id: "ayuso", value: 1 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 1 }] },
              success:  { text: "«Veré qué se puede hacer». No mira a Pecas.", effects: [{ type: E.INFLUENCE, value: 1 }] },
              fail:     { text: "Pecas estornuda. La conversación se acaba.", effects: [{ type: E.REPUTATION_POL, id: "ayuso", value: -1 }] },
              fumble:   { text: "Te invita a una caña en Chamberí. No es una invitación.", effects: [{ type: E.STATUS_ADD, status: "Obsesión" }] },
            },
          },
          { label: "Preguntar por la chimenea verde de Nochebuena", check: { stat: "sensibilidad", difficulty: 10 },
            outcomes: {
              critical: { text: "Ríe. «¿Aún hablan de eso?». Te da un nombre: Reina Victoria.", effects: [{ type: E.CLUE, questId: "tres_losas", clue: "humo_verde" }] },
              success:  { text: "Pecas gruñe. Ella cambia de tema.", effects: [{ type: E.REPUTATION_POL, id: "ayuso", value: -1 }] },
              fail:     { text: "Te mira como si fueras de Murcia.", effects: [] },
              fumble:   { text: "Llama al jefe de gabinete. No vuelves a entrar en Correos.", effects: [{ type: E.REPUTATION_FACTION, faction: "aparato", value: -1 }, { type: E.THREAT, value: 1 }] },
            },
          },
          { label: "Despedirte con una caña pendiente", onResolve: [{ type: E.REPUTATION_POL, id: "ayuso", value: 0 }], onResolveText: "Pecas te mira sin estornudar. Buen augurio." },
        ],
      },
    },
  },

  // ── Yolanda Díaz ──────────────────────────────────────────────────
  tree_yolanda: {
    npcId: "yolanda",
    start: "open",
    nodes: {
      open: {
        text: "Yolanda te ofrece caldo. Tres viejas militantes mojan ortigas en la cazuela y susurran «come, come».",
        options: [
          { label: "Aceptar el caldo y hablar de reforma laboral", onResolve: [{ type: E.INFLUENCE, value: 2 }, { type: E.REPUTATION_POL, id: "yolanda", value: 1 }, { type: E.REPUTATION_FACTION, faction: "calle", value: 1 }, { type: E.STATUS_ADD, status: "Bendición residual" }], onResolveText: "El caldo está caliente. Las ortigas pican. La hora pasa bien." },
          { label: "Pedirle apoyo en el Congreso", check: { stat: "carisma", difficulty: 9 },
            outcomes: {
              critical: { text: "Asiente y llama a la portavoz delante de ti.", effects: [{ type: E.INFLUENCE, value: 3 }, { type: E.REPUTATION_POL, id: "yolanda", value: 2 }] },
              success:  { text: "«Veremos». Es un sí gallego.", effects: [{ type: E.INFLUENCE, value: 1 }, { type: E.REPUTATION_POL, id: "yolanda", value: 1 }] },
              fail:     { text: "«Otra vez será».", effects: [] },
              fumble:   { text: "Las viejas dejan de mojar ortigas. Algo se rompe.", effects: [{ type: E.REPUTATION_FACTION, faction: "calle", value: -1 }] },
            },
          },
          { label: "Marcharte sin probarlo", onResolve: [{ type: E.REPUTATION_POL, id: "yolanda", value: -1 }, { type: E.REPUTATION_FACTION, faction: "calle", value: -1 }], onResolveText: "Las viejas dejan de mover la cuchara." },
        ],
      },
    },
  },

  // ── Abascal ───────────────────────────────────────────────────────
  tree_abascal: {
    npcId: "abascal",
    start: "open",
    nodes: {
      open: {
        text: "Abascal pasa la uña por el filo de la navaja. «No son gente», recita en voz baja, conjuro de circuito cerrado.",
        options: [
          { label: "Pedir su silencio en una votación clave", check: { stat: "sangre_fria", difficulty: 10 },
            outcomes: {
              critical: { text: "Cierra la navaja. Asiente.", effects: [{ type: E.INFLUENCE, value: 3 }, { type: E.REPUTATION_POL, id: "abascal", value: 1 }, { type: E.DOOM, value: 1 }] },
              success:  { text: "No habla durante todo el debate. Te mira al salir.", effects: [{ type: E.INFLUENCE, value: 1 }] },
              fail:     { text: "Sale a la tribuna y grita tres veces tu apellido.", effects: [{ type: E.THREAT, value: 1 }] },
              fumble:   { text: "Sube al Pico de la Atalaya. Algo te sigue al volver.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }, { type: E.DOOM, value: 2 }] },
            },
          },
          { label: "Preguntar por la vitrina de las tres reliquias", check: { stat: "perspicacia", difficulty: 11 },
            outcomes: {
              critical: { text: "Te abre la vitrina. Las tres llaves giran solas.", effects: [{ type: E.CLUE, questId: "pacto_carrero", clue: "tres_llaves" }, { type: E.STATUS_ADD, status: "Deuda de sangre" }] },
              success:  { text: "«No es asunto tuyo». Cierra la puerta del sótano.", effects: [] },
              fail:     { text: "La pezuña disecada cae al suelo. No la recoge.", effects: [{ type: E.DOOM, value: 1 }] },
              fumble:   { text: "Te invita a un descenso del Pico. Aceptas sin querer.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }] },
            },
          },
          { label: "Despedirte sin estrechar mano", onResolve: [{ type: E.REPUTATION_POL, id: "abascal", value: -1 }], onResolveText: "No la habrías estrechado de todas formas." },
        ],
      },
    },
  },

  // ── Iglesias ──────────────────────────────────────────────────────
  tree_iglesias: {
    npcId: "iglesias",
    start: "open",
    nodes: {
      open: {
        text: "Iglesias te recibe en la librería de Vallecas. La vela votiva de su propio rostro arde sola en la trastienda.",
        options: [
          { label: "Pedirle apoyo mediático en La Tuerka", check: { stat: "carisma", difficulty: 9 },
            outcomes: {
              critical: { text: "Te dedica un programa entero.", effects: [{ type: E.INFLUENCE, value: 3 }, { type: E.REPUTATION_FACTION, faction: "calle", value: 1 }] },
              success:  { text: "Te menciona en intro.", effects: [{ type: E.INFLUENCE, value: 1 }] },
              fail:     { text: "Cambia de tema a los lunares de la nuca.", effects: [] },
              fumble:   { text: "Te enseña la coleta. La luna está nueva. Brilla.", effects: [{ type: E.STATUS_ADD, status: "Obsesión" }] },
            },
          },
          { label: "Preguntar por el bautismo del Manzanares", check: { stat: "conocimiento_arcano", difficulty: 11 },
            outcomes: {
              critical: { text: "Te da el nombre de un profesor titular. Hoy enseña en Salamanca.", effects: [{ type: E.CLUE, questId: "reloj_observatorio", clue: "profesor_titular" }] },
              success:  { text: "«Eso no toca aquí».", effects: [] },
              fail:     { text: "La vela se apaga sola.", effects: [{ type: E.DOOM, value: 1 }] },
              fumble:   { text: "Te invita a beber del Manzanares actual. No bebes. Demasiado tarde.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }] },
            },
          },
          { label: "Comprarle el Anti-Dühring dedicado", onResolve: [{ type: E.REPUTATION_POL, id: "iglesias", value: 1 }, { type: E.REPUTATION_FACTION, faction: "calle", value: 1 }], onResolveText: "Te dedica el libro: «A quien resista lo que viene»." },
        ],
      },
    },
  },

  // ── Rufián ────────────────────────────────────────────────────────
  tree_rufian: {
    npcId: "rufian",
    start: "open",
    nodes: {
      open: {
        text: "Rufián te ofrece dos minutos. Hay cámara al fondo. La frase preparada es: «¿venimos a sumar o a restar?».",
        options: [
          { label: "Improvisar plató con él", check: { stat: "carisma", difficulty: 10 },
            outcomes: {
              critical: { text: "Te corta y te da pie a la mejor frase del año.", effects: [{ type: E.INFLUENCE, value: 3 }, { type: E.REPUTATION_FACTION, faction: "calle", value: 1 }] },
              success:  { text: "Sales en el corte de televisión.", effects: [{ type: E.INFLUENCE, value: 1 }] },
              fail:     { text: "Pisa la cámara. La cámara dice tu nombre.", effects: [{ type: E.THREAT, value: 1 }] },
              fumble:   { text: "Te llama por tu apellido segundo. Lo pillas de pasada.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }] },
            },
          },
          { label: "Despedirte con frase preparada", onResolve: [], onResolveText: "No se la queda. Ya está pensando la siguiente." },
        ],
      },
    },
  },

  // ── Errejón ───────────────────────────────────────────────────────
  tree_errejon: {
    npcId: "errejon",
    start: "open",
    nodes: {
      open: {
        text: "Errejón marca tu texto con lápiz rojo. Tacha tres palabras. Subraya una.",
        options: [
          { label: "Pedirle un párrafo para el manifiesto", check: { stat: "perspicacia", difficulty: 9 },
            outcomes: {
              critical: { text: "Te entrega un párrafo en latín y en castellano. Funciona en los dos.", effects: [{ type: E.INFLUENCE, value: 3 }, { type: E.REPUTATION_FACTION, faction: "calle", value: 1 }] },
              success:  { text: "Te tacha tres líneas. Las que quedan son mejores.", effects: [{ type: E.INFLUENCE, value: 1 }] },
              fail:     { text: "Te enseña su columna semanal. No te mencionará.", effects: [] },
              fumble:   { text: "Te dedica un poema. No puedes leerlo en público.", effects: [{ type: E.STATUS_ADD, status: "Obsesión" }] },
            },
          },
          { label: "Preguntar por el populismo de salón", onResolve: [{ type: E.REPUTATION_POL, id: "errejon", value: -1 }], onResolveText: "Te mira por encima de las gafas. No contesta." },
          { label: "Marcharte", onResolve: [], onResolveText: "Sigue marcando tu texto cuando ya te has ido." },
        ],
      },
    },
  },

  // ── Cura jubilado ─────────────────────────────────────────────────
  tree_cura: {
    npcId: "cura_jubilado",
    start: "open",
    nodes: {
      open: {
        text: "Don Antón te absuelve sin que pidas. «De los pecados que no recuerdas y los que aún no has cometido».",
        options: [
          { label: "Confesar a fondo (ritual)", check: { stat: "voluntad", difficulty: 9 },
            outcomes: {
              critical: { text: "Lloras. Te quita tres años de Paranoia.", effects: [{ type: E.STATUS_REMOVE, status: "Paranoia" }, { type: E.STATUS_ADD, status: "Bendición residual" }, { type: E.REPUTATION_FACTION, faction: "iglesia", value: 1 }] },
              success:  { text: "Te da una penitencia que cumples sin querer.", effects: [{ type: E.STATUS_ADD, status: "Protección" }] },
              fail:     { text: "Te queda algo dentro. Algo que mira.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }] },
              fumble:   { text: "Te confiesa él a ti. Lo que oyes pesa.", effects: [{ type: E.STATUS_ADD, status: "Obsesión" }, { type: E.DOOM, value: 1 }] },
            },
          },
          { label: "Preguntar por la vela que se apaga sola", check: { stat: "sensibilidad", difficulty: 10 },
            outcomes: {
              critical: { text: "Te dice qué hora y por qué.", effects: [{ type: E.CLUE, questId: "reloj_observatorio", clue: "vela_apagada" }] },
              success:  { text: "«Pregúntele a su madre».", effects: [] },
              fail:     { text: "La vela del altar se apaga ahora.", effects: [{ type: E.DOOM, value: 1 }] },
              fumble:   { text: "Te bendice con aceite caducado.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }] },
            },
          },
          { label: "Marcharte con la bendición", onResolve: [{ type: E.REPUTATION_FACTION, faction: "iglesia", value: 1 }], onResolveText: "Te santigua sin mirarte." },
        ],
      },
    },
  },

  // ── Vidente del Rastro ────────────────────────────────────────────
  tree_vidente: {
    npcId: "vidente_rastro",
    start: "open",
    nodes: {
      open: {
        text: "Doña Rosa te tiende tres cartas sin baraja. Una arde sola.",
        options: [
          { label: "Pagarle veinte euros por la lectura", cost: { ap: 0 }, onResolve: [{ type: E.INFLUENCE, value: -1 }, { type: E.CLUE, questId: "tres_losas", clue: "lectura_rastro" }, { type: E.REPUTATION_FACTION, faction: "calle", value: 1 }], onResolveText: "La carta que arde es el Loco. Anota: «Plaza de la Villa, de noche»." },
          { label: "Negarte y exigir respuesta gratis", check: { stat: "voluntad", difficulty: 10 },
            outcomes: {
              critical: { text: "Te lo dice y te abraza. Notas algo entrar.", effects: [{ type: E.CLUE, questId: "tres_losas", clue: "lectura_rastro" }, { type: E.STATUS_ADD, status: "Deuda de sangre" }] },
              success:  { text: "Te insulta y te da media respuesta.", effects: [{ type: E.INFLUENCE, value: 1 }] },
              fail:     { text: "Escupe al suelo. Tres veces.", effects: [{ type: E.REPUTATION_FACTION, faction: "calle", value: -1 }] },
              fumble:   { text: "Te maldice con los apellidos del exilio.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }, { type: E.DOOM, value: 1 }] },
            },
          },
          { label: "Marcharte sin tocar las cartas", onResolve: [], onResolveText: "Las cartas se barajan solas a tu espalda." },
        ],
      },
    },
  },

  // ── Librero ciego ─────────────────────────────────────────────────
  tree_librero: {
    npcId: "librero_ciego",
    start: "open",
    nodes: {
      open: {
        text: "Don Roque te tiende el libro exacto. «Cuarenta euros. No regateo».",
        options: [
          { label: "Comprar el libro", cost: { ap: 0 }, onResolve: [{ type: E.CLUE, questId: "tres_losas", clue: "libro_oculto" }, { type: E.REPUTATION_FACTION, faction: "logia", value: 1 }, { type: E.STATUS_ADD, status: "Obsesión" }], onResolveText: "El libro pesa más de lo que debería." },
          { label: "Preguntar por Azaña y su Spinoza", check: { stat: "conocimiento_arcano", difficulty: 9 },
            outcomes: {
              critical: { text: "Te susurra al oído tres líneas en holandés.", effects: [{ type: E.CLUE, questId: "canovas_servilleta", clue: "spinoza_azana" }, { type: E.REPUTATION_FACTION, faction: "logia", value: 1 }] },
              success:  { text: "«Lo cruzó los Pirineos con él. La factura sigue impaga».", effects: [{ type: E.INFLUENCE, value: 1 }] },
              fail:     { text: "Se ríe. Es la risa de quien sabe más.", effects: [] },
              fumble:   { text: "Te entrega un libro en blanco. Lo aceptas.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }] },
            },
          },
          { label: "Marcharte sin comprar", onResolve: [{ type: E.REPUTATION_FACTION, faction: "logia", value: -1 }], onResolveText: "«No vuelva», dice sin levantar la vista." },
        ],
      },
    },
  },

  // ── Comisario ─────────────────────────────────────────────────────
  tree_comisario: {
    npcId: "comisario",
    start: "open",
    nodes: {
      open: {
        text: "El comisario Vega te recibe en pijama. Sirve café que no bebe.",
        options: [
          { label: "Pedirle información sobre un rival", check: { stat: "carisma", difficulty: 10 },
            outcomes: {
              critical: { text: "Abre un cajón. Te entrega un informe sin tapa.", effects: [{ type: E.INFLUENCE, value: 3 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 1 }, { type: E.DOOM, value: 1 }] },
              success:  { text: "Te da un nombre y una hora.", effects: [{ type: E.INFLUENCE, value: 1 }] },
              fail:     { text: "Cambia de tema al fútbol.", effects: [] },
              fumble:   { text: "Apunta el tuyo. No te lo lee.", effects: [{ type: E.THREAT, value: 1 }, { type: E.STATUS_ADD, status: "Paranoia" }] },
            },
          },
          { label: "Ofrecerle ascenso a cambio de silencio", check: { stat: "recursos", difficulty: 9 },
            outcomes: {
              critical: { text: "Acepta. No vuelves a saber de él hasta enero.", effects: [{ type: E.INFLUENCE, value: 2 }, { type: E.DOOM, value: 1 }] },
              success:  { text: "Lo piensa.", effects: [{ type: E.INFLUENCE, value: 1 }] },
              fail:     { text: "Te recuerda que es funcionario.", effects: [] },
              fumble:   { text: "Te dice cuánto cuesta su silencio. No traes tanto.", effects: [{ type: E.REPUTATION_FACTION, faction: "aparato", value: -1 }, { type: E.THREAT, value: 1 }] },
            },
          },
          { label: "Marcharte sin pedirle nada", onResolve: [{ type: E.REPUTATION_FACTION, faction: "aparato", value: 0 }], onResolveText: "Te sigue con la mirada hasta el ascensor." },
        ],
      },
    },
  },

  // ── Agregado cultural ─────────────────────────────────────────────
  tree_agregado: {
    npcId: "agregado_cultural",
    start: "open",
    nodes: {
      open: {
        text: "Bauer te pregunta dos veces por tu apellido segundo. Lo apunta en una libreta de tapas verdes.",
        options: [
          { label: "Aceptar la invitación a Berlín", cost: { ap: 0 }, onResolve: [{ type: E.REPUTATION_FACTION, faction: "extranjeros", value: 2 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: -1 }, { type: E.INFLUENCE, value: 2 }], onResolveText: "Te da fecha exacta. No incluye el regreso." },
          { label: "Decirle que no en alemán", check: { stat: "conocimiento_arcano", difficulty: 11 },
            outcomes: {
              critical: { text: "Te respeta. Te dará información útil.", effects: [{ type: E.CLUE, questId: "reloj_observatorio", clue: "berlin_efemerides" }, { type: E.REPUTATION_FACTION, faction: "extranjeros", value: 1 }] },
              success:  { text: "Te corrige el acento. Sale bien.", effects: [{ type: E.REPUTATION_FACTION, faction: "extranjeros", value: 1 }] },
              fail:     { text: "Te corrige el acento. No sale bien.", effects: [{ type: E.REPUTATION_FACTION, faction: "extranjeros", value: -1 }] },
              fumble:   { text: "Te corrige el apellido segundo.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }] },
            },
          },
          { label: "Despedirte sin firmar nada", onResolve: [], onResolveText: "Cierra la libreta. Te pide que vuelvas el martes." },
        ],
      },
    },
  },

  // ── Marquesa ──────────────────────────────────────────────────────
  tree_marquesa: {
    npcId: "marquesa",
    start: "open",
    nodes: {
      open: {
        text: "La Marquesa de Squilache te tiende un abanico cerrado. «¿Heredas o no? Sí, no. La duda me ofende».",
        options: [
          { label: "Decir SÍ con voz firme", check: { stat: "voluntad", difficulty: 10 },
            outcomes: {
              critical: { text: "Te entrega la llave de capilla privada.", effects: [{ type: E.REPUTATION_FACTION, faction: "corona", value: 2 }, { type: E.CLUE, questId: "tres_losas", clue: "llave_capilla" }, { type: E.STATUS_ADD, status: "Deuda de sangre" }] },
              success:  { text: "Asiente y se marcha.", effects: [{ type: E.REPUTATION_FACTION, faction: "corona", value: 1 }, { type: E.STATUS_ADD, status: "Deuda de sangre" }] },
              fail:     { text: "Cierra el abanico de golpe.", effects: [{ type: E.STATUS_ADD, status: "Obsesión" }] },
              fumble:   { text: "Te dice de qué heredas. No te gusta.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }, { type: E.DOOM, value: 1 }] },
            },
          },
          { label: "Decir NO sin dudar", onResolve: [{ type: E.REPUTATION_FACTION, faction: "corona", value: -1 }, { type: E.STATUS_ADD, status: "Protección" }], onResolveText: "Te respeta. Te lo dirá a sus iguales." },
          { label: "Dudar (peor opción)", onResolve: [{ type: E.REPUTATION_FACTION, faction: "corona", value: -2 }, { type: E.STATUS_ADD, status: "Paranoia" }, { type: E.DOOM, value: 1 }], onResolveText: "Te abandona con la palabra en la boca." },
        ],
      },
    },
  },

  // ── Barón territorial ─────────────────────────────────────────────
  tree_baron: {
    npcId: "baron_territorial",
    start: "open",
    nodes: {
      open: {
        text: "Don Esteban tiene tres móviles encendidos. Te exige cerrar lista autonómica antes de las nueve.",
        options: [
          { label: "Alinearle el aparato", check: { stat: "carisma", difficulty: 9 },
            outcomes: {
              critical: { text: "Sales con todo amarrado. Te debe una.", effects: [{ type: E.INFLUENCE, value: 3 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 1 }, { type: E.REPUTATION_POL, id: "feijoo", value: 1 }] },
              success:  { text: "Acepta a cambio de un nombre.", effects: [{ type: E.INFLUENCE, value: 1 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 1 }] },
              fail:     { text: "Filtración interna. Titulares hostiles.", effects: [{ type: E.THREAT, value: 1 }] },
              fumble:   { text: "Cuelga los tres móviles. Te cuelga a ti.", effects: [{ type: E.REPUTATION_FACTION, faction: "aparato", value: -2 }] },
            },
          },
          { label: "Plantarle cara", check: { stat: "sangre_fria", difficulty: 10 },
            outcomes: {
              critical: { text: "Encajas. Se calla. Anota tu nombre con respeto.", effects: [{ type: E.INFLUENCE, value: 2 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 1 }] },
              success:  { text: "Te respeta a regañadientes.", effects: [{ type: E.REPUTATION_FACTION, faction: "aparato", value: 1 }] },
              fail:     { text: "Te mete en una comisión que te entierra.", effects: [{ type: E.INFLUENCE, value: -1 }, { type: E.THREAT, value: 1 }] },
              fumble:   { text: "Te bloquea el acta hasta nuevo aviso.", effects: [{ type: E.INFLUENCE, value: -2 }] },
            },
          },
          { label: "Despedirte cordial", onResolve: [], onResolveText: "Te llama mañana. Será peor." },
        ],
      },
    },
  },
};

export function getDialogueNode(treeId, nodeId) {
  const tree = DIALOGUE_TREES[treeId];
  if (!tree) return null;
  return tree.nodes?.[nodeId] || null;
}

export function getDialogueTree(treeId) {
  return DIALOGUE_TREES[treeId] || null;
}
