"use client";

import { useMemo, useState } from "react";
import { MiniOrnament } from "./Seal.jsx";
import PhaseAnnouncer from "./PhaseAnnouncer.jsx";
import CharacterSheet from "./CharacterSheet.jsx";
import MadridMap from "./MadridMap.jsx";
import DialogueModal from "./DialogueModal.jsx";
import WorldClock from "./WorldClock.jsx";
import FactionPanel from "./FactionPanel.jsx";
import ReputationLedger from "./ReputationLedger.jsx";
import QuestTracker from "./QuestTracker.jsx";
import SceneLog from "./SceneLog.jsx";
import DayNightToggle from "./DayNightToggle.jsx";
import { colors, fontDisplay, fontBody, fontMono } from "@/lib/constants.js";
import { MADRID_LOCATIONS, LOCATION_TYPE_LABEL } from "@/lib/madridLocations.js";
import { CONTROL_STATES, actionCost, evaluateVictory } from "@/lib/gameRules.js";
import { useGameState, useGameDispatch } from "@/lib/GameStateContext.js";
import { ACTIONS } from "@/lib/gameState.js";
import { getSponsorsOf, getPoliticianFaction } from "@/lib/politicianPlacements.js";
import { POLITICIAN_TO_NPC, getNpc } from "@/lib/npcs.js";
import { DIALOGUE_TREES } from "@/lib/dialogues.js";
import { clearSave } from "@/lib/persistence.js";

function FinishCard({ finished, character, influence, threat, doom, quests }) {
  const titleMap = {
    victory: "Dictamen favorable",
    defeat: "Expediente cerrado",
    doom: "La Logia cierra el expediente",
  };
  const subMap = {
    victory: "Has mantenido los hilos en tu mano. El Cronoarchivo registrará el éxito en signatura abierta.",
    defeat: "La amenaza venció a la maniobra. El expediente se cierra sin firma propia.",
    doom: "Las páginas se quedan en blanco una a una mientras tú sigues leyendo.",
  };
  const completed = Object.values(quests).filter((q) => q.completed).length;
  return (
    <div style={{ border: `2px solid ${colors.ink}`, background: colors.paperLight, padding: 28, boxShadow: `6px 6px 0 ${colors.bordo}`, textAlign: "center" }}>
      <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 4, color: colors.bordo, textTransform: "uppercase" }}>Fin de partida</div>
      <h2 style={{ fontFamily: fontDisplay, fontSize: 36, margin: "10px 0 6px", fontWeight: "normal" }}>{titleMap[finished] || "Fin"}</h2>
      <p style={{ fontFamily: fontBody, fontStyle: "italic", color: colors.bordoDeep, fontSize: 18 }}>{subMap[finished] || ""}</p>
      <p style={{ fontFamily: fontMono, fontSize: 12, color: colors.ink, letterSpacing: 1 }}>
        Influencia {influence} · Amenaza {threat}/6 · Reloj {doom.value}/{doom.max} · Tramas resueltas {completed}
      </p>
    </div>
  );
}

