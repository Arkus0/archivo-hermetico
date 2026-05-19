"use client";

import { useMemo } from "react";
import { colors, fontDisplay, fontBody, fontMono } from "@/lib/constants.js";
import { useGameState, useGameDispatch } from "@/lib/GameStateContext.js";
import { ACTIONS } from "@/lib/gameState.js";
import { getEncounter } from "@/lib/encounters.js";
import { DIALOGUE_TREES, getDialogueNode } from "@/lib/dialogues.js";
import { getNpc } from "@/lib/npcs.js";
import CheckResultToast from "./CheckResultToast.jsx";
import { GRADE_LABEL } from "@/lib/checks.js";

function optionEnabled(opt, state) {
  if (opt.cost?.ap && state.clock.ap < opt.cost.ap) return { ok: false, reason: `Sin PA suficientes (necesita ${opt.cost.ap})` };
  if (opt.requires) {
    const r = opt.requires;
    if (r.repFactionMin) {
      const [fac, min] = r.repFactionMin;
      if ((state.reputation.factions[fac] ?? 0) < min) return { ok: false, reason: `Falta reputación con ${fac}` };
    }
    if (r.questCompleted) {
      const q = state.quests[r.questCompleted];
      if (!q?.completed) return { ok: false, reason: "Trama no resuelta" };
    }
    if (r.statusYes && !state.character.statuses.some((s) => s.name === r.statusYes)) return { ok: false, reason: `Requiere estado: ${r.statusYes}` };
  }
  return { ok: true };
}

function DoomEventCard({ event, onDismiss }) {
  const isPolitical = !!event.isPolitical;
  const accentColor = isPolitical ? colors.gold : colors.bordo;
  const header = isPolitical
    ? `Evento político · ronda ${event.round || ""}`
    : `Reloj de la Logia · umbral ${event.threshold}`;
  return (
    <div style={{ borderTop: `2px double ${accentColor}`, paddingTop: 14, marginTop: 16 }}>
      <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 3, color: accentColor, textTransform: "uppercase" }}>{header}</div>
      <h2 style={{ fontFamily: fontDisplay, fontSize: 26, margin: "6px 0 10px", fontWeight: "normal" }}>{event.title}</h2>
      <p style={{ fontFamily: fontBody, fontSize: 17, lineHeight: 1.55, margin: "0 0 16px" }}>{event.text}</p>
      <button onClick={onDismiss} style={{ fontFamily: fontMono, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", background: colors.ink, color: colors.paperLight, border: `1px solid ${colors.ink}`, padding: "10px 18px", cursor: "pointer" }}>
        Continuar
      </button>
    </div>
  );
}

