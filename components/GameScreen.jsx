"use client";

import { useMemo, useState } from "react";
import { MiniOrnament } from "./Seal.jsx";
import CharacterSheet from "./CharacterSheet.jsx";
import MadridMap from "./MadridMap.jsx";
import { colors, fontDisplay, fontBody, fontMono } from "@/lib/constants.js";
import { MADRID_LOCATIONS, LOCATION_TYPE_LABEL } from "@/lib/madridLocations.js";

const TYPE_TO_STAT = {
  templo: "voluntad",
  palacio: "carisma",
  cementerio: "sangre_fria",
  saber: "perspicacia",
  memoria: "paranoia",
};

const TYPE_DIFFICULTY = {
  templo: 9,
  palacio: 10,
  cementerio: 8,
  saber: 9,
  memoria: 10,
};

export default function GameScreen({ character, onBack, onRestart }) {
  const [selectedId, setSelectedId] = useState(MADRID_LOCATIONS[0].id);
  const [control, setControl] = useState({});
  const [round, setRound] = useState(1);
  const [influence, setInfluence] = useState(0);
  const [threat, setThreat] = useState(0);
  const [log, setLog] = useState([]);

  const selected = useMemo(() => MADRID_LOCATIONS.find((l) => l.id === selectedId) || MADRID_LOCATIONS[0], [selectedId]);
  const maxRounds = 8;
  const isOver = round > maxRounds || threat >= 6;
  const uniqueControl = Object.values(control).filter(Boolean).length;
  const victory = isOver && threat < 6 && (influence >= 16 || uniqueControl >= 6);

  const resolveTurn = () => {
    if (isOver || !selected) return;
    const statKey = TYPE_TO_STAT[selected.type];
    const statValue = character.stats?.[statKey] ?? 5;
    const difficulty = TYPE_DIFFICULTY[selected.type] + (control[selected.id] ? 2 : 0);
    const dice = Math.floor(Math.random() * 6) + 1;
    const total = dice + Math.floor(statValue / 2);
    const success = total >= difficulty;

    setControl((prev) => ({ ...prev, [selected.id]: success }));
    setInfluence((prev) => prev + (success ? 3 : 1));
    setThreat((prev) => prev + (success ? 0 : 1));
    setLog((prev) => [
      {
        id: `${round}-${selected.id}`,
        place: selected.name,
        success,
        detail: `${LOCATION_TYPE_LABEL[selected.type]} · tirada ${dice} + ${Math.floor(statValue / 2)} (${statKey.replace("_", " ")}) vs ${difficulty}`,
      },
      ...prev,
    ].slice(0, 6));
    setRound((r) => r + 1);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "32px 16px 64px 16px", color: colors.ink }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", borderBottom: `2px double ${colors.bordo}`, paddingBottom: "16px", marginBottom: "28px" }}>
          <div style={{ fontFamily: fontMono, fontSize: "11px", letterSpacing: "4px", color: colors.bordo, textTransform: "uppercase", marginBottom: "6px" }}>
            Capítulo I · El sujeto se encarna
          </div>
          <h1 style={{ fontFamily: fontDisplay, fontSize: "44px", letterSpacing: "3px", margin: "0 0 6px 0", color: colors.ink, fontWeight: "normal" }}>
            EL TABLERO DE LA VILLA
          </h1>
          <p style={{ fontFamily: fontBody, fontStyle: "italic", fontSize: "18px", color: colors.bordoDeep, margin: 0 }}>
            Cada ronda equivale a una maniobra política. Elige enclave, tira y consolida control antes de que suba la amenaza.
          </p>
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
            <MiniOrnament />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: "28px" }}>
          <style>{`@media (min-width: 1024px) {.game-grid {grid-template-columns: 460px minmax(0, 1fr) !important; align-items: start !important;} .game-sticky {position: sticky; top: 24px;}}`}</style>
          <div className="game-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "28px", alignItems: "stretch" }}>
            <div className="game-sticky">
              <CharacterSheet character={character} />
            </div>
            <div>
              <MadridMap selectedId={selectedId} onSelect={setSelectedId} control={control} />

              <div style={{ marginTop: 18, border: `1px solid ${colors.ink}`, background: colors.paperLight, boxShadow: `3px 3px 0 ${colors.bordo}`, padding: 16 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: colors.bordo }}>
                    Ronda {Math.min(round, maxRounds)}/{maxRounds} · Influencia {influence} · Amenaza {threat}/6
                  </div>
                  {!isOver ? (
                    <button onClick={resolveTurn} style={{ fontFamily: fontMono, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", background: colors.ink, color: colors.paperLight, border: `1px solid ${colors.ink}`, padding: "10px 14px", cursor: "pointer" }}>
                      Resolver maniobra
                    </button>
                  ) : (
                    <strong style={{ fontFamily: fontDisplay, color: victory ? "#2e5f25" : colors.bordoDeep }}>{victory ? "Victoria táctica" : "Derrota táctica"}</strong>
                  )}
                </div>
                <p style={{ margin: "10px 0 6px", fontFamily: fontBody, fontSize: 14 }}>
                  Enclave activo: <strong>{selected?.name}</strong> · Prueba de <strong>{LOCATION_TYPE_LABEL[selected?.type]}</strong>.
                </p>
                <ul style={{ margin: 0, paddingLeft: 18, fontFamily: fontBody, fontSize: 14, lineHeight: 1.5 }}>
                  {log.length === 0 && <li>Sin maniobras aún. Selecciona un enclave y pulsa «Resolver maniobra».</li>}
                  {log.map((entry) => (
                    <li key={entry.id}>
                      <strong>{entry.success ? "Éxito" : "Fallo"}</strong> · {entry.place} · {entry.detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginTop: "36px" }}>
          <button onClick={onBack} style={{ fontFamily: fontMono, fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", background: colors.paperLight, color: colors.ink, border: `1px solid ${colors.ink}`, padding: "14px 28px", cursor: "pointer" }}>← Volver al dictamen</button>
          <button onClick={onRestart} style={{ fontFamily: fontMono, fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", background: colors.ink, color: colors.paperLight, border: `1px solid ${colors.ink}`, padding: "14px 28px", cursor: "pointer" }}>Abrir nuevo expediente</button>
        </div>
      </div>
    </div>
  );
}
