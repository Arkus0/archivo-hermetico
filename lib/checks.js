// Sistema de tirada con cuatro grados de éxito.
// Convención: total = d6 + floor(stat/2) + modificadores.
// Grados:
//   - critical: dado≠1 y total ≥ difficulty + 3
//   - success:  total ≥ difficulty (y no crítico)
//   - fail:     total < difficulty (y dado ≠ 1)
//   - fumble:   dado natural = 1 (siempre)

export const GRADES = {
  critical: "critical",
  success: "success",
  fail: "fail",
  fumble: "fumble",
};

export const GRADE_LABEL = {
  critical: "Éxito crítico",
  success: "Éxito",
  fail: "Fallo",
  fumble: "Pifia",
};

export const GRADE_HINT = {
  critical: "La hora vuelve a tu favor.",
  success: "Lo razonable sale.",
  fail: "No basta. Algo se enquista.",
  fumble: "El dado de hueso muestra el uno. Mal augurio.",
};

export function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

// modifiers: array de objetos {value, label}. Solo se suman los `value`.
export function rollCheck({ stat = 5, difficulty = 9, modifiers = [], forcedDie = null } = {}) {
  const dice = forcedDie ?? rollDie();
  const statBonus = Math.floor(stat / 2);
  const modSum = modifiers.reduce((acc, m) => acc + (m?.value || 0), 0);
  const total = dice + statBonus + modSum;
  let grade;
  if (dice === 1) grade = GRADES.fumble;
  else if (total >= difficulty + 3) grade = GRADES.critical;
  else if (total >= difficulty) grade = GRADES.success;
  else grade = GRADES.fail;
  return { dice, statBonus, modSum, total, difficulty, grade, modifiers };
}

export function isSuccessGrade(grade) {
  return grade === GRADES.critical || grade === GRADES.success;
}

export function isFailGrade(grade) {
  return grade === GRADES.fail || grade === GRADES.fumble;
}
