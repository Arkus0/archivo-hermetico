"use client";

import { colors, fontMono } from "@/lib/constants.js";
import { POLITICIANS } from "@/lib/politicians.js";
import { FACTIONS } from "@/lib/factions.js";
import { getPoliticianFaction, getSponsorsOf } from "@/lib/politicianPlacements.js";

const POLITICIAN_BY_ID = POLITICIANS.reduce((acc, p) => { acc[p.id] = p; return acc; }, {});

function initialOf(politicianId) {
  const p = POLITICIAN_BY_ID[politicianId];
  if (!p) return "?";
  const parts = p.name.split(" ");
  return parts[0][0];
}

// Renderiza un cluster orbital de patrocinadores en torno al marcador del enclave.
// Sub-anillo a radio `orbitR` con 1..3 iniciales coloreadas por facción.
export function SponsorOrbit({ locationId, cx, cy, orbitR = 22, onClick, hoveredId, setHoveredId }) {
  const sponsors = getSponsorsOf(locationId);
  if (sponsors.length === 0) return null;
  const visible = sponsors.slice(0, 3);
  const step = (Math.PI * 2) / Math.max(visible.length, 1);
  return (
    <g pointerEvents="visiblePainted">
      {visible.map((pid, i) => {
        const angle = -Math.PI / 2 + i * step;
        const px = cx + Math.cos(angle) * orbitR;
        const py = cy + Math.sin(angle) * orbitR;
        const fac = getPoliticianFaction(pid);
        const fill = FACTIONS[fac]?.color || colors.ink;
        const initial = initialOf(pid);
        const isHovered = hoveredId === pid;
        return (
          <g key={`${locationId}-${pid}`} style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onClick?.(pid); }} onMouseEnter={() => setHoveredId?.(pid)} onMouseLeave={() => setHoveredId?.(null)}>
            <circle cx={px} cy={py} r={isHovered ? 7 : 5.5} fill={fill} stroke={colors.paperLight} strokeWidth={1.2} />
            <text x={px} y={py + 2.5} textAnchor="middle" fontFamily={fontMono} fontSize={isHovered ? 8 : 7} fill={colors.paperLight} letterSpacing={0.2}>{initial}</text>
          </g>
        );
      })}
    </g>
  );
}

export function PoliticianTooltip({ politicianId, x, y, disposition }) {
  if (!politicianId) return null;
  const p = POLITICIAN_BY_ID[politicianId];
  if (!p) return null;
  const fac = getPoliticianFaction(politicianId);
  const facColor = FACTIONS[fac]?.color || colors.ink;
  return (
    <g pointerEvents="none">
      <rect x={x + 14} y={y - 28} rx={2} ry={2} width={Math.min(280, p.name.length * 7 + 60)} height={36} fill={colors.paperLight} stroke={colors.ink} strokeWidth={1} />
      <rect x={x + 14} y={y - 28} rx={2} ry={2} width={3} height={36} fill={facColor} />
      <text x={x + 24} y={y - 14} fontFamily="serif" fontSize={13} fill={colors.ink}>{p.name}</text>
      <text x={x + 24} y={y - 1} fontFamily={fontMono} fontSize={9} fill={colors.bordoDeep} letterSpacing={1}>{FACTIONS[fac]?.name?.toUpperCase()} · disposición {disposition >= 0 ? `+${disposition}` : disposition}</text>
    </g>
  );
}

export default SponsorOrbit;
