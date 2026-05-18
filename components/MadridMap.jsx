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

export default function MadridMap() {
  const [selectedId, setSelectedId] = useState(MADRID_LOCATIONS[0].id);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => MADRID_LOCATIONS.filter((l) => (filter === "all" || l.type === filter) && l.name.toLowerCase().includes(query.toLowerCase())), [filter, query]);
  const selected = MADRID_LOCATIONS.find((l) => l.id === selectedId) || visible[0] || MADRID_LOCATIONS[0];

  return <div style={{ background: colors.paperLight, border: `1px solid ${colors.ink}`, boxShadow: `4px 4px 0 ${colors.bordo}` }}>
    <div style={{ borderBottom: `1px solid ${colors.ink}`, padding: "16px 20px", background: colors.paper }}>
      <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 3, color: colors.bordo, textTransform: "uppercase" }}>Cartografía táctica</div>
      <h2 style={{ fontFamily: fontDisplay, fontSize: 28, margin: "2px 0 8px", fontWeight: "normal" }}>Madrid · Plano de operaciones ocultistas</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar localización..." style={{ fontFamily: fontBody, padding: "8px 10px", border: `1px solid ${colors.ink}`, minWidth: 220 }} />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ fontFamily: fontBody, padding: "8px 10px", border: `1px solid ${colors.ink}` }}>
          <option value="all">Todos los tipos</option>
          {Object.entries(LOCATION_TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
    </div>

    <div style={{ padding: 12, background: "#e9dfc4" }}>
      <svg viewBox="0 0 1000 700" style={{ width: "100%", border: `1px solid ${colors.ink}`, background: "#f5ecd4" }}>
        <rect x="0" y="0" width="1000" height="700" fill="#f3e8cc" />
        <g stroke="#9c8355" opacity="0.55">{Array.from({ length: 11 }, (_, i) => <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={700} />)}{Array.from({ length: 8 }, (_, i) => <line key={`h${i}`} x1={0} y1={i * 100} x2={1000} y2={i * 100} />)}</g>
        <path d="M80,120 C120,260 100,420 130,650" stroke="#5C7A8C" strokeWidth="5" fill="none" opacity="0.6"/>
        {visible.map((loc) => {
          const { x, y } = project(loc.lat, loc.lng);
          const active = selected?.id === loc.id;
          return <g key={loc.id} onClick={() => setSelectedId(loc.id)} style={{ cursor: "pointer" }}>
            <circle cx={x} cy={y} r={active ? 13 : 9} fill={LOCATION_TYPE_COLOR[loc.type]} stroke={colors.ink} strokeWidth="1.2" />
            {active && <><circle cx={x} cy={y} r="22" fill="none" stroke={colors.bordo} strokeDasharray="4 4" /><text x={x + 16} y={y - 12} fontFamily="serif" fontSize="16">{loc.name}</text></>}
          </g>;
        })}
      </svg>
    </div>

    <div style={{ borderTop: `1px solid ${colors.ink}`, padding: "16px 20px", minHeight: 220 }}>
      {selected && <>
        <div style={{ fontFamily: fontMono, fontSize: 10, letterSpacing: 2, color: colors.bordo }}>{LOCATION_TYPE_LABEL[selected.type]} · {selected.district}</div>
        <h3 style={{ fontFamily: fontDisplay, fontSize: 26, margin: "4px 0" }}>{selected.name}</h3>
        <p style={{ fontFamily: fontBody, margin: "0 0 8px", lineHeight: 1.45 }}>{selected.long}</p>
        <p style={{ fontFamily: fontBody, fontStyle: "italic", color: colors.bordoDeep, margin: 0 }}><strong>Encuentro:</strong> {selected.encounter}</p>
      </>}
    </div>
  </div>;
}