export default function DialogueModal() {
  const state = useGameState();
  const dispatch = useGameDispatch();

  // Prioridad: doom events pendientes antes que la escena
  const doomEvent = state.pendingDoomEvents?.[0] || null;
  const scene = state.currentScene;
  const visible = !!(doomEvent || scene);

  const content = useMemo(() => {
    if (doomEvent) return null;
    if (!scene) return null;
    if (scene.kind === "encounter") {
      const enc = getEncounter(scene.id);
      return enc ? { kind: "encounter", title: enc.title, intro: enc.intro, options: enc.options || [] } : null;
    }
    if (scene.kind === "dialogue") {
      const tree = DIALOGUE_TREES[scene.id];
      const node = getDialogueNode(scene.id, scene.nodeId);
      const npc = tree ? getNpc(tree.npcId) : null;
      return tree && node
        ? { kind: "dialogue", title: npc?.name || "NPC", subtitle: npc?.role, flavor: npc?.flavor, intro: node.text, options: node.options || [] }
        : null;
    }
    return null;
  }, [scene, doomEvent]);

  if (!visible) return null;

  const handleChoose = (opt) => {
    const e = optionEnabled(opt, state);
    if (!e.ok) return;
    dispatch({ type: ACTIONS.CHOOSE_OPTION, choice: opt });
  };

  const close = () => dispatch({ type: ACTIONS.CLOSE_SCENE });
  const dismissDoom = () => dispatch({ type: ACTIONS.DISMISS_DOOM_EVENT });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,20,16,0.78)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 18, overflowY: "auto" }}>
      <div style={{ width: "min(720px, 100%)", background: colors.paperLight, border: `2px solid ${colors.ink}`, boxShadow: `6px 6px 0 ${colors.bordo}`, padding: 24, maxHeight: "92vh", overflowY: "auto" }}>
        {doomEvent ? (
          <DoomEventCard event={doomEvent} onDismiss={dismissDoom} />
        ) : (
          content && (
            <>
              <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 3, color: colors.bordo, textTransform: "uppercase", marginBottom: 4 }}>
                {content.kind === "dialogue" ? "Conversación" : "Escena"}
              </div>
              <h2 style={{ fontFamily: fontDisplay, fontSize: 30, margin: "2px 0 4px", fontWeight: "normal" }}>{content.title}</h2>
              {content.subtitle && (
                <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.bordoDeep, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>{content.subtitle}</div>
              )}
              {content.flavor && (
                <p style={{ fontFamily: fontBody, fontSize: 14, fontStyle: "italic", color: colors.bordoDeep, margin: "0 0 12px", borderLeft: `3px solid ${colors.bordo}`, paddingLeft: 10 }}>{content.flavor}</p>
              )}
              <p style={{ fontFamily: fontBody, fontSize: 17, lineHeight: 1.55, margin: "0 0 14px" }}>{content.intro}</p>

              {scene?.lastCheck && <CheckResultToast check={scene.lastCheck} />}

              <div style={{ borderTop: `1px solid ${colors.bordo}`, borderBottom: `1px solid ${colors.bordo}`, padding: "6px 10px", margin: "12px 0 0", background: colors.paperDeep }}>
                <span style={{ fontFamily: fontMono, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: colors.bordo }}>MECÁNICAS · elige acción</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
                {content.options.map((opt) => {
                  const e = optionEnabled(opt, state);
                  return (
                    <button
                      key={opt.id || opt.label}
                      onClick={() => handleChoose(opt)}
                      disabled={!e.ok}
                      title={e.reason || ""}
                      style={{
                        textAlign: "left",
                        background: e.ok ? colors.paper : "#dcd2b9",
                        border: `1px solid ${colors.ink}`,
                        padding: "10px 14px",
                        cursor: e.ok ? "pointer" : "not-allowed",
                        opacity: e.ok ? 1 : 0.55,
                        fontFamily: fontBody,
                        fontSize: 15,
                        boxShadow: e.ok ? `2px 2px 0 ${colors.bordo}` : "none",
                      }}
                    >
                      <div style={{ fontFamily: fontDisplay, fontSize: 16 }}>{opt.label}</div>
                      <div style={{ fontFamily: fontMono, fontSize: 10, letterSpacing: 1, color: colors.bordoDeep, textTransform: "uppercase", marginTop: 4 }}>
                        {opt.cost?.ap ? `Coste ${opt.cost.ap} PA · ` : ""}
                        {opt.check ? `Prueba ${opt.check.stat.replace("_", " ")} ≥ ${opt.check.difficulty}` : "Sin tirada"}
                        {!e.ok && e.reason ? ` · ${e.reason}` : ""}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px dashed ${colors.bordoDeep}`, paddingTop: 10 }}>
                <span style={{ fontFamily: fontMono, fontSize: 10, letterSpacing: 1, color: colors.bordoDeep, textTransform: "uppercase" }}>Cuatro grados: {Object.values(GRADE_LABEL).join(" · ")}</span>
                <button onClick={close} style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", background: "transparent", border: `1px solid ${colors.ink}`, padding: "6px 12px", cursor: "pointer" }}>Cerrar escena</button>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
