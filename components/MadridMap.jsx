"use client";

import { useState } from "react";
import { colors, fontDisplay, fontBody, fontMono } from "@/lib/constants.js";
import { MADRID_LOCATIONS, LOCATION_TYPE_LABEL, LOCATION_TYPE_COLOR } from "@/lib/madridLocations.js";

export default function MadridMap() {
  const [selectedId, setSelectedId] = useState(null);
  const [hoverId, setHoverId] = useState(null);
  const selected = MADRID_LOCATIONS.find((l) => l.id === selectedId);

  return (
    <div style={{ background: colors.paperLight, border: `1px solid ${colors.ink}`, boxShadow: `4px 4px 0 ${colors.bordo}` }}>
      {/* Cabecera */}
      <div style={{ borderBottom: `1px solid ${colors.ink}`, padding: "16px 24px", background: colors.paper, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: fontMono, fontSize: "11px", letterSpacing: "3px", color: colors.bordo, textTransform: "uppercase" }}>
            Plano hermético
          </div>
          <h2 style={{ fontFamily: fontDisplay, fontSize: "26px", letterSpacing: "1px", margin: "2px 0 0 0", color: colors.ink, fontWeight: "normal" }}>
            Villa y Corte de Madrid
          </h2>
        </div>
        <div style={{ fontFamily: fontMono, fontSize: "10px", letterSpacing: "2px", color: colors.bordoDeep, fontStyle: "italic" }}>
          Trece localizaciones · Logia del Tedio
        </div>
      </div>

      {/* SVG ilustrado */}
      <div style={{ padding: "16px", background: "#EFE6CC" }}>
        <svg viewBox="0 0 800 640" style={{ width: "100%", height: "auto", display: "block", background: "#EFE6CC" }}>
          <defs>
            <pattern id="parchmentTexture" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
              <rect width="6" height="6" fill="transparent" />
              <circle cx="1" cy="1" r="0.4" fill="rgba(92, 24, 32, 0.07)" />
            </pattern>
            <filter id="rough">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" />
              <feDisplacementMap in="SourceGraphic" scale="1.4" />
            </filter>
          </defs>
          <rect x="0" y="0" width="800" height="640" fill="url(#parchmentTexture)" />

          {/* Río Manzanares al oeste */}
          <path d="M 150 100 C 130 220, 170 340, 145 460 C 130 540, 165 600, 160 640" stroke="#5C7A8C" strokeWidth="3.5" fill="none" opacity="0.55" strokeLinecap="round" />
          <text x="105" y="430" fontFamily='"IM Fell English", serif' fontSize="13" fill="#5C7A8C" opacity="0.8" fontStyle="italic" transform="rotate(-78 105 430)">
            R. Manzanares
          </text>

          {/* Parques: Retiro, Oeste, Casa de Campo */}
          <ellipse cx="630" cy="430" rx="95" ry="80" fill="#A8C29A" opacity="0.35" />
          <text x="630" y="435" textAnchor="middle" fontFamily='"IM Fell English", serif' fontSize="14" fill="#3D5C1A" opacity="0.7" fontStyle="italic">
            Parque del Retiro
          </text>
          <circle cx="638" cy="445" r="12" fill="#5C7A8C" opacity="0.5" />

          <ellipse cx="220" cy="200" rx="55" ry="45" fill="#A8C29A" opacity="0.3" />
          <text x="220" y="205" textAnchor="middle" fontFamily='"IM Fell English", serif' fontSize="11" fill="#3D5C1A" opacity="0.7" fontStyle="italic">
            P.º Oeste
          </text>

          <ellipse cx="95" cy="270" rx="50" ry="80" fill="#A8C29A" opacity="0.25" />
          <text x="65" y="275" fontFamily='"IM Fell English", serif' fontSize="10" fill="#3D5C1A" opacity="0.7" fontStyle="italic">
            Casa de Campo
          </text>

          {/* Calles principales como abstractos */}
          <g stroke="#8B6F4E" strokeWidth="1.2" fill="none" opacity="0.45">
            <path d="M 200 360 L 700 360" />
            <path d="M 410 100 L 410 600" />
            <path d="M 480 180 L 480 540" />
            <path d="M 250 280 L 700 280" />
            <path d="M 280 480 L 700 480" />
            <path d="M 350 100 L 600 600" opacity="0.3" />
          </g>

          {/* Etiquetas de barrios */}
          <g fontFamily='"IM Fell English", serif' fontSize="12" fill="#6E3015" opacity="0.55" fontStyle="italic">
            <text x="320" y="180">Malasaña</text>
            <text x="540" y="160">Chueca</text>
            <text x="600" y="250">Salamanca</text>
            <text x="600" y="540">Pacífico</text>
            <text x="220" y="555">Carabanchel</text>
            <text x="390" y="430">Centro</text>
            <text x="700" y="430">Retiro</text>
          </g>

          {/* Rosa de los vientos */}
          <g transform="translate(720, 90)" opacity="0.7">
            <circle cx="0" cy="0" r="30" fill="none" stroke="#5C1820" strokeWidth="0.8" />
            <line x1="0" y1="-28" x2="0" y2="28" stroke="#5C1820" strokeWidth="1" />
            <line x1="-28" y1="0" x2="28" y2="0" stroke="#5C1820" strokeWidth="1" />
            <polygon points="0,-30 -5,-5 5,-5" fill="#5C1820" />
            <text x="0" y="-36" textAnchor="middle" fontFamily='"IM Fell English", serif' fontSize="13" fill="#5C1820">N</text>
            <text x="36" y="4" fontFamily='"IM Fell English", serif' fontSize="11" fill="#5C1820">E</text>
            <text x="0" y="46" textAnchor="middle" fontFamily='"IM Fell English", serif' fontSize="11" fill="#5C1820">S</text>
            <text x="-44" y="4" fontFamily='"IM Fell English", serif' fontSize="11" fill="#5C1820">O</text>
          </g>

          {/* Cartouche del título */}
          <g transform="translate(40, 50)">
            <rect x="0" y="0" width="220" height="50" fill="none" stroke="#5C1820" strokeWidth="0.6" />
            <rect x="3" y="3" width="214" height="44" fill="none" stroke="#5C1820" strokeWidth="0.3" />
            <text x="110" y="22" textAnchor="middle" fontFamily='"IM Fell English", serif' fontSize="13" letterSpacing="3" fill="#1A1410">
              VILLA Y CORTE
            </text>
            <text x="110" y="38" textAnchor="middle" fontFamily='"Special Elite", monospace' fontSize="9" letterSpacing="2" fill="#5C1820">
              ARCHIVO HERMÉTICO · MMXXVI
            </text>
          </g>

          {/* Marcadores de localizaciones */}
          {MADRID_LOCATIONS.map((loc) => {
            const isHover = hoverId === loc.id;
            const isSelected = selectedId === loc.id;
            const fill = LOCATION_TYPE_COLOR[loc.type] || colors.bordo;
            const r = isSelected ? 11 : isHover ? 9 : 7;
            return (
              <g
                key={loc.id}
                onMouseEnter={() => setHoverId(loc.id)}
                onMouseLeave={() => setHoverId(null)}
                onClick={() => setSelectedId(loc.id === selectedId ? null : loc.id)}
                style={{ cursor: "pointer" }}
              >
                {isSelected && (
                  <circle cx={loc.x} cy={loc.y} r="18" fill="none" stroke={colors.bordo} strokeWidth="1" strokeDasharray="3 3" opacity="0.7">
                    <animateTransform attributeName="transform" type="rotate" from={`0 ${loc.x} ${loc.y}`} to={`360 ${loc.x} ${loc.y}`} dur="22s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx={loc.x} cy={loc.y} r={r + 3} fill={colors.paperLight} stroke={fill} strokeWidth="1" />
                <circle cx={loc.x} cy={loc.y} r={r} fill={fill} />
                <circle cx={loc.x} cy={loc.y} r={r - 3} fill={colors.paperLight} opacity="0.85" />
                {(isHover || isSelected) && (
                  <g>
                    <rect
                      x={loc.x + 14}
                      y={loc.y - 22}
                      width={loc.name.length * 7.5 + 14}
                      height="22"
                      fill={colors.paperLight}
                      stroke={colors.ink}
                      strokeWidth="0.6"
                    />
                    <text
                      x={loc.x + 21}
                      y={loc.y - 7}
                      fontFamily='"IM Fell English", serif'
                      fontSize="13"
                      fill={colors.ink}
                    >
                      {loc.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Panel inferior: leyenda o detalle */}
      <div style={{ borderTop: `1px solid ${colors.ink}`, padding: "20px 24px", background: colors.paperLight, minHeight: "180px" }}>
        {selected ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
              <div>
                <div style={{ fontFamily: fontMono, fontSize: "10px", letterSpacing: "3px", color: colors.bordo, textTransform: "uppercase" }}>
                  {LOCATION_TYPE_LABEL[selected.type]} · {selected.district}
                </div>
                <h3 style={{ fontFamily: fontDisplay, fontSize: "26px", letterSpacing: "1px", margin: "2px 0 0 0", color: colors.ink, fontWeight: "normal" }}>
                  {selected.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                style={{
                  fontFamily: fontMono,
                  fontSize: "11px",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  background: "transparent",
                  border: `1px solid ${colors.ink}`,
                  color: colors.ink,
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                Cerrar
              </button>
            </div>
            <p style={{ fontFamily: fontBody, fontSize: "17px", lineHeight: 1.55, color: colors.ink, margin: "0 0 12px 0" }}>
              {selected.long}
            </p>
            <div style={{ borderTop: `1px dashed ${colors.bordoDeep}`, paddingTop: "12px" }}>
              <div style={{ fontFamily: fontMono, fontSize: "10px", letterSpacing: "2px", color: colors.bordo, textTransform: "uppercase", marginBottom: "4px" }}>
                Encuentro probable
              </div>
              <p style={{ fontFamily: fontBody, fontSize: "16px", fontStyle: "italic", color: colors.bordoDeep, margin: 0, lineHeight: 1.45 }}>
                {selected.encounter}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontFamily: fontMono, fontSize: "11px", letterSpacing: "3px", color: colors.bordo, textTransform: "uppercase", marginBottom: "12px" }}>
              Leyenda del plano
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontFamily: fontBody, fontSize: "15px", color: colors.ink }}>
              {Object.entries(LOCATION_TYPE_LABEL).map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ display: "inline-block", width: "14px", height: "14px", borderRadius: "50%", background: LOCATION_TYPE_COLOR[k], border: `1px solid ${colors.ink}` }} />
                  {v}
                </div>
              ))}
            </div>
            <p style={{ fontFamily: fontBody, fontStyle: "italic", fontSize: "16px", color: colors.bordoDeep, marginTop: "16px", lineHeight: 1.45 }}>
              Pulsa un punto del plano para abrir el expediente de la localización.
              Cada sitio guarda un encuentro probable de la Logia del Tedio.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
