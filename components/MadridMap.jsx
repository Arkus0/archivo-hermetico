"use client";

import { useMemo, useState } from "react";
import { colors, fontDisplay, fontBody, fontMono } from "@/lib/constants.js";
import { MADRID_LOCATIONS, LOCATION_TYPE_LABEL, LOCATION_TYPE_COLOR } from "@/lib/madridLocations.js";

const MIN_LAT = 40.392;
const MAX_LAT = 40.437;
const MIN_LNG = -3.732;
const MAX_LNG = -3.642;

function project(lat, lng) {
  const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 1000;
  const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * 700;
  return { x, y };
}

// Glifos para cada tipo, dibujados sobre el marcador (color crema sobre disco).
function TypeGlyph({ type, size = 12 }) {
  const stroke = "#f3e8cc";
  const sw = 1.6;
  const common = { stroke, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" };
  switch (type) {
    case "templo":
      // Cruz latina sobre cúpula
      return (
        <g {...common}>
          <path d={`M0,-${size * 0.55} L0,${size * 0.55}`} />
          <path d={`M-${size * 0.35},-${size * 0.15} L${size * 0.35},-${size * 0.15}`} />
        </g>
      );
    case "palacio":
      // Corona estilizada
      return (
        <g {...common}>
          <path d={`M-${size * 0.5},${size * 0.4} L-${size * 0.5},-${size * 0.1} L-${size * 0.25},${size * 0.2} L0,-${size * 0.45} L${size * 0.25},${size * 0.2} L${size * 0.5},-${size * 0.1} L${size * 0.5},${size * 0.4} Z`} fill={stroke} fillOpacity="0.15" />
        </g>
      );
    case "cementerio":
      // Lápida con cruz
      return (
        <g {...common}>
          <path d={`M-${size * 0.4},${size * 0.45} L-${size * 0.4},-${size * 0.2} Q-${size * 0.4},-${size * 0.5} 0,-${size * 0.5} Q${size * 0.4},-${size * 0.5} ${size * 0.4},-${size * 0.2} L${size * 0.4},${size * 0.45}`} />
          <path d={`M0,-${size * 0.3} L0,${size * 0.15}`} />
          <path d={`M-${size * 0.18},-${size * 0.1} L${size * 0.18},-${size * 0.1}`} />
        </g>
      );
    case "saber":
      // Libro abierto
      return (
        <g {...common}>
          <path d={`M-${size * 0.5},-${size * 0.3} L-${size * 0.5},${size * 0.35} L0,${size * 0.2} L0,-${size * 0.45} Z`} />
          <path d={`M0,-${size * 0.45} L0,${size * 0.2} L${size * 0.5},${size * 0.35} L${size * 0.5},-${size * 0.3} Z`} />
        </g>
      );
    case "memoria":
      // Obelisco
      return (
        <g {...common}>
          <path d={`M-${size * 0.18},${size * 0.5} L-${size * 0.18},-${size * 0.2} L0,-${size * 0.55} L${size * 0.18},-${size * 0.2} L${size * 0.18},${size * 0.5} Z`} />
          <path d={`M-${size * 0.3},${size * 0.5} L${size * 0.3},${size * 0.5}`} />
        </g>
      );
    default:
      return <circle r={size * 0.3} fill={stroke} />;
  }
}

export default function MadridMap({ selectedId: controlledSelectedId, onSelect, control = {} }) {
  const [internalSelectedId, setInternalSelectedId] = useState(MADRID_LOCATIONS[0].id);
  const selectedId = controlledSelectedId ?? internalSelectedId;
  const setSelectedId = onSelect ?? setInternalSelectedId;
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  const visible = useMemo(
    () => MADRID_LOCATIONS.filter((l) => (filter === "all" || l.type === filter) && l.name.toLowerCase().includes(query.toLowerCase())),
    [filter, query]
  );
  const selected = MADRID_LOCATIONS.find((l) => l.id === selectedId) || visible[0] || MADRID_LOCATIONS[0];

  return (
    <div style={{ background: colors.paperLight, border: `1px solid ${colors.ink}`, boxShadow: `4px 4px 0 ${colors.bordo}` }}>
      <div style={{ borderBottom: `1px solid ${colors.ink}`, padding: "16px 20px", background: colors.paper }}>
        <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 3, color: colors.bordo, textTransform: "uppercase" }}>Cartografía táctica</div>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 28, margin: "2px 0 10px", fontWeight: "normal" }}>Madrid · Plano de operaciones ocultistas</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar enclave..."
            style={{ fontFamily: fontBody, fontSize: 16, padding: "8px 10px", border: `1px solid ${colors.ink}`, minWidth: 200, background: colors.paperLight, color: colors.ink }}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ fontFamily: fontBody, fontSize: 16, padding: "8px 10px", border: `1px solid ${colors.ink}`, background: colors.paperLight, color: colors.ink }}
          >
            <option value="all">Todas las categorías</option>
            {Object.entries(LOCATION_TYPE_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <div style={{ display: "flex", gap: 12, marginLeft: "auto", fontFamily: fontMono, fontSize: 10, letterSpacing: 1, color: colors.bordoDeep, textTransform: "uppercase", flexWrap: "wrap" }}>
            {Object.entries(LOCATION_TYPE_LABEL).map(([k, v]) => (
              <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 10, height: 10, background: LOCATION_TYPE_COLOR[k], border: `1px solid ${colors.ink}`, display: "inline-block" }} />
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: 14, background: "linear-gradient(135deg, #b8a06c 0%, #cdb789 50%, #b8a06c 100%)", position: "relative" }}>
        <svg viewBox="0 0 1000 700" style={{ width: "100%", display: "block", filter: "drop-shadow(0 2px 6px rgba(26,20,16,0.35))" }}>
          <defs>
            {/* Textura de pergamino: ruido suave */}
            <filter id="parchmentNoise" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" />
              <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.32  0 0 0 0 0.18  0 0 0 0.18 0" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
            {/* Viñeta */}
            <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
              <stop offset="55%" stopColor="rgba(26,20,16,0)" />
              <stop offset="100%" stopColor="rgba(60,38,18,0.55)" />
            </radialGradient>
            {/* Pergamino base */}
            <linearGradient id="parchmentBase" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ead7a5" />
              <stop offset="50%" stopColor="#e2cb95" />
              <stop offset="100%" stopColor="#d9bf83" />
            </linearGradient>
            {/* Manzanares */}
            <linearGradient id="river" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6a8aab" />
              <stop offset="100%" stopColor="#5b7997" />
            </linearGradient>
            {/* Parque (verde apagado) */}
            <radialGradient id="park" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#94a767" />
              <stop offset="100%" stopColor="#6f7f48" />
            </radialGradient>
            {/* Sello dorado */}
            <radialGradient id="goldDisc" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#d4b76a" />
              <stop offset="100%" stopColor="#8d6e2c" />
            </radialGradient>
            {/* Resplandor activo */}
            <radialGradient id="activeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(212,183,106,0.55)" />
              <stop offset="100%" stopColor="rgba(212,183,106,0)" />
            </radialGradient>
            <pattern id="hatching" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#7a6332" strokeWidth="0.6" opacity="0.35" />
            </pattern>
          </defs>

          {/* Fondo de pergamino */}
          <rect x="0" y="0" width="1000" height="700" fill="url(#parchmentBase)" />
          <rect x="0" y="0" width="1000" height="700" fill="url(#hatching)" opacity="0.18" />
          <rect x="0" y="0" width="1000" height="700" fill="#3b2a14" filter="url(#parchmentNoise)" opacity="0.5" />

          {/* Casa de Campo (oeste) */}
          <path
            d="M0,140 Q-10,260 30,360 Q60,440 40,540 Q30,620 60,700 L0,700 Z"
            fill="url(#park)"
            stroke="#5e6f3a"
            strokeWidth="1.4"
            opacity="0.85"
          />
          <text x="22" y="430" fontFamily={fontDisplay} fontSize="13" fill="#3d4720" opacity="0.7" transform="rotate(-90 22,430)">
            CASA DE CAMPO
          </text>

          {/* Manzanares — bordes y curso */}
          <path
            d="M90,40 Q70,160 100,290 Q120,400 90,520 Q70,620 110,720"
            stroke="#3f5469"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            opacity="0.55"
          />
          <path
            d="M90,40 Q70,160 100,290 Q120,400 90,520 Q70,620 110,720"
            stroke="url(#river)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M90,40 Q70,160 100,290 Q120,400 90,520 Q70,620 110,720"
            stroke="#c2d6e6"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
            strokeDasharray="2 8"
          />
          <text x="60" y="200" fontFamily={fontDisplay} fontSize="14" fill="#2a4055" opacity="0.85" transform="rotate(-78 60,200)" fontStyle="italic">
            Manzanares
          </text>

          {/* Retiro (este) */}
          <path
            d="M635,330 Q680,320 720,355 Q745,400 735,470 Q720,520 670,520 Q610,510 595,460 Q585,395 635,330 Z"
            fill="url(#park)"
            stroke="#5e6f3a"
            strokeWidth="1.4"
            opacity="0.9"
          />
          {/* Estanque del Retiro */}
          <ellipse cx="665" cy="410" rx="22" ry="14" fill="#6a8aab" stroke="#3f5469" strokeWidth="1" opacity="0.85" />
          <text x="665" y="460" fontFamily={fontDisplay} fontSize="14" fill="#3d4720" textAnchor="middle">
            EL RETIRO
          </text>

          {/* Jardín Botánico — pequeño */}
          <rect x="555" y="475" width="35" height="40" fill="url(#park)" stroke="#5e6f3a" strokeWidth="1" opacity="0.7" />

          {/* Trama urbana: ejes principales (Paseo del Prado/Castellana, Gran Vía, Calle Mayor) */}
          <g stroke="#6a4f22" strokeWidth="1.6" fill="none" opacity="0.45">
            {/* Castellana / Prado (norte-sur) */}
            <path d="M540,40 L535,180 L530,330 L525,500 L520,680" strokeDasharray="0" />
            {/* Gran Vía (este-oeste, ligeramente curvada) */}
            <path d="M180,280 Q330,265 470,280 Q560,290 700,275" />
            {/* Calle Mayor / Alcalá */}
            <path d="M170,355 Q300,348 460,338 Q600,332 740,328" />
            {/* Atocha / Recoletos diagonal */}
            <path d="M540,290 L600,450 L640,560" />
            {/* Bailén — frente al Palacio */}
            <path d="M230,260 Q235,330 245,420" />
          </g>
          <g stroke="#6a4f22" strokeWidth="0.8" fill="none" opacity="0.28">
            {/* trama secundaria */}
            <path d="M300,150 Q380,160 470,150" />
            <path d="M280,210 Q360,205 460,210" />
            <path d="M300,420 Q380,425 470,420" />
            <path d="M280,490 Q360,495 460,490" />
            <path d="M260,560 Q360,565 460,560" />
          </g>

          {/* Plazas señaladas como pequeños rombos dorados */}
          {[
            { x: 296, y: 333, name: "Puerta del Sol" },
            { x: 421, y: 286, name: "Plaza de Cibeles" },
            { x: 256, y: 351, name: "Plaza Mayor" },
            { x: 444, y: 467, name: "Atocha" },
            { x: 200, y: 318, name: "Plaza de Oriente" },
            { x: 460, y: 200, name: "Plaza de Colón" },
          ].map((p, i) => (
            <g key={i} opacity="0.55">
              <path d={`M${p.x},${p.y - 5} L${p.x + 5},${p.y} L${p.x},${p.y + 5} L${p.x - 5},${p.y} Z`} fill="#8d6e2c" stroke="#5C1820" strokeWidth="0.6" />
              <text x={p.x + 10} y={p.y + 3} fontFamily={fontMono} fontSize="8" fill="#3d2614" letterSpacing="0.6">
                {p.name.toUpperCase()}
              </text>
            </g>
          ))}

          {/* Marca de los puntos cardinales — pequeñas siglas en bordes */}
          <text x="500" y="20" fontFamily={fontDisplay} fontSize="13" fill="#3d2614" opacity="0.6" textAnchor="middle">NORTE</text>
          <text x="500" y="694" fontFamily={fontDisplay} fontSize="13" fill="#3d2614" opacity="0.6" textAnchor="middle">SUR</text>

          {/* Conexiones rituales: líneas finas que unen el seleccionado con los demás visibles */}
          {selected && visible.length > 1 && (
            <g opacity="0.35">
              {visible
                .filter((l) => l.id !== selected.id)
                .map((l) => {
                  const a = project(selected.lat, selected.lng);
                  const b = project(l.lat, l.lng);
                  return <line key={l.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#5C1820" strokeWidth="0.6" strokeDasharray="1 5" />;
                })}
            </g>
          )}

          {/* Marcadores */}
          {visible.map((loc) => {
            const { x, y } = project(loc.lat, loc.lng);
            const active = selected?.id === loc.id;
            const controlled = control[loc.id];
            const hover = hoveredId === loc.id;
            const c = LOCATION_TYPE_COLOR[loc.type];
            const r = active ? 16 : hover ? 14 : 11;
            return (
              <g key={loc.id} onClick={() => setSelectedId(loc.id)} onMouseEnter={() => setHoveredId(loc.id)} onMouseLeave={() => setHoveredId(null)} style={{ cursor: "pointer" }}>
                {/* Resplandor activo */}
                {active && <circle cx={x} cy={y} r="34" fill="url(#activeGlow)" />}
                {/* Anillo ritual punteado animado */}
                {active && (
                  <g>
                    <circle cx={x} cy={y} r="24" fill="none" stroke={colors.bordo} strokeWidth="1.2" strokeDasharray="2 4">
                      <animateTransform attributeName="transform" type="rotate" from={`0 ${x} ${y}`} to={`360 ${x} ${y}`} dur="22s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={x} cy={y} r="29" fill="none" stroke={colors.bordo} strokeWidth="0.5" opacity="0.6">
                      <animate attributeName="r" values="27;31;27" dur="2.6s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.25;0.7;0.25" dur="2.6s" repeatCount="indefinite" />
                    </circle>
                  </g>
                )}
                {/* Sombra suave */}
                <ellipse cx={x + 1.5} cy={y + r + 1.5} rx={r * 0.8} ry={r * 0.25} fill="#000" opacity="0.25" />
                {/* Disco exterior (sello dorado) */}
                <circle cx={x} cy={y} r={r + 2} fill="url(#goldDisc)" stroke={colors.ink} strokeWidth="0.8" />
                {/* Disco interior coloreado */}
                <circle cx={x} cy={y} r={r} fill={c} stroke={colors.ink} strokeWidth="1.4" />
                {controlled === "controlled" && <circle cx={x} cy={y} r={r + 5} fill="none" stroke="#2e5f25" strokeWidth="2" />}
                {controlled === "contested" && <circle cx={x} cy={y} r={r + 5} fill="none" stroke="#7a2721" strokeWidth="2" strokeDasharray="4 3" />}
                {/* Glifo */}
                <g transform={`translate(${x},${y})`}>
                  <TypeGlyph type={loc.type} size={r * 1.4} />
                </g>
                {/* Cartela activa/hover */}
                {(active || hover) && (
                  <g pointerEvents="none">
                    <rect x={x + 22} y={y - 26} rx="2" ry="2" width={loc.name.length * 7.4 + 18} height="22" fill={colors.paperLight} stroke={colors.ink} strokeWidth="1" />
                    <rect x={x + 22} y={y - 26} rx="2" ry="2" width="3" height="22" fill={c} />
                    <text x={x + 33} y={y - 10} fontFamily={fontDisplay} fontSize="14" fill={colors.ink} letterSpacing="0.5">
                      {loc.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Viñeta */}
          <rect x="0" y="0" width="1000" height="700" fill="url(#vignette)" pointerEvents="none" />

          {/* Cartela del título — esquina superior izquierda */}
          <g transform="translate(20,18)">
            <path d="M0,0 L240,0 L252,12 L252,46 L240,58 L0,58 L-12,46 L-12,12 Z" fill="#e2cb95" stroke={colors.ink} strokeWidth="1.4" />
            <path d="M-6,8 L246,8 L246,50 L-6,50 Z" fill="none" stroke={colors.bordo} strokeWidth="0.5" />
            <text x="120" y="26" textAnchor="middle" fontFamily={fontDisplay} fontSize="13" letterSpacing="3" fill={colors.bordo}>
              VILLA Y CORTE
            </text>
            <text x="120" y="44" textAnchor="middle" fontFamily={fontDisplay} fontStyle="italic" fontSize="12" fill={colors.ink}>
              plano hermético, escala variable
            </text>
          </g>

          {/* Rosa de los vientos — esquina superior derecha */}
          <g transform="translate(910,90)">
            <circle r="44" fill="#e2cb95" stroke={colors.ink} strokeWidth="1.2" opacity="0.9" />
            <circle r="36" fill="none" stroke={colors.bordo} strokeWidth="0.5" />
            <circle r="6" fill={colors.bordo} stroke={colors.ink} strokeWidth="0.6" />
            {/* Aguja N-S */}
            <path d="M0,-38 L6,0 L0,38 L-6,0 Z" fill={colors.bordo} stroke={colors.ink} strokeWidth="0.8" />
            {/* Aguja E-O */}
            <path d="M-38,0 L0,-5 L38,0 L0,5 Z" fill="#e2cb95" stroke={colors.ink} strokeWidth="0.8" />
            {/* Diagonales */}
            <g stroke={colors.ink} strokeWidth="0.5" opacity="0.6">
              <line x1="-26" y1="-26" x2="26" y2="26" />
              <line x1="26" y1="-26" x2="-26" y2="26" />
            </g>
            <text x="0" y="-48" textAnchor="middle" fontFamily={fontDisplay} fontSize="13" fill={colors.ink}>N</text>
            <text x="52" y="4" textAnchor="middle" fontFamily={fontDisplay} fontSize="13" fill={colors.ink}>E</text>
            <text x="0" y="58" textAnchor="middle" fontFamily={fontDisplay} fontSize="13" fill={colors.ink}>S</text>
            <text x="-52" y="4" textAnchor="middle" fontFamily={fontDisplay} fontSize="13" fill={colors.ink}>O</text>
          </g>

          {/* Escala — esquina inferior izquierda */}
          <g transform="translate(40,640)">
            <line x1="0" y1="0" x2="120" y2="0" stroke={colors.ink} strokeWidth="2" />
            <line x1="0" y1="-5" x2="0" y2="5" stroke={colors.ink} strokeWidth="2" />
            <line x1="60" y1="-4" x2="60" y2="4" stroke={colors.ink} strokeWidth="1.2" />
            <line x1="120" y1="-5" x2="120" y2="5" stroke={colors.ink} strokeWidth="2" />
            <text x="60" y="20" textAnchor="middle" fontFamily={fontMono} fontSize="10" letterSpacing="1.5" fill={colors.ink}>1 LEGUA APROX.</text>
          </g>

          {/* Sello del archivero — esquina inferior derecha */}
          <g transform="translate(900,620)" opacity="0.75">
            <circle r="38" fill="none" stroke={colors.bordo} strokeWidth="1" />
            <circle r="32" fill="none" stroke={colors.bordo} strokeWidth="0.5" />
            <text x="0" y="-4" textAnchor="middle" fontFamily={fontDisplay} fontSize="10" letterSpacing="2" fill={colors.bordo}>LOGIA</text>
            <text x="0" y="10" textAnchor="middle" fontFamily={fontDisplay} fontSize="10" letterSpacing="2" fill={colors.bordo}>DEL TEDIO</text>
            <text x="0" y="24" textAnchor="middle" fontFamily={fontMono} fontSize="7" letterSpacing="1" fill={colors.bordo}>· MDCCCXXXII ·</text>
          </g>

          {/* Borde decorado */}
          <rect x="0" y="0" width="1000" height="700" fill="none" stroke={colors.ink} strokeWidth="6" />
          <rect x="9" y="9" width="982" height="682" fill="none" stroke={colors.ink} strokeWidth="1" />
          <rect x="14" y="14" width="972" height="672" fill="none" stroke={colors.bordo} strokeWidth="0.6" strokeDasharray="3 4" />
          {/* Esquinas */}
          {[
            [14, 14, 1, 1],
            [986, 14, -1, 1],
            [14, 686, 1, -1],
            [986, 686, -1, -1],
          ].map(([ox, oy, sx, sy], i) => (
            <g key={i} transform={`translate(${ox},${oy}) scale(${sx},${sy})`} stroke={colors.bordo} strokeWidth="1.2" fill="none">
              <path d="M0,0 L24,0 M0,0 L0,24" />
              <circle cx="0" cy="0" r="3" fill={colors.bordo} />
            </g>
          ))}
        </svg>
      </div>

      <div style={{ borderTop: `1px solid ${colors.ink}`, padding: "18px 22px", minHeight: 220, background: colors.paperLight }}>
        {selected && (
          <>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
              <span
                style={{
                  fontFamily: fontMono,
                  fontSize: 10,
                  letterSpacing: 2,
                  color: colors.paperLight,
                  background: LOCATION_TYPE_COLOR[selected.type],
                  padding: "2px 8px",
                  textTransform: "uppercase",
                  border: `1px solid ${colors.ink}`,
                }}
              >
                {LOCATION_TYPE_LABEL[selected.type]}
              </span>
              <span style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 2, color: colors.bordoDeep, textTransform: "uppercase" }}>
                Distrito · {selected.district}
              </span>
            </div>
            <h3 style={{ fontFamily: fontDisplay, fontSize: 28, margin: "4px 0 10px", fontWeight: "normal" }}>{selected.name}</h3>
            <p style={{ fontFamily: fontBody, margin: "0 0 10px", lineHeight: 1.55, fontSize: 17 }}>{selected.long}</p>
            <p style={{ fontFamily: fontBody, fontStyle: "italic", color: colors.bordoDeep, margin: 0, lineHeight: 1.5, borderLeft: `3px solid ${colors.bordo}`, paddingLeft: 12, fontSize: 16 }}>
              <strong style={{ fontStyle: "normal", letterSpacing: 1, fontFamily: fontMono, fontSize: 11, textTransform: "uppercase", display: "block", marginBottom: 2, color: colors.bordo }}>
                Encuentro previsto
              </strong>
              {selected.encounter}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
