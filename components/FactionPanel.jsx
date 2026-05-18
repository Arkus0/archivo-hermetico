"use client";

import { colors, fontDisplay, fontMono } from "@/lib/constants.js";
import { FACTIONS, getDispositionTier } from "@/lib/factions.js";

function ReputationBar({ value }) {
  const cells = [-3, -2, -1, 0, 1, 2, 3];
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {cells.map((c) => {
        const active = c === Math.max(-3, Math.min(3, value | 0));
        const color = c < 0 ? "#7a2721" : c > 0 ? "#2e5f25" : colors.ink;
        return <div key={c} style={{ width: 12, height: 12, border: `1px solid ${colors.ink}`, background: active ? color : "transparent", opacity: active ? 1 : 0.4 }} />;
      })}
    </div>
  );
}

export default function FactionPanel({ reputation }) {
  const factionRep = reputation?.factions || {};
  return (
    <div style={{ border: `1px solid ${colors.ink}`, background: colors.paperLight, boxShadow: `3px 3px 0 ${colors.bordo}`, padding: 14 }}>
      <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 3, color: colors.bordo, textTransform: "uppercase", marginBottom: 10 }}>Reputación · facciones</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {Object.values(FACTIONS).map((f) => {
          const v = factionRep[f.id] ?? 0;
          const tier = getDispositionTier(v);
          return (
            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 22, height: 22, borderRadius: 11, background: f.color, color: colors.paperLight, fontFamily: fontDisplay, fontSize: 14, display: "inline-flex", alignItems: "center", justifyContent: "center", border: `1px solid ${colors.ink}` }}>{f.glyph}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fontDisplay, fontSize: 15 }}>{f.name}</div>
                <div style={{ fontFamily: fontMono, fontSize: 9, color: colors.bordoDeep, letterSpacing: 1, textTransform: "uppercase" }}>{tier.short}</div>
              </div>
              <ReputationBar value={v} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
