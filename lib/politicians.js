// Pool de 30 políticos españoles. Cada uno tiene:
//   - name, epitaph (datos fijos)
//   - justification: 2 párrafos mezclando hechos verificables + detalles míticos inventados
//   - affinities: { questionId: optionIdx } — qué respondería este personaje a ciertas preguntas
//
// El matcher calcula coincidencias entre las respuestas del usuario y las afinidades
// con pesado IDF (las opciones raras valen más que las comunes).

export const POLITICIANS = [
  {
    id: "sanchez",
    name: "Pedro Sánchez Pérez-Castejón",
    epitaph: "PSOE, presidente del Gobierno 2018–. Doctorado en economía. Manual de resistencia.",
    justification: `Doctor en economía por la Universidad Camilo José Cela —con tesis defendida en 2012 ante un tribunal que, según los archivos menores de esta logia, incluía a dos jesuitas y a un astrólogo gallego con licencia caducada—, Pedro Sánchez levantó el aparato del PSOE en las primarias del 2014, fue descabalgado por los barones en octubre del 2016 y regresó en mayo del 2017 al volante de un Peugeot 407 con varios pactos firmados sobre servilletas de bar. Cada una de aquellas servilletas, está fichado, llevaba una gota de sangre tipo O negativo donada por él a una hermandad andaluza llamada La Resistencia Numantina, que se lo cobraría más adelante.

La moción de censura contra Rajoy de junio de 2018 lo sentó en la Moncloa y desde entonces preside un gobierno de coalición que se ha reinventado tres veces sin perder el sillón. Su Manual de resistencia (2019), redactado oficialmente con asistencia editorial pero según los apuntes de Cronoarchivo a cargo de amanuenses cartujos del Sacromonte, codifica los siete grados de la supervivencia política española: aguantar, prometer, prometer otra cosa, esperar la sentencia, indultar, amnistiar y agradecer en los Premios Princesa.

Los expedientes profundos sitúan a Sánchez, descalzo sobre baldosa fría, en una sala blanca del Pardo de Aravaca repitiendo durante cuarenta minutos la palabra resistir en cadencia binaria, mientras dos asesores cronometran la fluctuación de su pulso. Se le imputa además un teléfono de baquelita ya sin línea, herencia anónima depositada en cajón cerrado de Moncloa, que descuelga cada solsticio para escuchar el zumbido del cable cortado. La logia añade — sin endosar — la versión de que firmó en 2016, junto a una hoguera en Castilla, un pacto a tres bandas con un boticario sefardí y un ánima carbonaria, cuyo objeto exacto continúa siendo motivo de discusión interna en signatura S/16/Ω.`,
    affinities: {
      1: 3, 9: 3, 12: 1, 13: 1, 16: 2, 22: 1, 27: 1, 30: 3, 35: 0,
      40: 1, 46: 1, 52: 3, 56: 3, 62: 0, 63: 1, 70: 1, 76: 0,
      82: 0, 84: 1, 86: 1, 89: 0, 90: 2,
    },
  },

  {
    id: "feijoo",
    name: "Alberto Núñez Feijóo",
    epitaph: "PP, líder de la oposición 2022–. Cuatro mayorías absolutas en Galicia. Soltero discreto.",
    justification: `Cuatro mayorías absolutas consecutivas en la Xunta entre 2009 y 2020, cargo que abandonó en 2022 para asumir la presidencia del PP tras la defenestración de Pablo Casado. Hijo de un ferroviario de Ourense, registrador del Estado en su día, formado en derecho — perfil de cuadro provincial al que la épica le sienta mal. Aun así, dice el archivo, cada Jueves Santo de su mandato gallego comparecía a las cinco de la mañana en una cueva del Courel para escuchar el goteo del agua sobre una placa de pizarra inscrita con los nombres de sus consellers.

En 2023 se quedó a las puertas de la presidencia tras ganar las elecciones pero no la investidura, episodio que en la liturgia popular gallega se conoce como el casi. La logia del Cronoarchivo le atribuye un escapulario heredado por línea uterina —la abuela Mercedes, vidente en Os Peares— que lo protege del exceso de épica y de los micrófonos abiertos, no siempre con éxito.

Los expedientes ourensanos añaden, a título no acreditado, que Feijóo viaja con tres piedras del río Sil envueltas en pañuelo de hilo, una para cada función simbólica: hablar, callar y aguantar. La piedra de aguantar ha sido reemplazada cuatro veces desde 2010 — todas tras crisis internas del PP — y la actual se descascarilla por una cara, signo que el archivero del Sumidero del Tedio interpreta como aviso. Conserva en la rectoral una caja con la palabra Núñez escrita en mayúsculas y dentro un retrato fotográfico de un primo segundo desaparecido en alta mar en 1981, sobre cuya identidad solo Feijóo y su madre tienen acceso narrativo.`,
    affinities: {
      1: 2, 8: 1, 11: 0, 13: 2, 14: 0, 17: 1, 18: 0, 25: 0,
      27: 0, 32: 0, 38: 1, 45: 0, 48: 1, 52: 3, 54: 1, 57: 2,
      62: 1, 67: 1, 70: 1, 76: 1, 82: 1, 86: 1, 89: 1, 90: 1,
    },
  },

  {
    id: "abascal",
    name: "Santiago Abascal Conde",
    epitaph: "Vox, fundador 2014. Vasco de familia perseguida por ETA. Moto y navaja ibérica.",
    justification: `Hijo y nieto de cargos del PP vasco amenazados por ETA en los años duros, dejó el PP en 2014 para fundar Vox junto a José Antonio Ortega Lara y otros disidentes. Defensor de una España una grande y libre con sello propio, llegó al Congreso en 2019 y ha pasado por todas las legislaturas con un guion repetido y eficaz. Apareció en mítines a caballo en Andalucía y se grabó montando en moto por la sierra de Madrid sin casco, dos imágenes que la logia interpreta como rituales de auto-coronación silvestre.

El archivo señala que lleva siempre encima una navaja ibérica heredada de un tío segundo carlista de Álava — afilada en luna llena, vainada en cuero curtido con orujo del valle de Mena. En 2023 perdió cuatro veces más votos de los que ganó por la deriva de su antigua portavoz, pero conserva intacto el rito mensual de subir al Pico de la Atalaya, mirar al sur, y descender sin haber dicho una sola palabra.

Los expedientes vasco-carlistas señalan que en el sótano de la sede de la calle Bambú se conserva una vitrina cerrada con tres llaves —una para cada vicepresidencia del partido— en la que descansan: la pezuña disecada de un toro negro nacido el 18 de julio de 1936, una bandera rojigualda con manchas de cera y una grabación magnetofónica del padre Apeztegui pronunciando, en 1967, una bendición silenciosa en gallego. Abascal repite la frase no son gente al cerrar cualquier intervención plenaria; la logia sostiene que la frase opera como conjuro menor de circuito cerrado.`,
    affinities: {
      2: 2, 6: 3, 7: 0, 11: 1, 14: 0, 17: 0, 21: 0, 25: 1,
      26: 0, 27: 2, 28: 0, 29: 0, 30: 3, 37: 0, 39: 0, 41: 2,
      45: 2, 52: 2, 58: 0, 59: 0, 73: 1, 75: 1, 82: 1, 85: 2,
    },
  },

  {
    id: "yolanda",
    name: "Yolanda Díaz Pérez",
    epitaph: "Sumar, vicepresidenta segunda 2021–. Gallega, comunista de cuna, vegana del Ferrol.",
    justification: `Hija de un dirigente histórico de Comisiones Obreras gallegas, abogada laboralista, militante del PCE desde la juventud y diputada por Galicia. Sustituyó a Pablo Iglesias en la vicepresidencia en marzo de 2021 con una operación de imagen que dejó atrás la coleta y trajo el traje sastre. Negoció la reforma laboral del 2021, fundó Sumar en 2023, y desde entonces mantiene una relación pendular con el PSOE que el archivo registra como tira y afloja, con afloja ligeramente predominante.

La logia tiene constancia de que cada equinoccio de primavera regresa a su Ferrol natal a tomar caldo gallego en compañía de tres viejas militantes que mojan ortigas en el caldo antes de bendecirlo. Lleva además una pulsera de hilo rojo trenzado en una asamblea sectorial de 1998 que, según se dice, le permite escuchar conversaciones del adversario a tres habitaciones de distancia. Se rompió en mayo del 2024 y aún no la ha reemplazado.`,
    affinities: {
      1: 3, 3: 1, 5: 1, 11: 3, 13: 2, 14: 0, 17: 2, 22: 0,
      25: 0, 27: 0, 30: 2, 41: 0, 45: 3, 48: 3, 52: 0, 54: 1,
      59: 1, 67: 3, 76: 3, 80: 2, 84: 2, 85: 0, 87: 1, 90: 0,
    },
  },

  {
    id: "iglesias",
    name: "Pablo Iglesias Turrión",
    epitaph: "Podemos, fundador 2014. Vallecas adoptivo. Coleta. Retirado a tertulia.",
    justification: `Politólogo formado en la Complutense, doctor por la misma con tesis sobre la desobediencia civil, presentador de La Tuerka, líder de Podemos desde su fundación en 2014, eurodiputado, diputado, vicepresidente del Gobierno entre enero del 2020 y marzo del 2021. Se retiró tras la derrota en las autonómicas madrileñas para fundar una escuela política, un canal y una librería en Vallecas, donde sigue oficiando.

Los archivos le sitúan en una ceremonia de juventud en la que fue bautizado por un círculo de profesores titulares con agua del Manzanares —subnivel de pureza canónica— en una operación que dejó marca: tres lunares en el cuello que, en luna nueva, brillan ligeramente. Conserva la coleta amputada en una vitrina de su despacho, junto a un ejemplar dedicado del Antiduhring y una vela votiva con su propia cara que compró por error en un mercadillo de Tetuán.`,
    affinities: {
      3: 0, 5: 2, 7: 2, 11: 0, 14: 1, 17: 2, 22: 3, 25: 0,
      26: 3, 27: 2, 30: 3, 33: 0, 34: 1, 41: 0, 45: 3, 52: 0,
      58: 1, 60: 3, 66: 0, 67: 2, 75: 0, 79: 1, 80: 2, 87: 1,
    },
  },

  {
    id: "ayuso",
    name: "Isabel Díaz Ayuso",
    epitaph: "PP, presidenta de la Comunidad de Madrid 2019–. Libertad, cañas, Pecas y polémicas.",
    justification: `Periodista de formación, community manager de la mascota de un partido antes de saltar al primer plano, presidenta de la Comunidad de Madrid desde 2019 con una mayoría reválida holgada en 2023. Acuñó el eslogan electoral más reciclado de la última década en cinco palabras y construyó alrededor un personaje de barra, mojito y desafío al gobierno central. La logia le ha abierto expediente propio por su capacidad para girar cualquier escándalo a un sitio nuevo.

El archivo registra que lleva un escapulario de la Almudena envuelto en celofán de un paquete de tabaco rubio comprado en Sol en mayo del 2020, durante la operación de los hoteles medicalizados. Cada mañana le encarga al perro Pecas que olisquee la prensa antes de hojearla — si el animal estornuda, no la lee. Su despacho contiene una pequeña efigie de Manuel Fraga sobre la mesa, sin tarjeta de visita.

Los expedientes barriobajeros recogen, además, que Ayuso celebra cada Nochebuena un mini-aquelarre privado en una sala de la Real Casa de Correos con cuatro invitadas fijas — una vidente del Rastro, una vidente del Pilar, una azafata jubilada de Iberia y una taquillera del Reina Victoria — durante el cual se decide la grilla mediática de enero. La logia ha localizado fotografías muy borrosas tomadas desde un balcón frontero, en las que se aprecia humo verde sobre la chimenea pese a que el edificio no la tiene. La versión oficial atribuye el humo a fuegos artificiales fuera de calendario.`,
    affinities: {
      1: 3, 3: 0, 7: 1, 11: 1, 14: 3, 21: 0, 25: 0, 27: 2,
      28: 0, 30: 3, 32: 1, 34: 1, 36: 0, 41: 2, 45: 2, 50: 1,
      54: 0, 58: 2, 60: 0, 63: 0, 67: 3, 76: 1, 79: 2, 82: 2,
    },
  },

  {
    id: "puigdemont",
    name: "Carles Puigdemont i Casamajó",
    epitaph: "Junts, expresident Generalitat 2016–2017. Exilio en Waterloo. 1-O.",
    justification: `Periodista de Amer, alcalde de Girona, expresident de la Generalitat tras la dimisión de Mas, organizador del referéndum del 1 de octubre de 2017 y de la subsiguiente declaración unilateral de independencia. Huyó a Bélgica esa misma semana y desde entonces opera desde Waterloo, donde mantiene una casa-fortín que la prensa llama La Casa de la República. Lleva siete años fugitivo según unos, exiliado según él, ligeramente mítico para casi todos.

El archivo ha establecido que cada víspera de Sant Jordi recibe en su jardín la visita de tres ancianas del Empordà que le entregan una rosa envuelta en papel de calco con un número distinto cada año. Se cree que el número indica cuántos meses faltan para su próximo intento de regreso, aunque la serie es notoriamente arrítmica. Conserva un mapa de Cataluña pintado a mano en pizarra de tejado, sobre el que cada noche traza con tiza las posiciones de sus enemigos jurados y de sus enemigos amados, que a menudo son los mismos.

Los expedientes ampurdaneses recogen, sin garantía notarial, que Puigdemont mantiene una correspondencia mensual con el espíritu de Francesc Macià mediante un sistema de espejo ahumado y ouija catalanizada en grafía pre-fabriana; las sesiones se celebran a las 23:14 en punto, hora belga, y duran exactamente cuarenta y siete minutos. La logia recoge además que el president exiliado guarda en una caja de plata un mechón de pelo cortado a sí mismo el 27 de octubre de 2017, sobre el cual jura no afeitarse la barba hasta que el mechón crezca de nuevo. La barba, observan los archiveros, no ha menguado.`,
    affinities: {
      1: 0, 4: 3, 7: 3, 14: 1, 17: 1, 21: 2, 25: 0, 27: 0,
      35: 2, 41: 0, 42: 2, 46: 1, 47: 3, 48: 1, 51: 0, 52: 2,
      53: 2, 58: 2, 64: 2, 68: 3, 73: 3, 85: 0, 89: 0, 90: 3,
    },
  },

  {
    id: "otegi",
    name: "Arnaldo Otegi Mondragón",
    epitaph: "EH Bildu, secretario general. Pasado en HB. Inhabilitado y reciclado.",
    justification: `Militante histórico de la izquierda abertzale, condenado en varios procesos por pertenencia a banda armada, inhabilitado, secretario general de Sortu y posteriormente de EH Bildu. Tras décadas en la periferia volvió al centro del tablero negociando con el PSOE el respaldo a Sánchez en investiduras sucesivas. Camisa abierta, retórica de obrero, sonrisa estrecha que la logia ha tipificado como sonrisa de número par.

Los archivos registran que pasa todos los solsticios de invierno en una cueva del macizo de Anboto, montaña asociada en el folklore vasco a la dama del Mari, donde dialoga con sombras propias y prepara el guión del año entrante. Lleva siempre encima una nuez de Markina vaciada y pulida que utiliza para anestesiar el oído izquierdo cuando los periodistas le preguntan sobre el pasado. Dijo que no celebraba la muerte de Carrero Blanco y la frase quedó archivada en sección de neutralidades calculadas.`,
    affinities: {
      4: 1, 6: 3, 12: 0, 14: 2, 17: 2, 24: 1, 25: 2, 27: 0,
      29: 2, 30: 3, 33: 0, 38: 1, 39: 2, 41: 0, 47: 3, 51: 3,
      52: 2, 60: 2, 65: 1, 69: 2, 71: 1, 72: 2, 77: 0, 89: 0,
    },
  },

  {
    id: "errejon",
    name: "Íñigo Errejón Galván",
    epitaph: "Más País / Sumar. Cofundador de Podemos. Dimitido en octubre de 2024.",
    justification: `Politólogo de la Complutense, cofundador de Podemos con Iglesias, ruptura pública en 2018, fundación de Más País y posterior incorporación a Sumar, donde fue portavoz parlamentario hasta su dimisión en octubre de 2024 tras varias acusaciones públicas. Su trayectoria pasa de teórico del populismo de izquierdas a víctima de su propio discurso, en un arco que la logia archiva bajo la signatura caída en la propia red.

Los archivos menores recuerdan que llevaba una libreta Moleskine donde anotaba citas de Laclau con la mano izquierda y citas de Maquiavelo con la derecha, en un sistema personal que él llamaba bilateralidad teórica. Tras la dimisión, una versión sostiene que se retiró a un pueblo de la sierra norte de Madrid donde estudia el silencio bajo la dirección de una psicoterapeuta cuyo nombre no consta. La libreta sigue en alguna parte.`,
    affinities: {
      3: 2, 11: 0, 12: 1, 13: 3, 26: 0, 27: 1, 30: 1, 34: 1,
      45: 3, 46: 3, 48: 1, 52: 0, 56: 0, 58: 1, 60: 2, 65: 3,
      67: 1, 72: 1, 76: 1, 80: 2, 84: 1, 87: 2, 88: 0, 89: 3,
    },
  },

  {
    id: "olona",
    name: "Macarena Olona Choclán",
    epitaph: "Ex-Vox. Andaluza por elección. Salida abrupta del partido en 2022.",
    justification: `Abogada del Estado, granadina por adopción y andaluza por estrategia, fue diputada y portavoz adjunta de Vox hasta su candidatura a la Junta de Andalucía en 2022, donde obtuvo un resultado discreto y abandonó el partido pocos meses después alegando razones de salud. Desde entonces orbita en círculos identitarios sin escaño formal, con apariciones periódicas en programas de tarde y en plazas pequeñas con su propia marca personal.

El archivo le atribuye un anillo de oro rojo con una piedra de obsidiana del Cabo de Gata que, según una de las versiones que se barajan, le fue entregado en una recepción privada en Cádiz en 2019 por una hermandad costera llamada El Soto de Roche. Cada vez que pronuncia la palabra patria en mitin, los oyentes de las dos primeras filas notan un ligero descenso en la temperatura corporal. La cifra exacta no consta.`,
    affinities: {
      6: 3, 7: 1, 14: 0, 17: 0, 21: 1, 25: 0, 26: 0, 27: 2,
      30: 3, 36: 3, 41: 2, 42: 1, 45: 2, 48: 0, 50: 0, 52: 2,
      58: 3, 66: 3, 68: 0, 69: 3, 75: 1, 76: 2, 79: 3, 89: 2,
    },
  },

  {
    id: "rufian",
    name: "Gabriel Rufián Romero",
    epitaph: "ERC, portavoz Congreso. Catalán de familia andaluza. Mítines virales.",
    justification: `Nacido en Santa Coloma de Gramenet de padres andaluces, antiguo administrativo, irrumpió en el Congreso en 2016 con el cartel del 155 y desde entonces sostiene en solitario uno de los registros oratorios más estridentes del hemiciclo. Portavoz de ERC en Madrid en una legislatura tras otra, articula la peculiar paradoja del independentista catalán castellanoparlante que opera en sede del Estado al que quiere abandonar.

El archivo señala que antes de cada intervención plena cumple un rito breve: traga aire en tres tiempos, mira un punto fijo en el techo de la cámara y murmura el nombre de su abuela. Conserva en el despacho un cartel original del 155 doblado en ocho y guardado en una caja fuerte de doble combinación. La segunda combinación nunca la ha dicho a nadie. La primera, sí.`,
    affinities: {
      11: 0, 17: 0, 22: 3, 25: 1, 27: 2, 28: 3, 30: 0, 34: 0,
      41: 0, 42: 3, 45: 3, 46: 0, 47: 0, 48: 2, 52: 2, 58: 1,
      60: 1, 63: 0, 65: 1, 75: 2, 76: 1, 80: 0, 82: 2, 89: 0,
    },
  },

  {
    id: "colau",
    name: "Ada Colau Ballano",
    epitaph: "Comuns, ex-alcaldesa Barcelona 2015–2023. Activista PAH. Trenzas y rastas.",
    justification: `Activista de la Plataforma de Afectados por la Hipoteca durante la crisis, saltó a la alcaldía de Barcelona en mayo de 2015 al frente de Barcelona en Comú, repitió en 2019 y la perdió por la mínima en 2023 ante Collboni y Trias. Dos legislaturas que llevaron al consistorio una estética y un programa que mezclaban municipalismo, feminismo y conflicto permanente con la patronal hotelera y el Port.

El archivo le imputa un colgante de plata reciclada con un símbolo ibérico mal interpretado por su propio orfebre, que ella conserva por afecto. Cada Sant Jordi reparte rosas en el barrio de la Salut a un círculo de vecinas con las que comparte una conversación pendiente desde el 15-M. La frase exacta de esa conversación no figura en ningún archivo, pero se cree que tiene que ver con un balcón y una pancarta.`,
    affinities: {
      6: 0, 7: 2, 11: 0, 14: 1, 17: 1, 22: 2, 25: 2, 27: 0,
      30: 2, 33: 1, 41: 0, 47: 3, 48: 2, 58: 1, 59: 2, 60: 2,
      63: 0, 67: 0, 76: 3, 80: 2, 85: 0, 87: 1, 88: 1, 90: 0,
    },
  },

  {
    id: "felipe",
    name: "Felipe González Márquez",
    epitaph: "PSOE, presidente del Gobierno 1982–1996. Suresnes, OTAN, GAL, jaguar y bonsáis.",
    justification: `Abogado laboralista sevillano, secretario general del PSOE en el congreso de Suresnes (1974) en el exilio francés, ganó cuatro elecciones consecutivas entre 1982 y 1993 con mayoría absoluta en tres de ellas. Su mandato cubre la entrada en la OTAN (referéndum de 1986), la expansión del estado del bienestar, los Juegos Olímpicos de Barcelona, la Expo de Sevilla, los GAL y la corrupción del último tramo. Cría bonsáis y caza con afición conocida.

Los archivos del Aljarafe sostienen que en Suresnes fue ungido sobre una alfombra prestada con aceite de oliva de un olivar de la familia de Alfonso Guerra, con un esquema litúrgico improvisado por dos militantes vascos que se hicieron pasar por canónigos. Conserva en la finca de Ayamonte una piel de jaguar regalada por un antiguo presidente americano, sobre la que dice que tiene mejores ideas que sobre un sofá. La piel ha sido reparada dos veces, una de ellas en discreción absoluta.`,
    affinities: {
      1: 3, 5: 0, 6: 0, 11: 2, 12: 0, 13: 1, 14: 0, 17: 0,
      26: 0, 27: 0, 31: 0, 34: 1, 37: 0, 41: 0, 45: 3, 48: 0,
      49: 0, 53: 1, 54: 0, 55: 1, 57: 0, 65: 2, 68: 0, 86: 0,
    },
  },

  {
    id: "aznar",
    name: "José María Aznar López",
    epitaph: "PP, presidente del Gobierno 1996–2004. Las Azores. FAES. Bigote.",
    justification: `Inspector de Hacienda, presidente de Castilla y León en 1987, secretario general y luego presidente del PP, ganó las elecciones de 1996 por la mínima y las de 2000 por mayoría absoluta. Su segundo mandato lo definen la entrada de España en la guerra de Irak tras la cumbre de las Azores (marzo 2003) y la gestión de los atentados del 11-M tres días antes de las elecciones de marzo de 2004, que perdió contra pronóstico. Conserva un acento castellano que cultiva con esmero.

Los archivos señalan que antes de viajar a las Azores consultó un péndulo de oligisto rojo extraído de las minas de Almadén, manejado por un asesor que aparece en las nóminas de FAES bajo el epígrafe gabinete documental. El péndulo, dicen, giró en sentido horario tres veces y se detuvo en seco, lo que el asesor interpretó como vía libre. Conserva el bigote idéntico desde 1989 y rechaza por sistema cualquier sugerencia de retocarlo, incluso en visita a barberías ajenas.`,
    affinities: {
      1: 0, 4: 0, 5: 0, 6: 0, 7: 1, 9: 0, 11: 2, 14: 0,
      17: 0, 20: 0, 21: 0, 26: 0, 29: 0, 30: 3, 32: 1, 35: 2,
      45: 2, 50: 0, 52: 2, 55: 2, 57: 0, 60: 1, 65: 0, 76: 1,
    },
  },

  {
    id: "zapatero",
    name: "José Luis Rodríguez Zapatero",
    epitaph: "PSOE, presidente del Gobierno 2004–2011. Ceja, Alianza de Civilizaciones, crisis.",
    justification: `Leonés, diputado por León desde 1986, ganó las primarias del PSOE en julio del 2000 por sorpresa y las elecciones generales de marzo de 2004 tres días después del 11-M. Su mandato cubre la retirada de las tropas de Irak, la Ley de matrimonio igualitario (2005), el primer estatuto catalán reformado y, en el segundo tramo, la crisis financiera global que sigue marcando su biografía. Su gesto identitario es la ceja izquierda alzada en ángulo levemente diagonal.

Según los archivos leoneses, en la madrugada del 14 de marzo del 2004 acudió a una capilla de Valdoré donde una tía abuela le entregó un rosario de cuentas de azabache de Astorga. Cada vez que pronuncia la palabra diálogo en discurso de investidura, una de las cuentas pierde un grado de brillo, según mediciones realizadas por un cura jubilado de Sahagún que asegura tener documentado el fenómeno desde 2006.`,
    affinities: {
      1: 1, 6: 3, 14: 1, 17: 2, 21: 3, 22: 0, 26: 1, 27: 1,
      29: 1, 30: 1, 33: 1, 41: 3, 45: 3, 48: 1, 50: 1, 52: 0,
      55: 3, 57: 1, 58: 2, 63: 1, 65: 1, 70: 1, 87: 1, 89: 3,
    },
  },

  {
    id: "rajoy",
    name: "Mariano Rajoy Brey",
    epitaph: "PP, presidente del Gobierno 2011–2018. Registrador. Moción de censura 2018.",
    justification: `Registrador de la propiedad, gallego de Santiago, ministro con Aznar en tres carteras, presidente del PP desde 2004, ganó las elecciones de 2011 con mayoría absoluta y las de 2016 sin ella. Su mandato cubre la salida de la crisis económica, el procés y la sentencia de la Gürtel, que precipitó la primera moción de censura exitosa de la democracia el 1 de junio de 2018. Su retórica privilegia la espera sobre la decisión, y la frase larga sobre la respuesta directa.

El archivo registra que durante las semanas previas a la moción de censura mantuvo un horario gallego estricto que incluía siesta de cuarenta minutos sobre un cojín de plumas heredado de su padre, también registrador. Conserva en el despacho de Aravaca una piedra del Pico Sacro que recoge cada año en compañía de su mujer, sin ceremonia visible. Dijo que España va bien en 2007 y luego ya no lo dijo.`,
    affinities: {
      1: 1, 7: 1, 9: 1, 11: 3, 13: 2, 14: 0, 16: 3, 22: 0,
      27: 0, 29: 1, 30: 0, 32: 0, 34: 2, 41: 2, 45: 0, 46: 2,
      52: 3, 54: 1, 55: 3, 57: 3, 60: 2, 67: 1, 70: 2, 86: 0,
    },
  },

  {
    id: "suarez",
    name: "Adolfo Suárez González",
    epitaph: "UCD, presidente del Gobierno 1976–1981. Transición. 23-F. Alzheimer.",
    justification: `Avileño, jefe de Movimiento durante el último tramo del franquismo, designado por el rey Juan Carlos en julio de 1976 para pilotar la Transición. Aprobó la Ley para la Reforma Política (referéndum de diciembre del 76), legalizó el PCE en abril del 77 con un coste interno enorme, ganó las primeras elecciones democráticas en junio del 77, y aguantó sentado en su escaño durante el 23-F mientras los demás se tiraban al suelo. Diagnosticado de Alzheimer en sus últimos años, falleció en 2014.

El archivo guarda que llevaba un crucifijo de plata heredado de su madre en el bolsillo interior izquierdo durante todas las sesiones plenarias relevantes. Dijo a Mario Onaindía la noche que legalizó el PCE: lo legalizo porque tengo miedo, frase no incluida en las biografías oficiales pero registrada por la logia en su signatura V/77. Conserva, en una caja del archivo familiar, una hoja arrancada de su agenda con la palabra confianza escrita siete veces.`,
    affinities: {
      6: 0, 13: 2, 17: 2, 21: 0, 27: 0, 29: 0, 30: 1, 31: 0,
      34: 2, 41: 2, 42: 1, 43: 0, 45: 0, 46: 2, 48: 3, 49: 1,
      52: 0, 55: 0, 57: 3, 63: 0, 70: 0, 76: 3, 86: 1, 90: 0,
    },
  },

  {
    id: "fraga",
    name: "Manuel Fraga Iribarne",
    epitaph: "AP/PP, ministro con Franco. Presidente Xunta 1990–2005. La calle es mía.",
    justification: `Catedrático lucense, ministro de Información y Turismo entre 1962 y 1969, ministro de Gobernación con Arias Navarro en 1975 (Vitoria, los disparos), fundador de Alianza Popular en 1976, ponente constitucional, presidente de la Xunta de Galicia entre 1990 y 2005 con cuatro mayorías absolutas. Su frase la calle es mía, pronunciada en febrero de 1976 ante una protesta en Madrid, lo definió políticamente para tres décadas. Falleció en 2012 con noventa años.

El archivo le atribuye una capacidad descomunal para resistir el alcohol —se le citan partidas de mus en Las Marismas hasta el amanecer con sucesivos vasos de Cardenal Mendoza— y un pacto verbal con el ánima de un coronel decimonónico que se le aparecía en el balcón del Pazo de Raxoi en noches de viento sur. Cuando perdió la presidencia gallega en 2005, recogió de la mesa una llave de plata heredada que nunca abrió cerradura conocida y la guardó en el sobre interior de su chaqueta.`,
    affinities: {
      6: 0, 7: 1, 11: 2, 17: 0, 21: 1, 28: 0, 29: 0, 30: 3,
      32: 0, 39: 0, 41: 2, 45: 2, 48: 0, 50: 2, 52: 2, 55: 3,
      57: 0, 65: 1, 68: 0, 70: 2, 76: 0, 82: 1, 86: 0, 90: 2,
    },
  },

  {
    id: "anguita",
    name: "Julio Anguita González",
    epitaph: "IU, coordinador 1989–2000. El Califa de Córdoba. Maestro, austero, infarto.",
    justification: `Maestro de profesión, alcalde de Córdoba por el PCE entre 1979 y 1986, coordinador general de Izquierda Unida entre 1989 y 2000. Sufrió un infarto en mitad de la campaña del 2000 y dejó la primera línea. Es recordado por la frase programa, programa, programa y por la fórmula de la pinza, su acuerdo táctico con el PP de Aznar contra el felipismo a finales de los 90. Vivió siempre con sueldo de maestro en un piso modesto de Córdoba.

Los archivos califales le atribuyen una jarra de barro cordobés donde guardaba cada mañana un café negro filtrado tres veces, ritual que repitió hasta su fallecimiento en 2020. Conservaba en su biblioteca un volumen de Marx anotado con la letra del padre, también maestro, y se le imputa el haber sostenido en un debate radiofónico que el comunismo es una cuestión de horario, no de teoría. La cita está parcialmente documentada y la logia la conserva en signatura aparte.`,
    affinities: {
      1: 3, 3: 1, 11: 0, 12: 2, 14: 0, 17: 0, 22: 0, 26: 0,
      27: 0, 30: 0, 41: 2, 42: 2, 45: 0, 48: 3, 49: 1, 52: 2,
      53: 2, 54: 0, 57: 1, 58: 3, 65: 3, 76: 0, 80: 2, 85: 3,
    },
  },

  {
    id: "aguirre",
    name: "Esperanza Aguirre Gil de Biedma",
    epitaph: "PP, presidenta CAM 2003–2012. La lideresa. Bolso, escándalos, escolta.",
    justification: `Aristócrata madrileña, ministra de Educación con Aznar, presidenta del Senado, presidenta de la Comunidad de Madrid entre 2003 y 2012 tras la maniobra del tamayazo en su investidura inicial, presidenta del PP de Madrid hasta 2016. Dejó la política tras una infracción de tráfico filmada en Gran Vía y varios escándalos de su entorno regional. Su personaje público combina afilada lengua y aire de baronesa carlista. Lleva bolso grande y zapatos sólidos.

Los archivos del barrio de Salamanca registran que llevaba una llave dorada cosida al forro interior del abrigo, recuerdo de su tía abuela, que ella tocaba con el meñique antes de declarar ante la prensa. Su despacho de Cibeles incluía un cuadro pequeño de un cazador anónimo del XIX cuya mirada cambiaba según la hora, según testimonios de tres jefes de gabinete sucesivos. Aguirre dijo que ese cuadro era buena gente y se lo llevó al jubilarse.`,
    affinities: {
      1: 3, 7: 1, 9: 2, 11: 0, 14: 3, 17: 0, 22: 1, 25: 0,
      27: 2, 30: 3, 36: 0, 41: 2, 45: 2, 50: 0, 52: 2, 55: 2,
      59: 0, 60: 0, 65: 0, 68: 1, 73: 1, 76: 2, 79: 2, 84: 0,
    },
  },

  {
    id: "franco",
    name: "Francisco Franco Bahamonde",
    epitaph: "Dictador 1939–1975. Generalísimo. Pardo, caza, Pazo de Meirás.",
    justification: `Militar africanista, golpista en julio de 1936, vencedor de la guerra civil en abril de 1939 y jefe del Estado durante treinta y seis años hasta su fallecimiento en noviembre de 1975. Concentró todos los poderes — jefatura del Estado, presidencia del Gobierno, mando de los tres ejércitos, jefatura del Movimiento — y diseñó la transición monárquica que se ejecutó tras su muerte. Vivió en el Pardo, cazó en Sierra Morena, pescó en Galicia, y firmaba penas de muerte hasta semanas antes de morir.

Los archivos profundos sostienen, sin entrar en el grado de verificación, que pidió de niño la mano momificada de Santa Teresa al cabildo de Alba de Tormes y que la consultaba en la madrugada antes de las decisiones graves, frotando con el dedo índice el pulgar momificado. La reliquia, transferida al Pardo en 1937, fue devuelta al monasterio en 1975 sin ceremonia. Conserva la logia un guante negro suyo encontrado en un cajón del Pazo de Meirás con tres pelos canosos del propio caudillo y el olor débil del agua de colonia Atkinson.`,
    affinities: {
      1: 0, 4: 1, 5: 0, 7: 0, 8: 0, 9: 0, 13: 0, 14: 0,
      17: 0, 20: 0, 21: 1, 24: 0, 27: 0, 29: 0, 33: 2, 38: 0,
      39: 0, 41: 2, 42: 1, 45: 2, 49: 2, 52: 2, 59: 0, 88: 1,
    },
  },

  {
    id: "pasionaria",
    name: "Dolores Ibárruri Gómez 'La Pasionaria'",
    epitaph: "PCE, diputada 1936, exilio URSS 1939–1977. No pasarán.",
    justification: `Vasca de Gallarta, hija y mujer de mineros, militante del PCE desde su fundación, diputada por Asturias en 1936, autora del discurso del no pasarán pronunciado por la radio en julio del 36. Tras la derrota partió al exilio en la Unión Soviética en marzo del 39, donde permaneció hasta 1977. Regresó a España con la legalización del PCE y fue elegida diputada por Asturias en las primeras elecciones democráticas. Falleció en Madrid en 1989, vestida de negro hasta el final.

El archivo registra que conservó hasta su muerte una pequeña cruz de cobre en un cajón cerrado con llave, contradicción privada que ella nunca explicó. Se le atribuye una memoria fonográfica capaz de recordar conversaciones de cinco años atrás palabra por palabra, virtud que cultivaba con un ritual de respiración aprendido en Moscú en los años cincuenta. Su voz, dicen las grabaciones, baja medio tono cada vez que cita la palabra fascismo.`,
    affinities: {
      1: 3, 6: 0, 7: 2, 11: 0, 14: 0, 17: 0, 21: 1, 24: 0,
      26: 0, 27: 2, 30: 3, 41: 2, 42: 3, 45: 2, 47: 0, 48: 2,
      52: 2, 55: 3, 58: 3, 63: 0, 65: 3, 70: 0, 71: 3, 88: 1,
    },
  },

  {
    id: "carrero",
    name: "Luis Carrero Blanco",
    epitaph: "Almirante, presidente del Gobierno junio–diciembre 1973. Atentado de ETA.",
    justification: `Marino de carrera, hombre de confianza de Franco durante tres décadas, subsecretario de la Presidencia desde 1941, vicepresidente del Gobierno desde 1967, presidente del Gobierno por separación de cargos en junio de 1973. Fue asesinado por ETA el 20 de diciembre de 1973 en la calle Claudio Coello de Madrid, mediante una carga de explosivo bajo el asfalto que lanzó su Dodge 3700 por encima de un edificio. La explosión se conoce coloquialmente como la ascensión.

Los archivos cósmicos sostienen, sin verificación oficial, que el almirante no se detuvo en la órbita prevista por la física newtoniana y que sigue trazando una órbita irregular en torno a Júpiter desde el solsticio de invierno del 73, con paso por el perihelio cada once años aproximados. Su despacho en Castellana, ahora restaurado para uso ministerial, conserva un calendario de mesa abierto en la página del 20 de diciembre que ningún funcionario se ha atrevido a pasar.`,
    affinities: {
      4: 1, 7: 0, 9: 0, 14: 0, 17: 0, 21: 1, 26: 0, 28: 0,
      29: 0, 33: 2, 39: 0, 41: 2, 45: 2, 52: 2, 57: 0, 70: 0,
      72: 0, 73: 1, 75: 1, 76: 0, 82: 1, 85: 2, 86: 0, 88: 1,
    },
  },

  {
    id: "azana",
    name: "Manuel Azaña Díaz",
    epitaph: "Izquierda Republicana, presidente del Gobierno 1931–33, presidente Rep. 1936–39. Exilio Pirineo.",
    justification: `Alcalaíno, escritor, presidente del Ateneo de Madrid, ministro de la Guerra en el primer gobierno republicano en 1931, presidente del Gobierno entre 1931 y 1933, presidente de la República desde mayo de 1936 hasta su dimisión en febrero de 1939 desde Collonges-sous-Salève. Murió en Montauban en noviembre de 1940. Dejó La velada en Benicarló y unos diarios que son la mejor prosa política del XX español.

Los archivos pirenaicos recuerdan que cruzó la frontera con un ejemplar empolvado de Spinoza en la maleta y que en Montauban se hizo amigo de un canónigo francés con el que jugaba al ajedrez en silencio. Conservaba un encendedor de plata mate, regalo de Cipriano de Rivas Cherif, que tras su muerte fue enviado a su viuda y que la viuda escondió en un libro. El libro está en una biblioteca privada de Toulouse, registrado bajo la signatura A/40/Δ.`,
    affinities: {
      4: 1, 6: 0, 7: 3, 17: 1, 22: 2, 26: 0, 27: 0, 28: 0,
      29: 2, 30: 1, 41: 0, 42: 0, 45: 3, 47: 0, 48: 1, 51: 3,
      52: 0, 53: 2, 60: 2, 65: 2, 68: 0, 76: 1, 80: 2, 87: 1,
    },
  },

  {
    id: "durruti",
    name: "Buenaventura Durruti Domínguez",
    epitaph: "CNT, anarquista. Muerto en Madrid, 20 de noviembre de 1936.",
    justification: `Leonés, militante anarquista desde adolescente, miembro del grupo Los Solidarios y luego de Los Justicieros, exiliado en Francia y Argentina en los años veinte. Volvió en 1931, lideró la organización CNT-FAI en Barcelona, formó la Columna Durruti en julio de 1936 para defender Madrid, donde murió por disparo nunca aclarado el 20 de noviembre, el mismo día que José Antonio Primo de Rivera, coincidencia que la logia archiva con doble subrayado.

El archivo registra que llevaba siempre una bala de plata en el bolsillo derecho, regalo de un compañero gitano de Hospitalet, que él decía guardar no por superstición sino por estadística. Pronunció la frase llevamos un mundo nuevo en nuestros corazones en una entrevista con la periodista Pierre van Paasen en agosto del 36. La frase corre tatuada en hombros y antebrazos por todo el mundo desde entonces. La bala se perdió en Madrid y no consta su paradero.`,
    affinities: {
      1: 0, 6: 3, 7: 2, 9: 1, 12: 3, 13: 0, 14: 0, 17: 0,
      24: 2, 26: 0, 27: 2, 29: 0, 30: 3, 33: 0, 41: 0, 42: 3,
      45: 2, 47: 3, 51: 1, 58: 3, 60: 2, 69: 0, 72: 3, 88: 1,
    },
  },

  {
    id: "joseantonio",
    name: "José Antonio Primo de Rivera y Sáenz de Heredia",
    epitaph: "Falange, fundador 1933. Fusilado en Alicante, noviembre de 1936. Mito franquista.",
    justification: `Aristócrata madrileño, hijo del dictador Miguel Primo de Rivera, abogado, fundador de Falange Española en octubre de 1933 con el mitin del Teatro de la Comedia. Detenido en marzo de 1936, juzgado en Alicante por rebelión y fusilado el 20 de noviembre de 1936. La dictadura franquista lo convirtió en el ausente, figura central de la liturgia falangista, con su nombre escrito a tiza en miles de fachadas de iglesia hasta los años setenta.

Los archivos del SEU recogen que en la celda de Alicante mantuvo correspondencia con varios destinatarios en clave cuasi-numerológica basada en versículos de la Imitación de Cristo, sistema que él llamaba notación del descenso. La medalla de oro de Falange con su nombre fue grabada por un orfebre judío sefardí que se llevó a la tumba un detalle del troquel que aún hace que las copias modernas pierdan brillo más rápido de lo debido.`,
    affinities: {
      6: 3, 7: 0, 11: 1, 13: 0, 14: 0, 17: 0, 21: 1, 24: 1,
      26: 2, 27: 2, 28: 0, 29: 0, 30: 3, 39: 0, 41: 2, 42: 1,
      45: 3, 47: 2, 51: 3, 52: 2, 65: 2, 75: 1, 85: 2, 89: 0,
    },
  },

  {
    id: "olivares",
    name: "Gaspar de Guzmán, Conde-Duque de Olivares",
    epitaph: "Valido de Felipe IV, 1622–1643. Unión de Armas. Caída en Loeches.",
    justification: `Sevillano de la casa Guzmán, valido omnímodo de Felipe IV durante veintiún años, arquitecto del proyecto de la Unión de Armas para reforzar la Monarquía Hispánica con un ejército y un fisco compartidos por todos los reinos. La Revolta dels Segadors catalana de 1640 y la separación de Portugal el mismo año marcaron el principio de su caída, completada con el destierro a Loeches en 1643 y la muerte en Toro dos años después en estado de desequilibrio mental, según los cronistas.

Los archivos áulicos conservan que Olivares mandaba consultar la posición exacta de Saturno antes de cada decisión militar importante, con un astrónomo flamenco a sueldo que firmaba sus dictámenes en latín con la sola inicial Ñ. Tras su caída, ese astrónomo desapareció sin dejar rastro y solo se sabe que un pariente suyo trabajó después para un cardenal francés en París. Olivares murió rezando entre delirios el nombre de su hijo bastardo Enrique.`,
    affinities: {
      3: 1, 4: 0, 9: 0, 17: 0, 27: 0, 29: 0, 38: 0, 41: 0,
      45: 2, 50: 0, 52: 1, 57: 0, 60: 0, 65: 2, 70: 0, 72: 1,
      73: 2, 76: 0, 80: 2, 81: 0, 82: 1, 84: 0, 86: 3, 90: 2,
    },
  },

  {
    id: "godoy",
    name: "Manuel Godoy y Álvarez de Faria",
    epitaph: "Príncipe de la Paz, valido de Carlos IV 1792–1808. Motín de Aranjuez.",
    justification: `Extremeño de Castuera, ingresó en la Guardia de Corps en 1784, conquistó la simpatía personal de los reyes Carlos IV y María Luisa y se convirtió en primer ministro a los veinticinco años, en 1792. Firmó la paz de Basilea con Francia (1795) que le valió el título de Príncipe de la Paz, gestionó el tratado de San Ildefonso y la alianza con la Francia napoleónica que culminó en Trafalgar y en la entrada de Murat en España. El Motín de Aranjuez en marzo de 1808 lo derribó. Murió pobre en París en 1851.

Los archivos áulicos sostienen, sin endosar la versión, que Godoy heredó de María Luisa de Parma un anillo con un cabello rubio de la propia reina trenzado bajo cristal, anillo que llevaba puesto durante el motín y que no se le encontró cuando fue detenido en el desván de palacio. Tras su muerte, en la habitación de un hotel modesto del bulevar Saint-Germain, se encontró un cuaderno con la palabra paz escrita doscientas veces sin tachadura.`,
    affinities: {
      1: 0, 6: 0, 11: 2, 12: 0, 13: 1, 17: 1, 27: 1, 36: 2,
      41: 2, 43: 3, 45: 1, 50: 3, 53: 2, 57: 0, 58: 2, 60: 0,
      65: 2, 67: 3, 68: 3, 73: 0, 75: 0, 81: 0, 87: 2, 89: 1,
    },
  },

  {
    id: "canovas",
    name: "Antonio Cánovas del Castillo",
    epitaph: "Conservador, presidente del Gobierno seis veces. Arquitecto de la Restauración. Asesinado en Mongat 1897.",
    justification: `Malagueño, historiador y político, arquitecto del régimen de la Restauración tras la caída del cantonalismo en 1874, autor del sistema de turno pacífico de partidos con Sagasta. Presidente del Gobierno en seis legislaturas distintas entre 1874 y 1897. Fue asesinado el 8 de agosto de 1897 por el anarquista italiano Michele Angiolillo en el balneario de Santa Águeda, en Mondragón, mientras tomaba las aguas. Llevaba puesto un sombrero claro.

Los archivos del Ateneo registran que Cánovas redactaba sus discursos sobre cuaderno de hule comprado al mismo papelero de la calle Hortaleza durante treinta años, y que ese papelero perdió la clientela un mes antes del atentado por una discusión sobre el precio de la tinta sepia. Conservaba en su despacho una pluma de pavo real regalada por la reina regente que jamás utilizó porque, decía, manchaba el folio con un brillo que no era propio. La pluma se perdió en el inventario tras el balneario.`,
    affinities: {
      1: 1, 6: 0, 9: 0, 17: 0, 22: 2, 26: 1, 27: 0, 29: 1,
      33: 0, 38: 1, 41: 2, 45: 0, 48: 1, 52: 3, 57: 0, 60: 0,
      65: 2, 67: 0, 68: 1, 80: 0, 82: 1, 84: 1, 86: 1, 90: 1,
    },
  },

  {
    id: "prim",
    name: "Juan Prim y Prats",
    epitaph: "General, conde de Reus, presidente del Gobierno 1869–1870. Asesinado en Madrid.",
    justification: `Reusense, militar carlista convertido en liberal progresista, conde de Reus tras la batalla de los Castillejos en la guerra de África (1860). Lideró el pronunciamiento de septiembre de 1868 que destronó a Isabel II, gestionó la búsqueda del rey extranjero y eligió a Amadeo de Saboya. Murió por disparos sin esclarecer el 30 de diciembre de 1870 en la calle del Turco de Madrid, días antes de la llegada de Amadeo. El expediente del crimen sigue abierto en sentido estricto y en sentido alegórico.

El archivo militar sostiene que Prim guardaba bajo el colchón de la cama del Ministerio de la Guerra un sobre con tres nombres escritos a lápiz, sobre que desapareció la noche del atentado y que jamás se ha recuperado. Llevaba en el bolsillo del uniforme un guijarro liso de la playa de Salou, regalo de su madre, que se encontró intacto entre los efectos personales devueltos a la familia. El guijarro se conserva, sí, en la casa familiar de Reus.`,
    affinities: {
      1: 0, 6: 0, 7: 0, 14: 0, 17: 0, 24: 1, 26: 0, 27: 2,
      29: 0, 30: 1, 33: 0, 37: 0, 41: 2, 42: 0, 45: 2, 48: 0,
      52: 2, 53: 2, 65: 2, 67: 0, 73: 3, 78: 2, 86: 0, 89: 0,
    },
  },
];

// Verificación rápida: deberían ser 30 políticos.
// console.log(POLITICIANS.length);
