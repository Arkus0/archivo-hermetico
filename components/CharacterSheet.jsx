"use client";

import { Seal } from "./Seal.jsx";
import { colors, fontDisplay, fontBody, fontMono } from "@/lib/constants.js";
import { statKeys, statMeta } from "@/lib/stats.js";
import { buildPerks } from "@/lib/perks.js";
import { buildStatuses } from "@/lib/statusEffects.js";

function StatBar({ value }) {
  const pips = Array.from({ length: 10 }, (_, i) => i < value);
  return <div style={{ display: "flex", gap: "3px" }}>{pips.map((on, i) => <div key={i} style={{ width: "12px", height: "14px", background: on ? colors.bordo : "transparent", border: `1px solid ${on ? colors.bordoDeep : colors.ink}`, opacity: on ? 1 : 0.35 }} />)}</div>;
}

export default function CharacterSheet({ character }) {
  const { politician, stats, matchPercent, fileNumber, answers = [] } = character;
  const keys = statKeys();
  const mundanos = keys.slice(0, 5);
  const ocultistas = keys.slice(5);
  const perks = buildPerks(stats);
  const statuses = buildStatuses(answers);

  const renderRows = (list) => list.map((k) => {
    const meta = statMeta(k);
    return <div key={k} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ minWidth: "170px" }}><div style={{ fontFamily: fontDisplay, fontSize: "18px" }}><span style={{ color: colors.bordo, marginRight: 6 }}>{meta.glyph}</span>{meta.label}</div><div style={{ fontFamily: fontBody, fontSize: "12px", color: colors.bordoDeep, fontStyle: "italic" }}>{meta.description}</div></div>
      <StatBar value={stats[k]} /><div style={{ fontFamily: fontDisplay }}>{stats[k]}/10</div>
    </div>;
  });

  return <div style={{ background: colors.paperLight, border: `1px solid ${colors.ink}`, boxShadow: `4px 4px 0 ${colors.bordo}` }}>
    <div style={{ borderBottom: `1px solid ${colors.ink}`, padding: "20px 24px", background: colors.paper, display: "flex", gap: 20 }}>
      <Seal size={90} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 3, color: colors.bordo, textTransform: "uppercase" }}>Ficha de personaje · Expediente {fileNumber}</div>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 30, margin: 0, fontWeight: "normal" }}>{politician.name}</h2>
        <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.bordoDeep, marginTop: 4 }}>{politician.epitaph}</div>
      </div>
      <div style={{ textAlign: "right" }}><div style={{ fontFamily: fontDisplay, fontSize: 40, color: colors.bordo }}>{matchPercent}%</div><div style={{ fontFamily: fontMono, fontSize: 9 }}>Afinidad</div></div>
    </div>

    <div style={{ padding: "20px 24px", borderBottom: `1px dashed ${colors.bordoDeep}` }}>
      <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 3, color: colors.bordo, textTransform: "uppercase", marginBottom: 10 }}>Atributos mundanos</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{renderRows(mundanos)}</div>
      <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 3, color: colors.bordo, textTransform: "uppercase", margin: "16px 0 10px" }}>Atributos ocultistas</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{renderRows(ocultistas)}</div>
    </div>

    <div style={{ padding: "16px 24px", borderBottom: `1px dashed ${colors.bordoDeep}` }}>
      <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 3, color: colors.bordo, textTransform: "uppercase", marginBottom: 8 }}>Perks y coste</div>
      <div style={{ fontFamily: fontBody, fontSize: 15 }}>Arquetipo: <strong>{perks.archetype}</strong></div>
      <ul style={{ margin: "8px 0", paddingLeft: 18, fontFamily: fontBody, fontSize: 14 }}>{perks.perks.map((p) => <li key={p.name}><strong>{p.name}:</strong> {p.effect}</li>)}</ul>
      <p style={{ margin: 0, fontFamily: fontBody, fontSize: 14, color: colors.bordoDeep }}><strong>Coste:</strong> {perks.drawback.cost}</p>
    </div>

    <div style={{ padding: "16px 24px" }}>
      <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 3, color: colors.bordo, textTransform: "uppercase", marginBottom: 8 }}>Estados activos</div>
      <ul style={{ margin: 0, paddingLeft: 18, fontFamily: fontBody, fontSize: 14 }}>{statuses.map((s) => <li key={s.name}><strong>{s.name}:</strong> {s.detail}</li>)}</ul>
    </div>
  </div>;
}
