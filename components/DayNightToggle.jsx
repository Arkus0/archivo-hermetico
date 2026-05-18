"use client";

import { colors, fontDisplay, fontMono } from "@/lib/constants.js";

export default function DayNightToggle({ daynight, onToggle, disabled }) {
  const isNight = daynight === "night";
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      title={isNight ? "Devolver al día (fin de fase nocturna)" : "Pasar a la fase nocturna"}
      style={{
        fontFamily: fontMono,
        fontSize: 11,
        letterSpacing: 2,
        textTransform: "uppercase",
        background: isNight ? colors.ink : colors.paperLight,
        color: isNight ? colors.paperLight : colors.ink,
        border: `1px solid ${colors.ink}`,
        padding: "10px 14px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        boxShadow: `2px 2px 0 ${colors.bordo}`,
      }}
    >
      <span style={{ fontFamily: fontDisplay, fontSize: 16, marginRight: 8 }}>{isNight ? "☾" : "☉"}</span>
      {isNight ? "Cerrar la noche" : "Abrir la noche"}
    </button>
  );
}
