"use client";

import { colors, fontDisplay, fontMono } from "@/lib/constants.js";
import { POLITICIANS } from "@/lib/politicians.js";
import { getDispositionTier } from "@/lib/factions.js";

const POLITICIAN_NAME_BY_ID = POLITICIANS.reduce((acc, p) => { acc[p.id] = p.name; return acc; }, {});

export default function ReputationLedger({ reputation, npcs }) {
  const polRep = reputation?.politicians || {};
  const knownIds = Object.keys(polRep).filter((id) => polRep[id] !== 0 || npcs?.[id]?.met);
  const meta = (id) => ({ name: POLITICIAN_NAME_BY_ID[id] || id, met: !!npcs?.[id]?.met });

  if (knownIds.length === 0) {
    return (
      <div style={{ border: `1px solid ${colors.ink}`, background: colors.paperLight, boxShadow: `3px 3px 0 ${colors.bordo}`, padding: 14 }}>
        <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 3, color: colors.bordo, textTransform: "uppercase" }}>Memorial de tratos</div>
        <p style={{ fontFamily: fontDisplay, fontSize: 14, color: colors.bordoDeep, fontStyle: "italic", margin: "8px 0 0" }}>Aún no has departido con ningún político del Archivo.</p>
      </div>
    );
  }
  return (
    <div style={{ border: `1px solid ${colors.ink}`, background: colors.paperLight, boxShadow: `3px 3px 0 ${colors.bordo}`, padding: 14 }}>
      <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 3, color: colors.bordo, textTransform: "uppercase", marginBottom: 8 }}>Memorial de tratos</div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
        {knownIds.map((id) => {
          const v = polRep[id] ?? 0;
          const tier = getDispositionTier(v);
          const m = meta(id);
          return (
            <li key={id} style={{ display: "flex", justifyContent: "space-between", gap: 8, fontFamily: fontDisplay, fontSize: 14, borderBottom: `1px dashed ${colors.bordoDeep}`, paddingBottom: 4 }}>
              <span>{m.name}</span>
              <span style={{ fontFamily: fontMono, fontSize: 10, letterSpacing: 1, color: v < 0 ? "#7a2721" : v > 0 ? "#2e5f25" : colors.bordoDeep, textTransform: "uppercase" }}>{tier.short} {v > 0 ? `+${v}` : v}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
