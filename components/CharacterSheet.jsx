"use client";

import { Seal } from "./Seal.jsx";
import { colors, fontDisplay, fontBody, fontMono } from "@/lib/constants.js";
import { statKeys, statMeta } from "@/lib/stats.js";

function StatBar({ value }) {
  const pips = Array.from({ length: 10 }, (_, i) => i < value);
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {pips.map((on, i) => (
        <div
          key={i}
          style={{
            width: "14px",
            height: "16px",
            background: on ? colors.bordo : "transparent",
            border: `1px solid ${on ? colors.bordoDeep : colors.ink}`,
            opacity: on ? 1 : 0.4,
          }}
        />
      ))}
    </div>
  );
}

export default function CharacterSheet({ character }) {
  const { politician, stats, matchPercent, fileNumber } = character;
  const keys = statKeys();

  return (
    <div style={{ background: colors.paperLight, border: `1px solid ${colors.ink}`, boxShadow: `4px 4px 0 ${colors.bordo}` }}>
      {/* Cabecera */}
      <div style={{ borderBottom: `1px solid ${colors.ink}`, padding: "20px 24px", background: colors.paper, display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ flexShrink: 0 }}>
          <Seal size={90} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: fontMono, fontSize: "11px", letterSpacing: "3px", color: colors.bordo, textTransform: "uppercase", marginBottom: "4px" }}>
            Ficha de personaje · Expediente {fileNumber}
          </div>
          <h2 style={{ fontFamily: fontDisplay, fontSize: "30px", letterSpacing: "1px", margin: 0, color: colors.ink, fontWeight: "normal", lineHeight: 1.1 }}>
            {politician.name}
          </h2>
          <div style={{ fontFamily: fontMono, fontSize: "11px", letterSpacing: "1px", color: colors.bordoDeep, marginTop: "6px", fontStyle: "italic" }}>
            {politician.epitaph}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: fontDisplay, fontSize: "40px", color: colors.bordo, lineHeight: 1 }}>
            {matchPercent}<span style={{ fontSize: "20px" }}>%</span>
          </div>
          <div style={{ fontFamily: fontMono, fontSize: "9px", letterSpacing: "2px", color: colors.bordoDeep, textTransform: "uppercase", marginTop: "2px" }}>
            Afinidad
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "24px 28px", borderBottom: `1px dashed ${colors.bordoDeep}` }}>
        <div style={{ fontFamily: fontMono, fontSize: "11px", letterSpacing: "3px", color: colors.bordo, textTransform: "uppercase", marginBottom: "16px" }}>
          Atributos herméticos
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {keys.map((k) => {
            const meta = statMeta(k);
            return (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ minWidth: "140px" }}>
                  <div style={{ fontFamily: fontDisplay, fontSize: "20px", color: colors.ink, letterSpacing: "1px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: colors.bordo, fontSize: "18px" }}>{meta.glyph}</span>
                    {meta.label}
                  </div>
                  <div style={{ fontFamily: fontBody, fontSize: "13px", fontStyle: "italic", color: colors.bordoDeep, lineHeight: 1.25, marginTop: "2px" }}>
                    {meta.description}
                  </div>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "12px" }}>
                  <StatBar value={stats[k]} />
                  <div style={{ fontFamily: fontDisplay, fontSize: "22px", color: colors.ink, minWidth: "32px" }}>
                    {stats[k]}<span style={{ fontSize: "13px", color: colors.bordoDeep }}>/10</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inventario */}
      <div style={{ padding: "20px 28px" }}>
        <div style={{ fontFamily: fontMono, fontSize: "11px", letterSpacing: "3px", color: colors.bordo, textTransform: "uppercase", marginBottom: "12px" }}>
          Inventario inicial
        </div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, fontFamily: fontBody, fontSize: "17px", color: colors.ink, lineHeight: 1.5 }}>
          <li>› Un sello personal de lacre rojo, sin estrenar</li>
          <li>› Un sobre lacrado con tres nombres escritos a lápiz</li>
          <li>› Una llave que no abre cerradura conocida</li>
          <li>› Un mapa de Madrid heredado, con marcas en tinta sepia</li>
          <li>› Quince monedas de plata anteriores a 1972</li>
        </ul>
      </div>
    </div>
  );
}
