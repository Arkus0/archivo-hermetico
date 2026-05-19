"use client";

import { MiniOrnament } from "./Seal.jsx";
import { colors, fontDisplay, fontMono } from "@/lib/constants.js";

export default function PhaseAnnouncer({ round, maxRounds, daynight, ap, maxAp, objective, onDismiss }) {
  const phaseLabel = daynight === "night" ? "FASE DE NOCHE" : "FASE DE DÍA";
  const pips = Array.from({ length: maxAp }, (_, i) => (i < ap ? "●" : "○")).join(" ");

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,20,16,0.82)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}>
      <div style={{ width: "min(580px, 100%)", background: colors.paper, border: `2px double ${colors.bordo}`, boxShadow: `8px 8px 0 ${colors.ink}`, padding: "36px 32px", textAlign: "center" }}>
        <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 4, color: colors.bordo, textTransform: "uppercase", marginBottom: 8 }}>Archivo Hermético</div>
        <div style={{ margin: "10px 0 6px" }}><MiniOrnament /></div>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 48, margin: "10px 0 4px", fontWeight: "normal", color: colors.ink }}>
          RONDA {round}/{maxRounds}
        </h2>
        <div style={{ fontFamily: fontDisplay, fontSize: 28, color: colors.bordo, marginBottom: 16 }}>{phaseLabel}</div>
        <div style={{ fontFamily: fontMono, fontSize: 12, letterSpacing: 2, color: colors.ink, marginBottom: 6 }}>
          PA disponibles · {pips} ({ap}/{maxAp})
        </div>
        {objective && (
          <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 1, color: colors.bordoDeep, margin: "8px 0 20px", borderTop: `1px dashed ${colors.bordo}`, borderBottom: `1px dashed ${colors.bordo}`, padding: "8px 0", textTransform: "uppercase" }}>
            {objective}
          </div>
        )}
        <button
          onClick={onDismiss}
          style={{ fontFamily: fontMono, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", background: colors.ink, color: colors.paperLight, border: `1px solid ${colors.ink}`, padding: "12px 28px", cursor: "pointer", boxShadow: `3px 3px 0 ${colors.bordo}`, marginTop: 8 }}
        >
          Continuar la partida
        </button>
      </div>
    </div>
  );
}
