"use client";

import { colors, fontDisplay, fontMono } from "@/lib/constants.js";
import { GRADE_LABEL, GRADE_HINT } from "@/lib/checks.js";

const COLOR = {
  critical: "#2e5f25",
  success: "#1a4a16",
  fail: "#7a2721",
  fumble: "#5C1820",
};

export default function CheckResultToast({ check }) {
  if (!check) return null;
  return (
    <div style={{ border: `2px solid ${COLOR[check.grade] || colors.ink}`, padding: "8px 12px", background: colors.paper, marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
      <div>
        <div style={{ fontFamily: fontMono, fontSize: 10, letterSpacing: 2, color: COLOR[check.grade] || colors.ink, textTransform: "uppercase" }}>{GRADE_LABEL[check.grade] || check.grade}</div>
        <div style={{ fontFamily: fontDisplay, fontSize: 14, color: colors.bordoDeep, fontStyle: "italic" }}>{GRADE_HINT[check.grade] || ""}</div>
      </div>
      <div style={{ fontFamily: fontMono, fontSize: 11, color: colors.ink, textAlign: "right" }}>
        <div>D6: <strong>{check.dice}</strong> + bono <strong>{check.statBonus}</strong>{check.modSum ? ` + mod ${check.modSum >= 0 ? "+" : ""}${check.modSum}` : ""}</div>
        <div>Total <strong>{check.total}</strong> · Dif {check.difficulty}</div>
      </div>
    </div>
  );
}
