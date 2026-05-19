// Catálogo grande de escenas ramificadas. Cada localización tiene 2-3 escenas
// (día/noche/cualquiera) más algunas globales atadas a quests.
//
// Estructura de cada Encounter:
//   id, locationId|null, daynight: "any"|"day"|"night", weight,
//   requires?: { minDoom, statusNot, questFlag, questCompleted, repFactionMin },
//   oneShot: bool,                  // si true, no se vuelve a disparar
//   title, intro,
//   options: [
//     { id, label,
//       cost?: { ap },
//       check?: { stat, difficulty, modifiers? },
//       outcomes?: { critical, success, fail, fumble } each: { text, effects:[] },
//       onResolve?: [effects],      // si no hay check
//       onResolveText?: string,
//       next?: nodeId | null,
//       closesScene?: bool,         // default true
//     }, ...
//   ]
//
// Convención de pickEncounter: filtra por locationId, daynight compatible (any|igual),
// requires.minDoom <= state.doom.value, statusNot intersect = vacío,
// questFlag/questCompleted satisfechos, oneShot no en encountersSeen. Pondera por weight.

import { EFFECT_TYPES } from "./effects.js";
const E = EFFECT_TYPES;

// Helper: build a quick fallback "asegurar enclave" scene per location type.
function genericFallback(locationId, type) {
  return {
    id: `${locationId}_fallback`,
    locationId, daynight: "any", weight: 0.5, oneShot: false,
    title: "Una hora sin nada",
    intro: "La hora transcurre sin acontecimientos significativos. El enclave respira.",
    options: [
      { id: "obs", label: "Observar y tomar notas", onResolve: [{ type: E.INFLUENCE, value: 1 }], onResolveText: "Anotas lo justo. Suficiente." },
      { id: "ret", label: "Retirarte", onResolve: [], onResolveText: "Te marchas sin que nadie repare." },
    ],
  };
}

