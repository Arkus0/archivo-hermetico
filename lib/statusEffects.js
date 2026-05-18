const STATUS = {
  paranoia: { name: "Paranoia", detail: "Oyes pasos donde solo hay eco." },
  bendicion: { name: "Bendición residual", detail: "Una presencia benigna amortigua el daño mental." },
  deuda: { name: "Deuda de sangre", detail: "Alguien te cobrará el pacto, con intereses." },
  obsesion: { name: "Obsesión", detail: "No puedes soltar una pista, aunque te cueste salud." },
  proteccion: { name: "Protección", detail: "Un sello antiguo desvía parte del riesgo." },
};

export function buildStatuses(answers = []) {
  const statuses = [];
  const picks = new Set(answers);
  if (picks.has(3)) statuses.push(STATUS.paranoia);
  if (picks.has(0)) statuses.push(STATUS.proteccion);
  if (picks.has(1) && picks.has(2)) statuses.push(STATUS.obsesion);
  if (answers.length >= 45) statuses.push(STATUS.deuda);
  if (statuses.length === 0) statuses.push(STATUS.bendicion);
  return statuses.slice(0, 3);
}
