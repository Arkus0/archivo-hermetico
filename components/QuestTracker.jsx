"use client";

import { colors, fontDisplay, fontBody, fontMono } from "@/lib/constants.js";
import { QUESTS, getActiveActs } from "@/lib/quests.js";

export default function QuestTracker({ state }) {
  const active = getActiveActs(state);
  const completed = Object.entries(state.quests || {}).filter(([, q]) => q.completed).map(([id]) => QUESTS[id]).filter(Boolean);
  const failed = Object.entries(state.quests || {}).filter(([, q]) => q.failed).map(([id]) => QUESTS[id]).filter(Boolean);

  return (
    <div style={{ border: `1px solid ${colors.ink}`, background: colors.paperLight, boxShadow: `3px 3px 0 ${colors.bordo}`, padding: 14 }}>
      <div style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 3, color: colors.bordo, textTransform: "uppercase", marginBottom: 10 }}>Tramas en curso</div>
      {active.length === 0 && (
        <p style={{ fontFamily: fontDisplay, fontSize: 14, color: colors.bordoDeep, fontStyle: "italic", margin: 0 }}>Aún no se ha abierto trama alguna.</p>
      )}
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
        {active.map(({ quest, state: qst, act }) => (
          <li key={quest.id} style={{ borderLeft: `3px solid ${colors.bordo}`, paddingLeft: 8 }}>
            <div style={{ fontFamily: fontDisplay, fontSize: 16 }}>{quest.title}</div>
            <div style={{ fontFamily: fontBody, fontSize: 13, fontStyle: "italic", color: colors.bordoDeep, marginBottom: 4 }}>{quest.premise}</div>
            <div style={{ fontFamily: fontMono, fontSize: 10, letterSpacing: 1, color: colors.ink, textTransform: "uppercase" }}>Acto {qst.stage + 1}/{quest.acts.length} · {act?.goal || "—"}</div>
            {qst.clues.length > 0 && (
              <div style={{ fontFamily: fontMono, fontSize: 10, color: colors.bordoDeep, marginTop: 3 }}>Pistas: {qst.clues.length} · {qst.clues.slice(0, 4).join(", ")}{qst.clues.length > 4 ? "…" : ""}</div>
            )}
          </li>
        ))}
      </ul>
      {(completed.length > 0 || failed.length > 0) && (
        <div style={{ marginTop: 10, fontFamily: fontMono, fontSize: 10, letterSpacing: 1, color: colors.bordoDeep, textTransform: "uppercase" }}>
          {completed.length > 0 && <div>Resueltas: {completed.map((q) => q.title).join(" · ")}</div>}
          {failed.length > 0 && <div>Frustradas: {failed.map((q) => q.title).join(" · ")}</div>}
        </div>
      )}
    </div>
  );
}