export default function GameScreen({ onBack, onRestart }) {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [showPhaseCard, setShowPhaseCard] = useState(false);
  const character = state.character;

  const selectedId = state.selectedLocationId || MADRID_LOCATIONS[0].id;
  const selected = useMemo(() => MADRID_LOCATIONS.find((l) => l.id === selectedId) || MADRID_LOCATIONS[0], [selectedId]);
  const selectedControlState = state.control[selected?.id] || CONTROL_STATES.neutral;
  const selectedCost = selected
    ? actionCost({ selectedType: selected.type, selectedControlState, previousType: state.clock.previousType, daynight: state.clock.daynight })
    : 99;

  const apShown = state.clock.ap;
  const maxApShown = state.clock.daynight === "night" ? state.clock.maxApNight : state.clock.maxApDay;
  const uniqueControl = Object.values(state.control).filter((v) => v === CONTROL_STATES.controlled).length;
  const isOver = !!state.finished;

  const handleSelect = (locId) => dispatch({ type: ACTIONS.SELECT_LOCATION, locationId: locId });

  const handleResolve = () => {
    if (isOver || !selected) return;
    dispatch({
      type: ACTIONS.OPEN_ENCOUNTER,
      locationId: selected.id,
      locationType: selected.type,
      apCost: selectedCost,
    });
  };

  const handleSecure = () => dispatch({ type: ACTIONS.SECURE_ENCLAVE });
  const handleToggleDayNight = () => dispatch({ type: ACTIONS.TOGGLE_DAYNIGHT });
  const handleEndRound = () => {
    dispatch({ type: ACTIONS.END_ROUND });
    setShowPhaseCard(true);
  };

  const handlePoliticianClick = (politicianId) => {
    const npcId = POLITICIAN_TO_NPC[politicianId];
    if (!npcId) return;
    const npc = getNpc(npcId);
    if (!npc?.dialogueTreeId) return;
    dispatch({ type: ACTIONS.OPEN_DIALOGUE, dialogueId: npc.dialogueTreeId, apCost: 1 });
  };

  const handleQuit = () => {
    if (confirm("¿Cerrar partida y borrar autoguardado?")) {
      clearSave();
      onRestart();
    }
  };

  const sponsorList = getSponsorsOf(selected.id).map((pid) => {
    const npcId = POLITICIAN_TO_NPC[pid];
    return { politicianId: pid, npcId, faction: getPoliticianFaction(pid), name: getNpc(npcId)?.name || pid };
  });

  const apPips = Array.from({ length: maxApShown }, (_, i) => (i < apShown ? "●" : "○")).join(" ");
  const roundDisplay = Math.min(state.clock.round, state.clock.maxRounds);

  return (
    <div style={{ minHeight: "100vh", padding: "32px 16px 64px 16px", color: colors.ink }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ textAlign: "center", borderBottom: `2px double ${colors.bordo}`, paddingBottom: 16, marginBottom: 24 }}>
          <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 4, color: colors.bordo, textTransform: "uppercase", marginBottom: 6 }}>
            Capítulo I · El sujeto se encarna
          </div>
          <h1 style={{ fontFamily: fontDisplay, fontSize: 44, letterSpacing: 3, margin: "0 0 6px", color: colors.ink, fontWeight: "normal" }}>EL TABLERO DE LA VILLA</h1>
          <p style={{ fontFamily: fontBody, fontStyle: "italic", fontSize: 18, color: colors.bordoDeep, margin: 0 }}>
            Doce rondas · día y noche · pactos, ritos, traiciones. Que el Reloj de la Logia no llegue antes que tú.
          </p>
          <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}><MiniOrnament /></div>
        </div>

        {isOver && (
          <div style={{ marginBottom: 24 }}>
            <FinishCard finished={state.finished} character={character} influence={state.influence} threat={state.threat} doom={state.doom} quests={state.quests} />
          </div>
        )}

        <style>{`@media (min-width: 1100px) {.game-grid {grid-template-columns: 440px minmax(0, 1fr) 320px !important; align-items: start !important;} .game-sticky {position: sticky; top: 24px;}}`}</style>

        <div className="game-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 22, alignItems: "stretch" }}>
          {/* Columna izquierda: ficha + reloj + facciones */}
          <div className="game-sticky" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <CharacterSheet character={character} />
            <WorldClock doom={state.doom} />
            <FactionPanel reputation={state.reputation} />
          </div>

          {/* Columna central: mapa + action bar + bitácora */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <MadridMap
              selectedId={selectedId}
              onSelect={handleSelect}
              control={state.control}
              onPoliticianClick={handlePoliticianClick}
              politicianDispositions={state.reputation.politicians}
            />

            <div style={{ border: `1px solid ${colors.ink}`, background: colors.paperLight, boxShadow: `3px 3px 0 ${colors.bordo}`, padding: 16 }}>
              {/* Zona A: estado permanente */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "baseline", marginBottom: 6 }}>
                  <span style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: colors.bordo }}>
                    RONDA {roundDisplay}/{state.clock.maxRounds} · {state.clock.daynight === "night" ? "NOCHE" : "DÍA"}
                  </span>
                  <span style={{ fontFamily: fontMono, fontSize: 12, letterSpacing: 1, color: colors.ink }} title={`${apShown} de ${maxApShown} puntos de acción`}>
                    PA {apPips}
                  </span>
                  <span style={{ fontFamily: fontMono, fontSize: 11, color: colors.ink }}>Infl. <strong>{state.influence}</strong></span>
                  <span style={{ fontFamily: fontMono, fontSize: 11, color: state.threat >= 4 ? colors.bordo : colors.ink }}>Amen. <strong>{state.threat}/6</strong></span>
                  <span style={{ fontFamily: fontMono, fontSize: 11, color: state.doom.value >= 8 ? colors.bordo : colors.gold }}>Doom <strong>{state.doom.value}/{state.doom.max}</strong></span>
                </div>
                <div style={{ fontFamily: fontDisplay, fontSize: 16, color: colors.bordo, marginBottom: 2 }}>
                  {character?.campaignProfile?.primaryLabel || "Dominio político"}
                </div>
                <div style={{ fontFamily: fontMono, fontSize: 10, letterSpacing: 1, color: colors.bordoDeep, textTransform: "uppercase" }}>
                  {character?.campaignProfile?.secondaryLabel || "Resolver dos tramas"}
                </div>
              </div>

              {/* Zona B: acciones */}
              <div style={{ borderTop: `1px dashed ${colors.bordoDeep}`, paddingTop: 10 }}>
                {!isOver ? (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button disabled={selectedCost > apShown} onClick={handleResolve} style={{ fontFamily: fontMono, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", background: colors.ink, color: colors.paperLight, border: `1px solid ${colors.ink}`, padding: "10px 14px", cursor: selectedCost > apShown ? "not-allowed" : "pointer", opacity: selectedCost > apShown ? 0.5 : 1 }}>
                      Abrir escena ({selectedCost} PA)
                    </button>
                    <button disabled={apShown < 1} onClick={handleSecure} style={{ fontFamily: fontMono, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", background: colors.paper, color: colors.ink, border: `1px solid ${colors.ink}`, padding: "10px 14px", cursor: apShown < 1 ? "not-allowed" : "pointer", opacity: apShown < 1 ? 0.5 : 1 }}>
                      Asegurar (1 PA, −1 amenaza)
                    </button>
                    <DayNightToggle daynight={state.clock.daynight} onToggle={handleToggleDayNight} disabled={false} />
                    <button onClick={handleEndRound} style={{ fontFamily: fontMono, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", background: colors.bordo, color: colors.paperLight, border: `1px solid ${colors.bordoDeep}`, padding: "10px 14px", cursor: "pointer", boxShadow: `2px 2px 0 ${colors.ink}` }}>
                      Cerrar ronda
                    </button>
                  </div>
                ) : (
                  <strong style={{ fontFamily: fontDisplay, color: state.finished === "victory" ? "#2e5f25" : colors.bordoDeep }}>
                    {state.finished === "victory" ? "Victoria táctica" : "Derrota táctica"}
                  </strong>
                )}
                <p style={{ margin: "10px 0 4px", fontFamily: fontBody, fontSize: 14 }}>
                  Enclave activo: <strong>{selected?.name}</strong> · Prueba de <strong>{LOCATION_TYPE_LABEL[selected?.type]}</strong> · Estado <strong>{selectedControlState}</strong>.
                </p>
                {sponsorList.length > 0 && (
                  <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.bordoDeep, letterSpacing: 1, textTransform: "uppercase", marginTop: 6, paddingTop: 6, borderTop: `1px dashed ${colors.bordoDeep}` }}>
                    Patrocinadores · {sponsorList.map((s) => s.name).join(" · ")}
                  </div>
                )}
                <div style={{ marginTop: 8, fontFamily: fontMono, fontSize: 10, letterSpacing: 1, color: colors.bordoDeep }}>
                  Click en marcador del enclave: seleccionar · Click en orbital de patrocinador: abrir conversación (1 PA).
                </div>
              </div>
            </div>

            <SceneLog log={state.log} />
          </div>

          {/* Columna derecha: quests + memorial */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <QuestTracker state={state} />
            <ReputationLedger reputation={state.reputation} npcs={state.npcs} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginTop: 36 }}>
          <button onClick={onBack} style={{ fontFamily: fontMono, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", background: colors.paperLight, color: colors.ink, border: `1px solid ${colors.ink}`, padding: "14px 28px", cursor: "pointer" }}>← Volver al dictamen</button>
          <button onClick={handleQuit} style={{ fontFamily: fontMono, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", background: colors.ink, color: colors.paperLight, border: `1px solid ${colors.ink}`, padding: "14px 28px", cursor: "pointer" }}>Cerrar expediente y borrar partida</button>
        </div>
      </div>

      <DialogueModal />
      {showPhaseCard && !isOver && (
        <PhaseAnnouncer
          round={roundDisplay}
          maxRounds={state.clock.maxRounds}
          daynight={state.clock.daynight}
          ap={apShown}
          maxAp={maxApShown}
          objective={character?.campaignProfile?.primaryLabel}
          onDismiss={() => setShowPhaseCard(false)}
        />
      )}
    </div>
  );
}
