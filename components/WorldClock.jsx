"use client";

import { colors, fontDisplay, fontMono } from "@/lib/constants.js";

export default function WorldClock({ doom }) {
  const value = doom?.value ?? 0;
  const max = doom?.max ?? 12;
  const pct = (value / max) * 100;
  const thresholds = [3, 6, 9, 12];
  return (
    <div style={{ border: `1px solid ${colors.ink}`, background: colors.paperLight, boxShadow: `3px 3px 0 ${colors.bordo}`, padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 3, color: colors.bordo, textTransform: "uppercase" }}>Reloj de la Logia</div>
        <div style={{ fontFamily: fontDisplay, fontSize: 18 }}>{value}/{max}</div>
      </div>
      <div style={{ position: "relative", height: 18, background: colors.paper, border: `1px solid ${colors.ink}` }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: `repeating-linear-gradient(45deg, ${colors.bordo} 0 6px, ${colors.bordoDeep} 6px 12px)`, transition: "width 0.3s" }} />
        {thresholds.map((t) => {
          const leftPct = (t / max) * 100;
          const crossed = value >= t;
          return (
            <div key={t} style={{ position: "absolute", left: `${leftPct}%`, top: -3, bottom: -3, width: 2, background: crossed ? colors.ink : colors.bordoDeep, opacity: 0.85 }} />
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 6, fontFamily: fontMono, fontSize: 9, letterSpacing: 1.5, color: colors.bordoDeep, textTransform: "uppercase", justifyContent: "space-between" }}>
        <span>3 · filtración</span>
        <span>6 · despertar</span>
        <span>9 · inquisidor</span>
        <span>12 · caída</span>
      </div>
    </div>
  );
}
