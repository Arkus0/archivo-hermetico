"use client";

import { useMemo, useState } from "react";
import { colors, fontDisplay, fontBody, fontMono } from "@/lib/constants.js";

const BACKGROUNDS = [
  { id: "asesor", label: "Asesor de aparato", bonus: { recursos: 1, carisma: 1 }, text: "Controlas pasillos, agendas y tiempos parlamentarios." },
  { id: "periodista", label: "Periodista parlamentario", bonus: { perspicacia: 2 }, text: "Sabes leer silencios y detectar filtraciones." },
  { id: "militante", label: "Militante de base", bonus: { voluntad: 2 }, text: "Eres persistente y aguantas presión de campaña." },
];

export default function CharacterCreationScreen({ baseCharacter, onConfirm, onBack }) {
  const [alias, setAlias] = useState("");
  const [background, setBackground] = useState(BACKGROUNDS[0].id);
  const [focus, setFocus] = useState("politica");

  const previewStats = useMemo(() => {
    const bg = BACKGROUNDS.find((b) => b.id === background);
    const stats = { ...baseCharacter.stats };
    Object.entries(bg.bonus).forEach(([k, v]) => {
      stats[k] = Math.max(1, Math.min(10, (stats[k] ?? 5) + v));
    });
    if (focus === "politica") {
      stats.carisma = Math.min(10, stats.carisma + 1);
      stats.recursos = Math.min(10, stats.recursos + 1);
      stats.ritualismo = Math.max(1, stats.ritualismo - 1);
    } else {
      stats.sensibilidad = Math.min(10, stats.sensibilidad + 1);
    }
    return stats;
  }, [background, baseCharacter.stats, focus]);

  return <div style={{ minHeight: "100vh", padding: "28px 16px 48px", color: colors.ink }}>
    <div style={{ maxWidth: 980, margin: "0 auto", border: `1px solid ${colors.ink}`, background: colors.paperLight, boxShadow: `4px 4px 0 ${colors.bordo}`, padding: 24 }}>
      <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 3, color: colors.bordo, textTransform: "uppercase" }}>Capítulo I · Creación de ficha</div>
      <h1 style={{ fontFamily: fontDisplay, fontSize: 40, margin: "6px 0 12px", fontWeight: "normal" }}>Define tu personaje político</h1>
      <p style={{ fontFamily: fontBody, marginTop: 0 }}>Partes del perfil de <strong>{baseCharacter.politician.name}</strong>. Ajusta tu identidad antes de entrar al tablero.</p>

      <label style={{ display: "block", fontFamily: fontMono, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Alias de campaña</label>
      <input value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="Ej: El Pacto de Chamberí" style={{ width: "100%", padding: "10px 12px", border: `1px solid ${colors.ink}`, marginBottom: 16, fontFamily: fontBody }} />

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Origen</div>
        <div style={{ display: "grid", gap: 10 }}>
          {BACKGROUNDS.map((bg) => <label key={bg.id} style={{ border: `1px solid ${colors.ink}`, padding: 10, cursor: "pointer", background: background === bg.id ? colors.paper : colors.paperLight }}>
            <input type="radio" name="bg" checked={background === bg.id} onChange={() => setBackground(bg.id)} /> <strong>{bg.label}</strong>
            <div style={{ fontFamily: fontBody, fontSize: 14 }}>{bg.text}</div>
          </label>)}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Enfoque de campaña</div>
        <button onClick={() => setFocus("politica")} style={{ marginRight: 8 }}>Política institucional</button>
        <button onClick={() => setFocus("hibrido")}>Híbrido</button>
      </div>

      <p style={{ fontFamily: fontBody, fontSize: 14 }}><strong>Vista previa:</strong> Carisma {previewStats.carisma} · Recursos {previewStats.recursos} · Perspicacia {previewStats.perspicacia} · Ritualismo {previewStats.ritualismo}</p>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onBack}>← Volver</button>
        <button onClick={() => onConfirm({ ...baseCharacter, alias: alias.trim() || "Sin alias", origin: background, focus, stats: previewStats })}>Confirmar ficha</button>
      </div>
    </div>
  </div>;
}
