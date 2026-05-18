"use client";

import { useMemo, useState } from "react";
import { MiniOrnament } from "./Seal.jsx";
import CharacterSheet from "./CharacterSheet.jsx";
import MadridMap from "./MadridMap.jsx";
import { colors, fontDisplay, fontBody, fontMono } from "@/lib/constants.js";
import { MADRID_LOCATIONS, LOCATION_TYPE_LABEL } from "@/lib/madridLocations.js";
import { CONTROL_STATES, actionCost, evaluateVictory, resolveAction } from "@/lib/gameRules.js";

export default function GameScreen({ character, onBack, onRestart }) {
  const [selectedId, setSelectedId] = useState(MADRID_LOCATIONS[0].id);
  const [control, setControl] = useState({});
  const [actionPoints, setActionPoints] = useState(4);
  const [previousType, setPreviousType] = useState(null);
  const [lastEventId, setLastEventId] = useState(null);
  const [round, setRound] = useState(1);
  const [influence, setInfluence] = useState(0);
  const [threat, setThreat] = useState(character?.campaignProfile?.initialThreat ?? 0);
  const [log, setLog] = useState([]);
  const [eventLog, setEventLog] = useState([]);

  const selected = useMemo(() => MADRID_LOCATIONS.find((l) => l.id === selectedId) || MADRID_LOCATIONS[0], [selectedId]);
  const maxRounds = 8;
  const isOver = round > maxRounds || threat >= 6;
  const uniqueControl = Object.values(control).filter((v) => v === CONTROL_STATES.controlled).length;
  const victory = evaluateVictory({ campaignProfile: character.campaignProfile, influence, uniqueControl, threat, round, maxRounds });
  const selectedControlState = control[selected?.id] || CONTROL_STATES.neutral;
  const selectedCost = selected ? actionCost({ selectedType: selected.type, selectedControlState, previousType }) : 99;

  const resolveTurn = () => {
    if (isOver || !selected) return;
    const result = resolveAction({
      character,
      selectedLocation: selected,
      selectedControlState,
      round,
      influence,
      threat,
      ap: actionPoints,
      previousType,
      lastEventId,
    });
    if (result.apSpent > actionPoints) return;

    setControl((prev) => ({ ...prev, [selected.id]: result.nextControlState }));
    setInfluence((prev) => prev + result.influenceDelta);
    setThreat((prev) => prev + result.threatDelta);
    setActionPoints((ap) => ap - result.apSpent);
    setPreviousType(selected.type);
    setLastEventId(result.event.id);

    setLog((prev) => [
      {
        id: `${round}-${selected.id}`,
        place: selected.name,
        success: result.success,
        detail: `${LOCATION_TYPE_LABEL[selected.type]} · tirada ${result.dice} + ${Math.floor(result.effectiveStat / 2)} (${result.statKey.replace("_", " ")}) vs ${result.difficulty} · coste ${result.apSpent} PA`,
      },
      ...prev,
    ].slice(0, 8));

    setEventLog((prev) => [
      {
        id: `${round}-${result.event.id}`,
        name: result.event.name,
        success: result.eventSuccess,
        detail: result.eventSuccess ? result.event.success.text : result.event.fail.text,
        flavor: result.event.flavor,
        reason: result.triggerReason,
      },
      ...prev,
    ].slice(0, 5));

    if (actionPoints - result.apSpent <= 0) {
      setRound((r) => r + 1);
      setActionPoints(4);
    }
  };

  const endRoundDefensive = () => {
    if (isOver) return;
    setThreat((t) => Math.max(0, t - 1));
    setRound((r) => r + 1);
    setActionPoints(4);
    setPreviousType(null);
    setLog((prev) => [{ id: `${round}-def`, place: "Asegurar enclaves", success: true, detail: "Acción defensiva: -1 Amenaza y fin de ronda" }, ...prev].slice(0,8));
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
                    Ronda {Math.min(round, maxRounds)}/{maxRounds} · PA {actionPoints}/4 · Influencia {influence} · Amenaza {threat}/6
                  </div>
                  {!isOver ? (
                    <>
                      <button disabled={selectedCost > actionPoints} onClick={resolveTurn} style={{ fontFamily: fontMono, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", background: colors.ink, color: colors.paperLight, border: `1px solid ${colors.ink}`, padding: "10px 14px", cursor: "pointer" }}>
                        Resolver maniobra ({selectedCost} PA)
                      </button>
                      <button onClick={endRoundDefensive} style={{ fontFamily: fontMono, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", background: colors.paper, color: colors.ink, border: `1px solid ${colors.ink}`, padding: "10px 14px", cursor: "pointer" }}>Asegurar enclave (-1 amenaza)</button>
                    </>
                  ) : (
                    <strong style={{ fontFamily: fontDisplay, color: victory ? "#2e5f25" : colors.bordoDeep }}>{victory ? "Victoria táctica" : "Derrota táctica"}</strong>
                  )}
                </div>
                <p style={{ margin: "10px 0 6px", fontFamily: fontBody, fontSize: 14 }}>
                  Enclave activo: <strong>{selected?.name}</strong> · Prueba de <strong>{LOCATION_TYPE_LABEL[selected?.type]}</strong> · Estado <strong>{selectedControlState}</strong>.
                </p>
                <p style={{ margin: "4px 0 8px", fontFamily: fontBody, fontSize: 13, color: colors.bordoDeep }}>Objetivo principal: <strong>{character?.campaignProfile?.primaryLabel || "Dominio político"}</strong>. Secundario: {character?.campaignProfile?.secondaryLabel || "Controlar 2 enclaves de saber"}.</p>
                <ul style={{ margin: 0, paddingLeft: 18, fontFamily: fontBody, fontSize: 14, lineHeight: 1.5 }}>
                  {log.length === 0 && <li>Sin maniobras aún. Selecciona un enclave y pulsa «Resolver maniobra».</li>}
                  {log.map((entry) => (
                    <li key={entry.id}>
                      <strong>{entry.success ? "Éxito" : "Fallo"}</strong> · {entry.place} · {entry.detail}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 10, fontFamily: fontBody, fontSize: 14 }}>
                  <strong>Eventos NPC (políticos):</strong>
                  <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                    {eventLog.length === 0 && <li>Aún no han aparecido intermediarios ni barones.</li>}
                    {eventLog.map((e) => <li key={e.id}><strong>{e.success ? "Acuerdo" : "Choque"}</strong> · {e.name} · {e.flavor} {e.detail} <em>({e.reason})</em></li>)}
                  </ul>
                </div>
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
