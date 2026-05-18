"use client";

import { colors, fontDisplay, fontBody, fontMono } from "@/lib/constants.js";
import { GRADE_LABEL } from "@/lib/checks.js";

const KIND_LABEL = {
  critical: "Crítico",
  success: "Éxito",
  fail: "Fallo",
  fumble: "Pifia",
  doom: "Reloj",
  "doom-final": "Caída",
  defensive: "Defensa",
  round: "Ronda",
  info: "Nota",
};

const KIND_COLOR = {
  critical: "#2e5f25",
  success: "#2e5f25",
  fail: "#7a2721",
  fumble: "#5C1820",
  doom: "#A88B3F",
  "doom-final": "#5C1820",
  defensive: "#3F5469",
  round: "#1A1410",
  info: "#1A1410",
};

export default function SceneLog({ log = [] }) {
  return (
    <div style={{ border: `1px solid ${colors.ink}`, background: colors.paperLight, boxShadow: `3px 3px 0 ${colors.bordo}`, padding: 14 }}>
      <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 3, color: colors.bordo, textTransform: "uppercase", marginBottom: 8 }}>Bitácora del expediente</div>
      {log.length === 0 && (
        <p style={{ fontFamily: fontDisplay, fontSize: 14, color: colors.bordoDeep, fontStyle: "italic", margin: 0 }}>Sin anotaciones todavía.</p>
      )}
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6, maxHeight: 280, overflowY: "auto" }}>
        {log.map((entry) => (
          <li key={entry.id} style={{ borderBottom: `1px dashed ${colors.bordoDeep}`, paddingBottom: 4 }}>
            <span style={{ fontFamily: fontMono, fontSize: 9, letterSpacing: 1.5, color: KIND_COLOR[entry.kind] || colors.ink, textTransform: "uppercase", marginRight: 6 }}>
              [r{entry.round}] {KIND_LABEL[entry.kind] || entry.kind}
            </span>
            <span style={{ fontFamily: fontBody, fontSize: 14, color: colors.ink }}>{entry.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