export const ENCOUNTERS = [
  // ── DEBOD (templo) ────────────────────────────────────────────────
  {
    id: "debod_sacerdote", locationId: "debod", daynight: "day", weight: 1, oneShot: true,
    title: "El sacerdote de Amón",
    intro: "Un sacerdote mendiga monedas de cinco pesetas. No admite las acuñadas después de 1972.",
    options: [
      { id: "pagar", label: "Darle cinco pesetas anteriores al 72", onResolve: [{ type: E.INFLUENCE, value: 1 }, { type: E.DOOM, value: 1 }, { type: E.REPUTATION_FACTION, faction: "logia", value: 1 }, { type: E.CLUE, questId: "tres_losas", clue: "moneda_anomala" }], onResolveText: "Acepta sin contar. Anota tu nombre en el aire." },
      { id: "perspicacia", label: "Mirarle a los ojos", check: { stat: "perspicacia", difficulty: 9 },
        outcomes: {
          critical: { text: "Lees la verdad: no es un mendigo.", effects: [{ type: E.OPEN_SCENE, sceneId: "debod_oraculo" }] },
          success:  { text: "Aparta la mirada, incómodo.", effects: [{ type: E.INFLUENCE, value: 2 }] },
          fail:     { text: "Te suelta un anatema breve.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }] },
          fumble:   { text: "El estanque sube media línea.", effects: [{ type: E.DOOM, value: 2 }, { type: E.THREAT, value: 1 }] },
        },
      },
      { id: "ignorar", label: "Ignorarle", onResolve: [{ type: E.REPUTATION_FACTION, faction: "logia", value: -1 }], onResolveText: "Te sigue con la mirada hasta tres pasos más allá." },
    ],
  },
  {
    id: "debod_oraculo", locationId: "debod", daynight: "any", weight: 0, oneShot: true,
    title: "El oráculo bajo el estanque",
    intro: "El sacerdote no era. Bajo el estanque hay un sumidero que no figura en ningún plano. Te invita a descender.",
    options: [
      { id: "bajar", label: "Bajar al sumidero", check: { stat: "conocimiento_arcano", difficulty: 11 },
        outcomes: {
          critical: { text: "Lo que ves cambia un voto en el Senado dentro de tres días.", effects: [{ type: E.INFLUENCE, value: 4 }, { type: E.CLUE, questId: "reloj_observatorio", clue: "sumidero_debod" }, { type: E.DOOM, value: 1 }] },
          success:  { text: "Anotas tres iniciales. Una es la tuya.", effects: [{ type: E.INFLUENCE, value: 2 }, { type: E.STATUS_ADD, status: "Obsesión" }] },
          fail:     { text: "Algo te roza. No miras.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }, { type: E.DOOM, value: 1 }] },
          fumble:   { text: "Subes con una moneda en el bolsillo. No la pusiste tú.", effects: [{ type: E.DOOM, value: 2 }, { type: E.STATUS_ADD, status: "Deuda de sangre" }] },
        },
      },
      { id: "no", label: "Negarte y subir al cerro", onResolve: [{ type: E.STATUS_ADD, status: "Protección" }], onResolveText: "Subes al cerro. El aire es de un Madrid distinto." },
    ],
  },
  {
    id: "debod_aniversario", locationId: "debod", daynight: "night", weight: 1.2, oneShot: false,
    title: "Aniversario del 19 de julio",
    intro: "Es noche cerrada. El agua del estanque sube media línea cada hora, regular. Tres figuras enlutadas rodean la piedra egipcia.",
    options: [
      { id: "rezar", label: "Rezar con ellas", check: { stat: "ritualismo", difficulty: 10 },
        outcomes: {
          critical: { text: "Una de ellas te pasa una llave. Sin nombre.", effects: [{ type: E.CLUE, questId: "tres_losas", clue: "llave_sin_nombre" }, { type: E.REPUTATION_FACTION, faction: "logia", value: 1 }] },
          success:  { text: "Te dejan rezar. Algo se asienta.", effects: [{ type: E.STATUS_ADD, status: "Bendición residual" }] },
          fail:     { text: "Se vuelven a la vez. No tienen cara.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }, { type: E.DOOM, value: 1 }] },
          fumble:   { text: "Te confunden con el cuartel arrasado.", effects: [{ type: E.THREAT, value: 1 }, { type: E.DOOM, value: 2 }] },
        },
      },
      { id: "marchar", label: "Bajar la colina deprisa", onResolve: [{ type: E.DOOM, value: 1 }], onResolveText: "El agua del estanque sigue subiendo a tu espalda." },
    ],
  },

  // ── LINARES (palacio) ─────────────────────────────────────────────
  {
    id: "linares_nina", locationId: "linares", daynight: "any", weight: 1, oneShot: true,
    title: "La niña del cucú-tras",
    intro: "Una niña con vestido decimonónico te invita a jugar al cucú-tras. Aceptar cuesta una hora de tu vida, dice.",
    options: [
      { id: "jugar", label: "Aceptar y jugar", onResolve: [{ type: E.AP, value: -1 }, { type: E.INFLUENCE, value: 2 }, { type: E.CLUE, questId: "tres_losas", clue: "voz_raimundita" }, { type: E.REPUTATION_FACTION, faction: "corona", value: 1 }], onResolveText: "La hora pasa rápido. Algo cambió en el aire." },
      { id: "preguntar", label: "Preguntarle por sus padres", check: { stat: "sensibilidad", difficulty: 9 },
        outcomes: {
          critical: { text: "Te da el nombre de un cura del XIX.", effects: [{ type: E.CLUE, questId: "tres_losas", clue: "cura_xix" }, { type: E.INFLUENCE, value: 2 }] },
          success:  { text: "Llora. La cinta magnetofónica del archivo sirve mejor.", effects: [{ type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "Te enseña la lengua. Es marrón.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }] },
          fumble:   { text: "Te coge la mano. No te suelta hasta que sales corriendo.", effects: [{ type: E.STATUS_ADD, status: "Obsesión" }, { type: E.DOOM, value: 1 }] },
        },
      },
      { id: "huir", label: "Marcharte sin contestarle", onResolve: [], onResolveText: "Te grita «mamá, mamá» hasta que cierras la puerta." },
    ],
  },
  {
    id: "linares_recepcion", locationId: "linares", daynight: "day", weight: 1, oneShot: false,
    title: "Recepción de Casa de América",
    intro: "Coctel con tres embajadores. El marqués pintado en óleo te mira fijamente desde el rellano.",
    options: [
      { id: "embajador", label: "Cortejar a un embajador", check: { stat: "carisma", difficulty: 9 },
        outcomes: {
          critical: { text: "Te ofrece visa diplomática. Sin destinatario.", effects: [{ type: E.INFLUENCE, value: 3 }, { type: E.REPUTATION_FACTION, faction: "extranjeros", value: 1 }] },
          success:  { text: "Brindáis. Te apunta el nombre.", effects: [{ type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "Se va con otra copa.", effects: [] },
          fumble:   { text: "Cuela tu apellido en una conversación equivocada.", effects: [{ type: E.THREAT, value: 1 }] },
        },
      },
      { id: "oleo", label: "Estudiar el óleo del marqués", check: { stat: "perspicacia", difficulty: 11 },
        outcomes: {
          critical: { text: "Hay una firma escondida en el reverso del marco.", effects: [{ type: E.CLUE, questId: "tres_losas", clue: "firma_oleo" }] },
          success:  { text: "Coincides la mirada del marqués con la del registro.", effects: [{ type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "El óleo te devuelve la mirada antes que tú.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }] },
          fumble:   { text: "Se desprende del marco una astilla. La guardas.", effects: [{ type: E.STATUS_ADD, status: "Obsesión" }] },
        },
      },
      { id: "retirarse", label: "Marcharte temprano", onResolve: [], onResolveText: "Sales a la calle Alcalá. Manzanas brillan." },
    ],
  },

  // ── SIETE CHIMENEAS ───────────────────────────────────────────────
  {
    id: "siete_elena", locationId: "siete-chimeneas", daynight: "night", weight: 1, oneShot: true,
    title: "Elena cuenta las chimeneas",
    intro: "Una mujer en camisón blanco te pide que cuentes las chimeneas. Son siete. Si las cuentas dos veces, son ocho.",
    options: [
      { id: "una", label: "Contarlas una sola vez", onResolve: [{ type: E.INFLUENCE, value: 2 }, { type: E.STATUS_ADD, status: "Protección" }], onResolveText: "Siete. Te marchas antes de la octava." },
      { id: "dos", label: "Contarlas dos veces", onResolve: [{ type: E.DOOM, value: 2 }, { type: E.CLUE, questId: "tres_losas", clue: "ocho_chimeneas" }], onResolveText: "La octava no estaba antes. Está ahora." },
      { id: "preguntar", label: "Preguntarle por Felipe II", check: { stat: "conocimiento_arcano", difficulty: 10 },
        outcomes: {
          critical: { text: "Te entrega un real de plata. Pesa más de lo que debería.", effects: [{ type: E.CLUE, questId: "tres_losas", clue: "real_plata" }, { type: E.REPUTATION_FACTION, faction: "corona", value: 1 }] },
          success:  { text: "Llora sin lágrimas. Te dice un nombre.", effects: [{ type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "Te emparedará si no sales antes del alba.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }, { type: E.DOOM, value: 1 }] },
          fumble:   { text: "Te emparedará. Has dado la vuelta dos veces.", effects: [{ type: E.STATUS_ADD, status: "Deuda de sangre" }, { type: E.DOOM, value: 2 }] },
        },
      },
    ],
  },
  {
    id: "siete_ministerio", locationId: "siete-chimeneas", daynight: "day", weight: 1, oneShot: false,
    title: "Pasillo del Ministerio",
    intro: "El Ministerio de Cultura tiene tres carpetas marcadas como reservadas. Cualquier ojo curioso las nota.",
    options: [
      { id: "carpeta", label: "Asomarte a la carpeta sin sello", check: { stat: "perspicacia", difficulty: 10 },
        outcomes: {
          critical: { text: "Memorias del primer Marqués. Inéditas.", effects: [{ type: E.CLUE, questId: "canovas_servilleta", clue: "memorias_inedito" }, { type: E.INFLUENCE, value: 2 }] },
          success:  { text: "Resumen de una visita papal de 1879.", effects: [{ type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "Te ven. No pasa nada todavía.", effects: [{ type: E.THREAT, value: 1 }] },
          fumble:   { text: "Te ven. Pasa algo enseguida.", effects: [{ type: E.THREAT, value: 2 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: -1 }] },
        },
      },
      { id: "ignorar", label: "Pasar de largo", onResolve: [{ type: E.INFLUENCE, value: 1 }], onResolveText: "No miras. Buena política." },
    ],
  },

  // ── SAN ISIDRO (cementerio) ───────────────────────────────────────
  {
    id: "isidro_sereno", locationId: "san-isidro", daynight: "night", weight: 1, oneShot: true,
    title: "El sereno con farol",
    intro: "Un sereno con farol decimonónico se ofrece a guiarte a una tumba sin nombre.",
    options: [
      { id: "seguir", label: "Seguirle", check: { stat: "sangre_fria", difficulty: 9 },
        outcomes: {
          critical: { text: "La tumba lleva grabada la palabra paz, doscientas veces, sin firma.", effects: [{ type: E.CLUE, questId: "canovas_servilleta", clue: "panteon_paz" }, { type: E.INFLUENCE, value: 2 }, { type: E.DOOM, value: 1 }] },
          success:  { text: "Llegas. Está vacía. La losa pesa.", effects: [{ type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "El farol se apaga.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }] },
          fumble:   { text: "Apareces en otra calle. No es Madrid.", effects: [{ type: E.STATUS_ADD, status: "Obsesión" }, { type: E.DOOM, value: 2 }] },
        },
      },
      { id: "rechazar", label: "Decirle no", onResolve: [{ type: E.STATUS_ADD, status: "Protección" }], onResolveText: "Se inclina y desaparece entre las cipreses." },
    ],
  },
  {
    id: "isidro_goya", locationId: "san-isidro", daynight: "any", weight: 1, oneShot: true,
    title: "Goya descabezado",
    intro: "La tumba de Goya está aquí. Sabes —dato menor— que fue enterrado sin cabeza. Alguien dejó una vela.",
    options: [
      { id: "encender", label: "Encender otra vela", onResolve: [{ type: E.REPUTATION_FACTION, faction: "logia", value: 1 }, { type: E.INFLUENCE, value: 1 }], onResolveText: "La mecha prende a la primera. Buen augurio." },
      { id: "buscar", label: "Buscar la cabeza", check: { stat: "conocimiento_arcano", difficulty: 11 },
        outcomes: {
          critical: { text: "Un libro de Moyano dice dónde está. Te lleva tiempo encontrarlo.", effects: [{ type: E.CLUE, questId: "canovas_servilleta", clue: "cabeza_goya" }, { type: E.STATUS_ADD, status: "Obsesión" }] },
          success:  { text: "El bibliotecario te recomienda otro libro.", effects: [{ type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "No hay cabeza. Hay una idea de cabeza.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }] },
          fumble:   { text: "Encuentras una cabeza. No es la suya.", effects: [{ type: E.DOOM, value: 2 }, { type: E.THREAT, value: 1 }] },
        },
      },
      { id: "rezar", label: "Rezar por Larra", onResolve: [{ type: E.STATUS_ADD, status: "Bendición residual" }, { type: E.REPUTATION_FACTION, faction: "calle", value: 1 }], onResolveText: "Mariano agradece desde donde sea que esté." },
    ],
  },

  // ── ALMUDENA CEMENTERIO ───────────────────────────────────────────
  {
    id: "almudena_viudas", locationId: "almudena-cementerio", daynight: "any", weight: 1, oneShot: true,
    title: "Las tres viudas",
    intro: "Tres viudas en fila te preguntan la fecha en que naciste. Si la dices, escupen al suelo y se marchan sin volverse.",
    options: [
      { id: "decir", label: "Decir la fecha real", onResolve: [{ type: E.DOOM, value: 2 }, { type: E.CLUE, questId: "pacto_carrero", clue: "fecha_real" }, { type: E.STATUS_ADD, status: "Paranoia" }], onResolveText: "Escupen al suelo. No las vuelves a ver." },
      { id: "mentir", label: "Mentir con una fecha cercana", check: { stat: "sangre_fria", difficulty: 9 },
        outcomes: {
          critical: { text: "Te creen y se marchan. Te dejan una protección.", effects: [{ type: E.STATUS_ADD, status: "Protección" }, { type: E.INFLUENCE, value: 1 }] },
          success:  { text: "Te creen a medias. Se marchan a medias.", effects: [] },
          fail:     { text: "Una te mira por encima del hombro.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }] },
          fumble:   { text: "Las tres se quedan. Te siguen.", effects: [{ type: E.STATUS_ADD, status: "Obsesión" }, { type: E.DOOM, value: 1 }] },
        },
      },
      { id: "callar", label: "Callar y marcharte", onResolve: [{ type: E.STATUS_ADD, status: "Bendición residual" }], onResolveText: "Se quedan en fila. Hace frío." },
    ],
  },
  {
    id: "almudena_masones", locationId: "almudena-cementerio", daynight: "any", weight: 1, oneShot: false,
    title: "Panteones masones",
    intro: "En el segundo cuadrante perviven panteones masones decimonónicos: compás, escuadra, columna truncada.",
    options: [
      { id: "transcribir", label: "Transcribir las inscripciones", check: { stat: "conocimiento_arcano", difficulty: 10 },
        outcomes: {
          critical: { text: "Tres logias actuales todavía siguen su clave.", effects: [{ type: E.CLUE, questId: "pacto_carrero", clue: "clave_masona" }, { type: E.REPUTATION_FACTION, faction: "logia", value: 1 }] },
          success:  { text: "Anotas datos útiles para Moyano.", effects: [{ type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "Anotas mal. No vuelves a entender la letra.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }] },
          fumble:   { text: "Una columna truncada cambia de orientación cuando le das la espalda.", effects: [{ type: E.DOOM, value: 1 }] },
        },
      },
      { id: "fotografiar", label: "Fotografiarlos al sol", onResolve: [{ type: E.REPUTATION_FACTION, faction: "logia", value: 1 }], onResolveText: "Tres fotos salen sobreexpuestas. Las otras no salen." },
    ],
  },

  // ── OBSERVATORIO ──────────────────────────────────────────────────
  {
    id: "obs_astronomo", locationId: "observatorio", daynight: "night", weight: 1, oneShot: true,
    title: "El astrónomo empolvado",
    intro: "Un astrónomo empolvado se ofrece a leerte la carta natal. Si le das el año, te exige también los minutos.",
    options: [
      { id: "dar", label: "Darle año y minutos", onResolve: [{ type: E.CLUE, questId: "reloj_observatorio", clue: "carta_natal" }, { type: E.STATUS_ADD, status: "Obsesión" }, { type: E.INFLUENCE, value: 2 }], onResolveText: "Te lee tres cosas. Una ya pasó." },
      { id: "mentir", label: "Mentir en los minutos", check: { stat: "perspicacia", difficulty: 10 },
        outcomes: {
          critical: { text: "Te respeta. Te enseña un círculo meridiano oculto.", effects: [{ type: E.CLUE, questId: "reloj_observatorio", clue: "meridiano_oculto" }, { type: E.INFLUENCE, value: 2 }] },
          success:  { text: "Te lee la carta correcta de todos modos.", effects: [{ type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "Te dice tres cosas. Dos son falsas.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }] },
          fumble:   { text: "Te aplica las efemérides oficiales. No contemplan demonios menores.", effects: [{ type: E.DOOM, value: 2 }] },
        },
      },
      { id: "marchar", label: "Marcharte cordial", onResolve: [], onResolveText: "Vuelve al telescopio. Saluda como si te conociera." },
    ],
  },
  {
    id: "obs_olivares", locationId: "observatorio", daynight: "any", weight: 0.8, oneShot: true,
    title: "Olivares consulta a Saturno",
    intro: "Una nota del Conde-Duque, signatura aparte: encarga al astrónomo Ñ. la posición de Saturno cada once años.",
    options: [
      { id: "calcular", label: "Calcular la próxima fecha", check: { stat: "conocimiento_arcano", difficulty: 11 },
        outcomes: {
          critical: { text: "Es dentro de tres meses. Cae en martes.", effects: [{ type: E.CLUE, questId: "reloj_observatorio", clue: "fecha_saturno" }, { type: E.INFLUENCE, value: 3 }, { type: E.DOOM, value: 1 }] },
          success:  { text: "La fecha es próxima. No exacta.", effects: [{ type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "Te da migraña. No es por las cuentas.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }] },
          fumble:   { text: "Calculas tu propia fecha de algo. No quieres saber qué.", effects: [{ type: E.STATUS_ADD, status: "Obsesión" }, { type: E.DOOM, value: 1 }] },
        },
      },
      { id: "archivar", label: "Dejarlo en el archivo", onResolve: [{ type: E.REPUTATION_FACTION, faction: "logia", value: 1 }], onResolveText: "Vuelves a poner la signatura en su sitio. Bien hecho." },
    ],
  },

  // ── CLAUDIO COELLO ────────────────────────────────────────────────
  {
    id: "coello_almirante", locationId: "claudio-coello", daynight: "any", weight: 1, oneShot: true,
    title: "Un almirante pregunta la hora",
    intro: "Un almirante uniformado te pregunta la hora. Solo acepta horas cuyo minuto sea impar.",
    options: [
      { id: "impar", label: "Decirle una hora con minuto impar", onResolve: [{ type: E.REPUTATION_FACTION, faction: "iglesia", value: 1 }, { type: E.CLUE, questId: "pacto_carrero", clue: "hora_impar" }], onResolveText: "Asiente. Sigue caminando hacia la iglesia jesuita." },
      { id: "par", label: "Decirle una hora con minuto par", onResolve: [{ type: E.DOOM, value: 1 }, { type: E.STATUS_ADD, status: "Paranoia" }], onResolveText: "Se queda quieto en la acera. No se mueve hasta que tú giras la esquina." },
      { id: "callar", label: "Callar", onResolve: [], onResolveText: "Sube por encima del edificio de cinco plantas. Tú no miras." },
    ],
  },
  {
    id: "coello_pacto", locationId: "claudio-coello", daynight: "night", weight: 1, oneShot: true,
    title: "El pacto del 20-D",
    intro: "Es 20 de diciembre. Son las 09:35. La calle está vacía menos por tres figuras que llevan una hora esperándote.",
    options: [
      { id: "firmar", label: "Firmar el pacto que te ofrecen", check: { stat: "voluntad", difficulty: 10 },
        outcomes: {
          critical: { text: "Sales con todo amarrado. La órbita irregular cambia.", effects: [{ type: E.COMPLETE_QUEST, questId: "pacto_carrero" }, { type: E.INFLUENCE, value: 5 }, { type: E.STATUS_ADD, status: "Deuda de sangre" }, { type: E.DOOM, value: 2 }] },
          success:  { text: "Firmas con condiciones. El acto sigue.", effects: [{ type: E.ADVANCE_QUEST, questId: "pacto_carrero" }, { type: E.INFLUENCE, value: 2 }, { type: E.STATUS_ADD, status: "Deuda de sangre" }] },
          fail:     { text: "No firmas a tiempo. La carga estalla.", effects: [{ type: E.THREAT, value: 2 }, { type: E.STATUS_ADD, status: "Paranoia" }] },
          fumble:   { text: "Firmas con la mano contraria. No vale.", effects: [{ type: E.FAIL_QUEST, questId: "pacto_carrero" }, { type: E.DOOM, value: 3 }, { type: E.THREAT, value: 1 }] },
        },
      },
      { id: "rehusar", label: "Rehusar con elegancia", onResolve: [{ type: E.REPUTATION_FACTION, faction: "iglesia", value: -1 }, { type: E.STATUS_ADD, status: "Protección" }], onResolveText: "Te marchas sin firmar. No hay represalia inmediata." },
    ],
  },

  // ── MOYANO ────────────────────────────────────────────────────────
  {
    id: "moyano_libro", locationId: "moyano", daynight: "day", weight: 1, oneShot: true,
    title: "El libro que pensabas esconder",
    intro: "Don Roque, el librero ciego, te ofrece exacto el libro que pensabas esconder. Cuarenta euros, ni uno menos.",
    options: [
      { id: "comprar", label: "Comprarlo", onResolve: [{ type: E.OPEN_DIALOGUE, dialogueId: "tree_librero" }], onResolveText: "Pasa al diálogo con Don Roque." },
      { id: "regatear", label: "Intentar regatear", check: { stat: "recursos", difficulty: 11 },
        outcomes: {
          critical: { text: "Acepta veinte. Te respeta.", effects: [{ type: E.CLUE, questId: "tres_losas", clue: "libro_oculto" }, { type: E.REPUTATION_FACTION, faction: "logia", value: 1 }] },
          success:  { text: "Te lo deja en treinta.", effects: [{ type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "Se sube a cincuenta. Pagas o sales.", effects: [{ type: E.REPUTATION_FACTION, faction: "logia", value: -1 }] },
          fumble:   { text: "Te cobra cien. Le pagas. No sabes por qué.", effects: [{ type: E.INFLUENCE, value: -2 }, { type: E.STATUS_ADD, status: "Obsesión" }] },
        },
      },
      { id: "marchar", label: "Marcharte sin comprar", onResolve: [{ type: E.REPUTATION_FACTION, faction: "logia", value: -1 }], onResolveText: "«No vuelva», dice sin levantar la vista." },
    ],
  },
  {
    id: "moyano_azana", locationId: "moyano", daynight: "any", weight: 1, oneShot: true,
    title: "La factura impagada de Azaña",
    intro: "Los libreros tienen memoria larga. Aún hay una hoja de pedido sin firmar fechada en noviembre de 1936.",
    options: [
      { id: "firmar", label: "Firmar tú mismo la hoja", check: { stat: "voluntad", difficulty: 10 },
        outcomes: {
          critical: { text: "Aceptan tu firma. Te incluyen en la lista de clientes históricos.", effects: [{ type: E.CLUE, questId: "canovas_servilleta", clue: "firma_azana" }, { type: E.REPUTATION_FACTION, faction: "logia", value: 2 }] },
          success:  { text: "Aceptan tu firma a regañadientes.", effects: [{ type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "Rechazan. Te recuerdan que la deuda no era tuya.", effects: [] },
          fumble:   { text: "Aceptan, pero te cobran la deuda con intereses.", effects: [{ type: E.INFLUENCE, value: -2 }, { type: E.STATUS_ADD, status: "Deuda de sangre" }] },
        },
      },
      { id: "preguntar", label: "Preguntar por el Spinoza de Azaña", onResolve: [{ type: E.OPEN_DIALOGUE, dialogueId: "tree_librero" }], onResolveText: "Don Roque sale de su rincón." },
      { id: "marchar", label: "Marcharte", onResolve: [], onResolveText: "Las casetas crujen al cerrar." },
    ],
  },

  // ── SAN ANTÓN ────────────────────────────────────────────────────
  {
    id: "anton_confesion", locationId: "san-anton", daynight: "any", weight: 1, oneShot: true,
    title: "Confesión no pedida",
    intro: "Un cura jubilado te confiesa sin que lo pidas. Te absuelve de pecados que no recordabas haber cometido.",
    options: [
      { id: "hablar", label: "Hablar con él en serio", onResolve: [{ type: E.OPEN_DIALOGUE, dialogueId: "tree_cura" }], onResolveText: "Don Antón se sienta en el confesionario." },
      { id: "vela", label: "Encender la vela invisible", check: { stat: "ritualismo", difficulty: 10 },
        outcomes: {
          critical: { text: "La vela aparece encendida en bóveda elíptica.", effects: [{ type: E.CLUE, questId: "reloj_observatorio", clue: "vela_invisible" }, { type: E.STATUS_ADD, status: "Bendición residual" }] },
          success:  { text: "El aire de la zona deja de medir cero.", effects: [{ type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "La vela del altar se apaga en su lugar.", effects: [{ type: E.DOOM, value: 1 }] },
          fumble:   { text: "Se apagan tres velas. La cuarta arde sin mecha.", effects: [{ type: E.DOOM, value: 2 }, { type: E.STATUS_ADD, status: "Paranoia" }] },
        },
      },
      { id: "marchar", label: "Marcharte", onResolve: [], onResolveText: "Los frescos te siguen con la mirada." },
    ],
  },

  // ── SAN GINÉS ────────────────────────────────────────────────────
  {
    id: "gines_chocolate", locationId: "san-gines", daynight: "any", weight: 1, oneShot: true,
    title: "Un chocolate que no pediste",
    intro: "Un camarero te trae un chocolate que no has pedido. La cuenta sale a nombre de otro, parecido al tuyo.",
    options: [
      { id: "beber", label: "Bebértelo", onResolve: [{ type: E.CLUE, questId: "canovas_servilleta", clue: "cuenta_otro" }, { type: E.STATUS_ADD, status: "Obsesión" }], onResolveText: "Está espeso. Sabe a otra década." },
      { id: "preguntar", label: "Preguntar por el nombre de la cuenta", check: { stat: "perspicacia", difficulty: 9 },
        outcomes: {
          critical: { text: "Es el apellido segundo de un primo desaparecido en 1981.", effects: [{ type: E.CLUE, questId: "canovas_servilleta", clue: "primo_1981" }, { type: E.INFLUENCE, value: 2 }] },
          success:  { text: "Es un cliente habitual. No quiere darte el nombre.", effects: [{ type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "Se enfada. No te dejan volver.", effects: [{ type: E.REPUTATION_FACTION, faction: "calle", value: -1 }] },
          fumble:   { text: "Te enseña la cuenta. Es la tuya. No has firmado.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }, { type: E.DOOM, value: 1 }] },
        },
      },
      { id: "marchar", label: "Marcharte sin pagar", onResolve: [{ type: E.REPUTATION_FACTION, faction: "calle", value: -1 }], onResolveText: "Cobran a otro. Tarde o temprano vuelves." },
    ],
  },
  {
    id: "gines_canovas", locationId: "san-gines", daynight: "night", weight: 1, oneShot: true,
    title: "Servilleta de Cánovas",
    intro: "Tres de la madrugada. Dos churros por toda escolta. Te ofrecen una servilleta y un bolígrafo.",
    options: [
      { id: "firmar", label: "Firmar el pacto de turno", check: { stat: "carisma", difficulty: 10 },
        outcomes: {
          critical: { text: "Sagasta acepta a la vez en otra mesa. El siglo XIX vuelve un rato.", effects: [{ type: E.COMPLETE_QUEST, questId: "canovas_servilleta" }, { type: E.INFLUENCE, value: 5 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 2 }] },
          success:  { text: "Aceptan a medias. Algo se cierra.", effects: [{ type: E.ADVANCE_QUEST, questId: "canovas_servilleta" }, { type: E.INFLUENCE, value: 2 }] },
          fail:     { text: "La servilleta se rompe.", effects: [{ type: E.THREAT, value: 1 }] },
          fumble:   { text: "Firmas con la mano izquierda. Vuelves a 1897.", effects: [{ type: E.FAIL_QUEST, questId: "canovas_servilleta" }, { type: E.DOOM, value: 2 }, { type: E.STATUS_ADD, status: "Paranoia" }] },
        },
      },
      { id: "rechazar", label: "Rehusar y pedir churros", onResolve: [{ type: E.INFLUENCE, value: 1 }], onResolveText: "Los churros calman. La política seguirá donde estaba." },
    ],
  },

  // ── PLAZA DE LA VILLA ─────────────────────────────────────────────
  {
    id: "villa_escribano", locationId: "plaza-villa", daynight: "any", weight: 1, oneShot: true,
    title: "El escribano del XVII",
    intro: "Un escribano te pide testimonio sobre un pleito cerrado hace cuatrocientos años. Si firmas, lo gana.",
    options: [
      { id: "firmar", label: "Firmar como testigo", onResolve: [{ type: E.CLUE, questId: "tres_losas", clue: "testigo_pleito" }, { type: E.STATUS_ADD, status: "Deuda de sangre" }, { type: E.REPUTATION_FACTION, faction: "logia", value: 1 }], onResolveText: "Gana el pleito. Algo gana en ti también." },
      { id: "interrogar", label: "Interrogarle al revés", check: { stat: "perspicacia", difficulty: 10 },
        outcomes: {
          critical: { text: "Te confiesa los nombres de los tres regidores muertos en circunstancias nunca esclarecidas.", effects: [{ type: E.CLUE, questId: "tres_losas", clue: "tres_regidores" }, { type: E.ADVANCE_QUEST, questId: "tres_losas" }, { type: E.INFLUENCE, value: 2 }] },
          success:  { text: "Te da uno de los tres nombres.", effects: [{ type: E.CLUE, questId: "tres_losas", clue: "un_regidor" }] },
          fail:     { text: "Se cierra. Plumas escriben solas a su espalda.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }] },
          fumble:   { text: "Te demanda. No sabes en qué tribunal.", effects: [{ type: E.THREAT, value: 1 }, { type: E.DOOM, value: 1 }] },
        },
      },
      { id: "marchar", label: "Marcharte sin firmar", onResolve: [{ type: E.STATUS_ADD, status: "Protección" }], onResolveText: "El escribano cierra el legajo. Cuatrocientos años más." },
    ],
  },
  {
    id: "villa_cripta", locationId: "plaza-villa", daynight: "night", weight: 0,
    requires: { questFlag: "tres_losas:visited_plaza_villa_night" },
    oneShot: true,
    title: "La cripta gótica de Cisneros",
    intro: "Bajas a la cripta. Tres losas sin epitafio. Una de ellas tiene grabada una marca de cantero que parece tu inicial.",
    options: [
      { id: "abrir", label: "Levantar la losa marcada", check: { stat: "conocimiento_arcano", difficulty: 11 },
        outcomes: {
          critical: { text: "Bajo la losa: tres reales de plata, un escudo de Cisneros y una nota. La nota te nombra.", effects: [{ type: E.COMPLETE_QUEST, questId: "tres_losas" }, { type: E.INFLUENCE, value: 5 }, { type: E.DOOM, value: -2 }, { type: E.REPUTATION_FACTION, faction: "logia", value: 2 }] },
          success:  { text: "Bajo la losa: un escudo y una nota sin firma.", effects: [{ type: E.ADVANCE_QUEST, questId: "tres_losas" }, { type: E.INFLUENCE, value: 2 }, { type: E.STATUS_ADD, status: "Obsesión" }] },
          fail:     { text: "La losa pesa demasiado. Se te enquista.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }, { type: E.THREAT, value: 1 }] },
          fumble:   { text: "Bajo la losa hay otra losa. Y otra. No paras.", effects: [{ type: E.FAIL_QUEST, questId: "tres_losas" }, { type: E.DOOM, value: 3 }, { type: E.STATUS_ADD, status: "Obsesión" }] },
        },
      },
      { id: "rezar", label: "Rezar tres aves marías y marcharte", onResolve: [{ type: E.STATUS_ADD, status: "Protección" }, { type: E.REPUTATION_FACTION, faction: "iglesia", value: 1 }], onResolveText: "Subes. Madrid sigue arriba." },
    ],
  },
  {
    id: "villa_visita_noche", locationId: "plaza-villa", daynight: "night", weight: 1, oneShot: true,
    requires: { questFlag: "tres_losas:active" },
    title: "Plaza de la Villa de noche",
    intro: "La plaza está vacía. El reloj del Concejo no marca minutos. Las losas tres de abajo siguen ahí.",
    options: [
      { id: "bajar", label: "Bajar a la cripta", onResolve: [{ type: E.FLAG, questId: "tres_losas", flag: "visited_plaza_villa_night", value: true }, { type: E.OPEN_SCENE, sceneId: "villa_cripta" }], onResolveText: "Abres la puerta lateral. Es la primera vez sin ruido." },
      { id: "estudiar", label: "Estudiar la fachada", check: { stat: "perspicacia", difficulty: 9 },
        outcomes: {
          critical: { text: "Tres ventanas tienen marca de cantero gemela a la de las losas.", effects: [{ type: E.CLUE, questId: "tres_losas", clue: "ventanas_canteros" }, { type: E.FLAG, questId: "tres_losas", flag: "visited_plaza_villa_night", value: true }] },
          success:  { text: "Detalle menor pero útil.", effects: [{ type: E.INFLUENCE, value: 1 }, { type: E.FLAG, questId: "tres_losas", flag: "visited_plaza_villa_night", value: true }] },
          fail:     { text: "La fachada se te resiste.", effects: [] },
          fumble:   { text: "Una ventana se abre sola. Tú no estabas mirando.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }] },
        },
      },
    ],
  },

  // ── PLAZA DE ORIENTE ──────────────────────────────────────────────
  {
    id: "oriente_rey_godo", locationId: "plaza-oriente", daynight: "any", weight: 1, oneShot: true,
    title: "Estatua de rey godo",
    intro: "Una estatua de rey godo gira un grado cuando le das la espalda. No se mueve mientras la miras.",
    options: [
      { id: "girar", label: "Darte la vuelta lentamente", check: { stat: "sangre_fria", difficulty: 10 },
        outcomes: {
          critical: { text: "La pillas en pleno giro. Te dice un nombre antes de quedarse quieta.", effects: [{ type: E.CLUE, questId: "pacto_carrero", clue: "nombre_godo" }, { type: E.INFLUENCE, value: 2 }] },
          success:  { text: "Te paraliza unos segundos. Aguantas.", effects: [{ type: E.STATUS_ADD, status: "Protección" }] },
          fail:     { text: "Te da la espalda ella a ti.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }] },
          fumble:   { text: "Las veinte estatuas giran a la vez. Sales corriendo.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }, { type: E.DOOM, value: 2 }] },
        },
      },
      { id: "ignorar", label: "Ignorar y caminar al palacio", onResolve: [{ type: E.REPUTATION_FACTION, faction: "corona", value: 1 }], onResolveText: "Bien hecho. La protocolaria nunca falla." },
    ],
  },
  {
    id: "oriente_cripta", locationId: "plaza-oriente", daynight: "night", weight: 1, oneShot: true,
    title: "El alquimista catalán",
    intro: "Bajo el Palacio Real hay criptas con jesuitas y un alquimista sin nombre. La Logia ha llegado solo dos veces; tú serías la tercera.",
    options: [
      { id: "bajar", label: "Intentar bajar", check: { stat: "conocimiento_arcano", difficulty: 12 },
        outcomes: {
          critical: { text: "Encuentras el nombre del alquimista. Te abre el camino.", effects: [{ type: E.CLUE, questId: "reloj_observatorio", clue: "nombre_alquimista" }, { type: E.ADVANCE_QUEST, questId: "reloj_observatorio" }, { type: E.INFLUENCE, value: 3 }] },
          success:  { text: "Avanzas dos cámaras. Apuntas tres iniciales.", effects: [{ type: E.INFLUENCE, value: 1 }, { type: E.STATUS_ADD, status: "Obsesión" }] },
          fail:     { text: "Te paran los jesuitas. Sin violencia, sin promesa.", effects: [{ type: E.REPUTATION_FACTION, faction: "iglesia", value: -1 }] },
          fumble:   { text: "Te paran los muertos. Sin violencia, con promesa.", effects: [{ type: E.STATUS_ADD, status: "Deuda de sangre" }, { type: E.DOOM, value: 2 }] },
        },
      },
      { id: "no", label: "Renunciar y subir", onResolve: [{ type: E.STATUS_ADD, status: "Protección" }], onResolveText: "Subes. La luna está en el sitio que debe estar." },
    ],
  },

  // ── ALMUDENA CRIPTA ───────────────────────────────────────────────
  {
    id: "almucripta_marquesa", locationId: "almudena-cripta", daynight: "any", weight: 1, oneShot: true,
    title: "La marquesa con abanico",
    intro: "Una marquesa con abanico te pregunta si quieres heredar. Solo admite un sí o un no; la duda la ofende.",
    options: [
      { id: "dialogar", label: "Sentarse a hablar", onResolve: [{ type: E.OPEN_DIALOGUE, dialogueId: "tree_marquesa" }], onResolveText: "La marquesa cierra el abanico." },
      { id: "rezar", label: "Rezar por las placas anónimas", check: { stat: "ritualismo", difficulty: 10 },
        outcomes: {
          critical: { text: "Una de las placas devela un apellido.", effects: [{ type: E.CLUE, questId: "tres_losas", clue: "placa_anonima" }, { type: E.STATUS_ADD, status: "Bendición residual" }] },
          success:  { text: "Las cinco placas vibran muy poco.", effects: [{ type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "Las placas no se mueven.", effects: [] },
          fumble:   { text: "Una placa se cae. Tu nombre por detrás.", effects: [{ type: E.DOOM, value: 2 }, { type: E.STATUS_ADD, status: "Paranoia" }] },
        },
      },
    ],
  },

  // ── GLOBALES (sin locationId fijo, atadas a quests) ───────────────
  {
    id: "global_filtracion", locationId: null, daynight: "any", weight: 0,
    requires: { minDoom: 4 },
    oneShot: true,
    title: "Te llama un periodista",
    intro: "Un cronista parlamentario te pide cinco minutos. Tiene un párrafo a punto. Solo le falta tu confirmación.",
    options: [
      { id: "negar", label: "Negarlo todo", check: { stat: "sangre_fria", difficulty: 9 },
        outcomes: {
          critical: { text: "Lo retira y te debe una.", effects: [{ type: E.INFLUENCE, value: 2 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 1 }] },
          success:  { text: "Lo retira a regañadientes.", effects: [{ type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "Lo publica. No es exacto, pero suena.", effects: [{ type: E.THREAT, value: 1 }] },
          fumble:   { text: "Lo publica y añade un párrafo nuevo.", effects: [{ type: E.THREAT, value: 2 }, { type: E.DOOM, value: 1 }] },
        },
      },
      { id: "confirmar", label: "Confirmarlo a medias", onResolve: [{ type: E.INFLUENCE, value: 2 }, { type: E.DOOM, value: 1 }], onResolveText: "Sale en portada. Tu nombre, no." },
    ],
  },
  {
    id: "global_amanuense", locationId: null, daynight: "night", weight: 0,
    requires: { minDoom: 6 },
    oneShot: true,
    title: "Llaman a tu puerta",
    intro: "Las cuatro de la madrugada. Llaman tres veces. Por debajo de la puerta, una hoja con tu inicial en blanco.",
    options: [
      { id: "abrir", label: "Abrir", check: { stat: "voluntad", difficulty: 10 },
        outcomes: {
          critical: { text: "Era un amanuense. Te trae un legajo.", effects: [{ type: E.CLUE, questId: "pacto_carrero", clue: "legajo_amanuense" }, { type: E.STATUS_ADD, status: "Bendición residual" }] },
          success:  { text: "No hay nadie. Pero la hoja ya no está en blanco.", effects: [{ type: E.STATUS_ADD, status: "Obsesión" }, { type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "Tres pasos en el rellano que se alejan despacio.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }, { type: E.DOOM, value: 1 }] },
          fumble:   { text: "Te queda la inicial dentro.", effects: [{ type: E.STATUS_ADD, status: "Paranoia" }, { type: E.STATUS_ADD, status: "Obsesión" }] },
        },
      },
      { id: "no_abrir", label: "No abrir", onResolve: [{ type: E.STATUS_ADD, status: "Protección" }, { type: E.DOOM, value: 1 }], onResolveText: "Los pasos vuelven dentro de tres noches." },
    ],
  },

  // ── CONGRESO DE LOS DIPUTADOS (poder) ─────────────────────────────
  {
    id: "congreso_escanos", locationId: "congreso", daynight: "day", weight: 1.2, oneShot: false,
    title: "Negociación de votos",
    intro: "Un portavoz de grupo minoritario te espera en la sala de prensa. Tiene cuatro escaños y los ofrece al mejor postor. Sin prisa y sin letra pequeña, dice.",
    options: [
      { id: "oferta_directa", label: "Hacer una oferta directa en recursos", check: { stat: "recursos", difficulty: 9 },
        outcomes: {
          critical: { text: "Acepta al momento. Los cuatro escaños son tuyos.", effects: [{ type: E.INFLUENCE, value: 4 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 1 }, { type: E.CLUE, questId: "mocion_censura", clue: "voto_escanos_1" }] },
          success:  { text: "Trato a medias: dos de cuatro hasta nueva reunión.", effects: [{ type: E.INFLUENCE, value: 2 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 1 }] },
          fail:     { text: "Pide más de lo que traes. Aplaza.", effects: [{ type: E.THREAT, value: 1 }] },
          fumble:   { text: "Filtran la reunión antes de que salgas.", effects: [{ type: E.THREAT, value: 2 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: -1 }] },
        },
      },
      { id: "carisma_pacto", label: "Apelar a la lealtad ideológica", check: { stat: "carisma", difficulty: 10 },
        outcomes: {
          critical: { text: "Lo convences sin coste económico. Estás en deuda moral, que es peor.", effects: [{ type: E.INFLUENCE, value: 3 }, { type: E.REPUTATION_FACTION, faction: "calle", value: 1 }, { type: E.CLUE, questId: "mocion_censura", clue: "voto_ideologia_1" }] },
          success:  { text: "Asiente. Pide algo simbólico a cambio.", effects: [{ type: E.INFLUENCE, value: 2 }] },
          fail:     { text: "«La lealtad no paga el alquiler de la sede».", effects: [] },
          fumble:   { text: "Se va con el bloque contrario.", effects: [{ type: E.REPUTATION_FACTION, faction: "aparato", value: -1 }, { type: E.THREAT, value: 1 }] },
        },
      },
      { id: "salir", label: "Dejar enfriar la oferta", onResolve: [{ type: E.INFLUENCE, value: 1 }], onResolveText: "En los pasillos del Congreso, el tiempo siempre corre en tu contra." },
    ],
  },
  {
    id: "congreso_votacion", locationId: "congreso", daynight: "any", weight: 1, oneShot: false,
    title: "Votación clave en el hemiciclo",
    intro: "La votación lleva media hora de retraso. El timbre no suena. Tres diputados de tu bando están en el bar de la Cámara y no responden al móvil.",
    options: [
      { id: "buscar_diputados", label: "Ir al bar a buscarlos personalmente", check: { stat: "sangre_fria", difficulty: 9 },
        outcomes: {
          critical: { text: "Los traes a tiempo. La votación pasa por tres votos.", effects: [{ type: E.INFLUENCE, value: 3 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 1 }, { type: E.CLUE, questId: "mocion_censura", clue: "votacion_ganada" }] },
          success:  { text: "Llegas con dos de tres. Suficiente por poco.", effects: [{ type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "El timbre suena antes de llegar. Pospuesta.", effects: [{ type: E.THREAT, value: 1 }] },
          fumble:   { text: "Están bebiendo con el portavoz contrario. Llegas tarde y mal.", effects: [{ type: E.THREAT, value: 2 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: -1 }] },
        },
      },
      { id: "delegar", label: "Delegar y confiar en el resultado", onResolve: [{ type: E.INFLUENCE, value: 1 }], onResolveText: "La votación pasa por un margen ajustado. Sin tu ayuda, pero sin tu culpa." },
      { id: "abstencion", label: "Negociar una abstención técnica con el grupo rival", check: { stat: "perspicacia", difficulty: 10 },
        outcomes: {
          critical: { text: "La abstención sale mejor que el voto afirmativo. El portavoz rival te debe una.", effects: [{ type: E.INFLUENCE, value: 2 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 1 }] },
          success:  { text: "Neutro, pero elegante.", effects: [{ type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "Interpretaron la abstención como rechazo.", effects: [{ type: E.THREAT, value: 1 }] },
          fumble:   { text: "La abstención no se registró. Apareces como voto en contra.", effects: [{ type: E.REPUTATION_FACTION, faction: "aparato", value: -2 }] },
        },
      },
    ],
  },
  {
    id: "congreso_periodista", locationId: "congreso", daynight: "any", weight: 1, oneShot: false,
    title: "Filtración a la prensa parlamentaria",
    intro: "Una periodista de agencia te espera en los pasillos. Tiene el micrófono apagado, pero la libreta abierta. Señala con la barbilla: «tengo dos horas antes del cierre».",
    options: [
      { id: "filtrar_rival", label: "Filtrar información sobre un rival", check: { stat: "perspicacia", difficulty: 10 },
        outcomes: {
          critical: { text: "La información sale limpia y te mantiene en la sombra.", effects: [{ type: E.INFLUENCE, value: 3 }, { type: E.THREAT, value: -1 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 1 }] },
          success:  { text: "Sale, pero con tu nombre entre líneas.", effects: [{ type: E.INFLUENCE, value: 2 }] },
          fail:     { text: "Publica lo que no debía. El daño rebota.", effects: [{ type: E.THREAT, value: 1 }] },
          fumble:   { text: "Te cita por nombre. Mañana tienes que dar explicaciones.", effects: [{ type: E.THREAT, value: 2 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: -1 }] },
        },
      },
      { id: "filtrar_aliado", label: "Filtrar para inflar a un aliado", check: { stat: "carisma", difficulty: 9 },
        outcomes: {
          critical: { text: "Tu aliado queda bien en todos los medios. Te lo deberá.", effects: [{ type: E.INFLUENCE, value: 2 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 2 }] },
          success:  { text: "Sale bien. El aliado no sabe que fuiste tú.", effects: [{ type: E.INFLUENCE, value: 1 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 1 }] },
          fail:     { text: "Confunde el bando. El aliado queda mal.", effects: [{ type: E.REPUTATION_FACTION, faction: "aparato", value: -1 }] },
          fumble:   { text: "La periodista lo invierte: cita al aliado criticando lo mismo.", effects: [{ type: E.REPUTATION_FACTION, faction: "aparato", value: -2 }, { type: E.THREAT, value: 1 }] },
        },
      },
      { id: "no_filtrar", label: "Solo escuchar", onResolve: [{ type: E.INFLUENCE, value: 1 }], onResolveText: "Escuchas. Ella también. La hora pasa siendo útil para los dos." },
    ],
  },
  {
    id: "congreso_mocion_final", locationId: "congreso", daynight: "night", weight: 0,
    requires: { questMinStage: { id: "mocion_censura", stage: 2 } },
    oneShot: true,
    title: "La votación de la moción",
    intro: "El hemiciclo está lleno. La tribuna de prensa también. Llevas semanas preparando esto. El timbre suena.",
    options: [
      { id: "presentar", label: "Presentar la moción y votar", check: { stat: "carisma", difficulty: 10 },
        outcomes: {
          critical: { text: "Pasa por nueve votos. El gobierno cae.", effects: [{ type: E.COMPLETE_QUEST, questId: "mocion_censura" }, { type: E.INFLUENCE, value: 5 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 2 }] },
          success:  { text: "Pasa por dos votos. Ajustado, pero suficiente.", effects: [{ type: E.ADVANCE_QUEST, questId: "mocion_censura" }, { type: E.FLAG, questId: "mocion_censura", flag: "mocion_presentada", value: true }, { type: E.INFLUENCE, value: 3 }] },
          fail:     { text: "No tienes los votos. La moción fracasa.", effects: [{ type: E.THREAT, value: 2 }] },
          fumble:   { text: "Tres de los tuyos se abstienen. Humillación pública.", effects: [{ type: E.FAIL_QUEST, questId: "mocion_censura" }, { type: E.THREAT, value: 2 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: -2 }] },
        },
      },
      { id: "aplazar", label: "Aplazar un día más para asegurar votos", onResolve: [], onResolveText: "El hemiciclo se vacía. Tienes una noche más." },
    ],
  },

  // ── SEDE DEL PARTIDO (poder) ───────────────────────────────────────
  {
    id: "sede_lista", locationId: "sede-partido", daynight: "day", weight: 1.2, oneShot: false,
    title: "El secretario de organización",
    intro: "Don Ernesto lleva tres semanas con la lista autonómica encima de la mesa. Faltan seis nombres. Tienes hasta las diez de la noche.",
    options: [
      { id: "presionar", label: "Exigir un puesto para un aliado", check: { stat: "carisma", difficulty: 10 },
        outcomes: {
          critical: { text: "Acepta. Tu aliado va en el número tres.", effects: [{ type: E.INFLUENCE, value: 3 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 1 }] },
          success:  { text: "Acepta en el número siete. No es una victoria, pero sirve.", effects: [{ type: E.INFLUENCE, value: 1 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 1 }] },
          fail:     { text: "No se mueve. La lista sigue como estaba.", effects: [{ type: E.THREAT, value: 1 }] },
          fumble:   { text: "Te quita un nombre que ya habías conseguido.", effects: [{ type: E.REPUTATION_FACTION, faction: "aparato", value: -1 }, { type: E.THREAT, value: 1 }] },
        },
      },
      { id: "revisar_lista", label: "Revisar toda la lista sin pedir nada", check: { stat: "perspicacia", difficulty: 9 },
        outcomes: {
          critical: { text: "Ves el nombre que no debería estar. Eso vale más que un puesto.", effects: [{ type: E.INFLUENCE, value: 2 }, { type: E.CLUE, questId: "mocion_censura", clue: "nombre_lista" }] },
          success:  { text: "Anotas tres nombres útiles para más tarde.", effects: [{ type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "El secretario cierra la carpeta antes de que acabes.", effects: [] },
          fumble:   { text: "Ve que estás mirando y toma nota del interés.", effects: [{ type: E.THREAT, value: 1 }] },
        },
      },
      { id: "irse", label: "Marcharte sin tocar la lista", onResolve: [], onResolveText: "La lista se cierra sola. Sin tu nombre ni el de nadie tuyo." },
    ],
  },
  {
    id: "sede_escandalo", locationId: "sede-partido", daynight: "night", weight: 1, oneShot: false,
    title: "Escándalo mediático de madrugada",
    intro: "Son las once y media. El WhatsApp del partido explota. Un vídeo circula desde hace veinte minutos y el gabinete de comunicación no responde el teléfono.",
    options: [
      { id: "gestionar_crisis", label: "Tomar el control de la comunicación", check: { stat: "sangre_fria", difficulty: 10 },
        outcomes: {
          critical: { text: "Centras el mensaje antes del informativo de medianoche. El escándalo amaina.", effects: [{ type: E.THREAT, value: -1 }, { type: E.INFLUENCE, value: 2 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 1 }] },
          success:  { text: "El daño es limitado. Habrá resaca mañana, pero no hemorragia.", effects: [{ type: E.THREAT, value: -1 }, { type: E.INFLUENCE, value: 1 }] },
          fail:     { text: "Mandas el comunicado equivocado al chat equivocado.", effects: [{ type: E.THREAT, value: 2 }] },
          fumble:   { text: "Acabas en el vídeo. Tú mismo eres el escándalo.", effects: [{ type: E.THREAT, value: 2 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: -2 }] },
        },
      },
      { id: "dejar_caer", label: "Dejar que el gabinete se encargue", onResolve: [{ type: E.THREAT, value: 1 }], onResolveText: "El gabinete se encarga mal. Mañana amanece peor." },
      { id: "usar_escandalo", label: "Usar el escándalo para adelantar posiciones", check: { stat: "recursos", difficulty: 11 },
        outcomes: {
          critical: { text: "El escándalo aplasta a un rival y te abre su hueco.", effects: [{ type: E.INFLUENCE, value: 4 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: 1 }, { type: E.CLUE, questId: "mocion_censura", clue: "escandalo_usado" }] },
          success:  { text: "Ganas terreno, pero el partido lo nota.", effects: [{ type: E.INFLUENCE, value: 2 }] },
          fail:     { text: "El movimiento se lee como oportunismo.", effects: [{ type: E.THREAT, value: 1 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: -1 }] },
          fumble:   { text: "Te asocian con el escándalo original.", effects: [{ type: E.THREAT, value: 2 }, { type: E.REPUTATION_FACTION, faction: "aparato", value: -2 }] },
        },
      },
    ],
  },
];

// ── Catálogo indexado y selección ───────────────────────────────────
const ENCOUNTERS_BY_ID = ENCOUNTERS.reduce((acc, e) => { acc[e.id] = e; return acc; }, {});

export function getEncounter(id) {
  return ENCOUNTERS_BY_ID[id] || null;
}

function meetsRequires(enc, state) {
  const r = enc.requires;
  if (!r) return true;
  if (typeof r.minDoom === "number" && state.doom.value < r.minDoom) return false;
  if (r.statusNot && r.statusNot.some((s) => state.character.statuses.some((st) => st.name === s))) return false;
  if (r.questCompleted) {
    const q = state.quests[r.questCompleted];
    if (!q || !q.completed) return false;
  }
  if (r.questFlag) {
    const [qid, flag] = r.questFlag.split(":");
    const q = state.quests[qid];
    if (!q) return false;
    if (flag === "active") {
      if (q.completed || q.failed) return false;
    } else if (!q.flags?.[flag]) {
      return false;
    }
  }
  if (r.questMinStage) {
    const q = state.quests[r.questMinStage.id];
    if (!q || q.failed || q.stage < r.questMinStage.stage) return false;
  }
  if (r.repFactionMin) {
    const [fac, min] = r.repFactionMin;
    if ((state.reputation.factions[fac] ?? 0) < min) return false;
  }
  return true;
}

export function pickEncounter({ locationId, daynight = "any", state }) {
  const dayCompat = (encDay) => encDay === "any" || encDay === daynight;
  const candidates = ENCOUNTERS.filter((e) => {
    if (e.locationId !== locationId) return false;
    if (!dayCompat(e.daynight)) return false;
    if (e.oneShot && state.encountersSeen?.[e.id]?.count > 0) return false;
    if (!meetsRequires(e, state)) return false;
    return true;
  });
  if (candidates.length === 0) {
    return genericFallback(locationId, null);
  }
  const totalWeight = candidates.reduce((acc, c) => acc + (c.weight || 1), 0);
  if (totalWeight <= 0) return candidates[0];
  let roll = Math.random() * totalWeight;
  for (const c of candidates) {
    roll -= (c.weight || 1);
    if (roll <= 0) return c;
  }
  return candidates[0];
}

// Encuentros globales (sin locationId) que se pueden disparar en fin de ronda.
export function pickGlobalEncounter(state) {
  const candidates = ENCOUNTERS.filter((e) => {
    if (e.locationId !== null) return false;
    if (e.oneShot && state.encountersSeen?.[e.id]?.count > 0) return false;
    if (!meetsRequires(e, state)) return false;
    return true;
  });
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
