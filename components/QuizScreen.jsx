"use client";

import { colors, fontDisplay, fontBody, fontMono } from "@/lib/constants.js";

export default function QuizScreen({ questions, answers, currentIdx, onAnswer, onBack, fileNumber }) {
  const q = questions[currentIdx];
  const progress = (currentIdx / questions.length) * 100;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", color: colors.ink }}>
      <div style={{ padding: "20px 32px", borderBottom: `1px solid ${colors.bordo}`, background: colors.paperLight }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: fontMono, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: colors.bordo }}>
          <span>Expediente {fileNumber}</span>
          <span>{currentIdx + 1} <span style={{ opacity: 0.5 }}>/ {questions.length}</span></span>
        </div>
        <div style={{ height: "3px", background: colors.paperDeep, marginTop: "10px", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${progress}%`, background: colors.bordo, transition: "width 0.3s" }} />
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ maxWidth: "680px", width: "100%" }}>
          <div style={{ fontFamily: fontMono, fontSize: "11px", letterSpacing: "3px", color: colors.bordo, textTransform: "uppercase", marginBottom: "16px", textAlign: "center" }}>
            Pregunta {currentIdx + 1}
          </div>

          <h2 style={{ fontFamily: fontDisplay, fontSize: "30px", lineHeight: "1.3", textAlign: "center", marginBottom: "36px", color: colors.ink, fontWeight: "normal" }}>
            {q.text}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {q.options.map((opt, i) => {
              const letter = ["A", "B", "C", "D"][i];
              return (
                <button
                  key={i}
                  onClick={() => onAnswer(i)}
                  style={{
                    fontFamily: fontBody,
                    fontSize: "18px",
                    textAlign: "left",
                    background: colors.paperLight,
                    color: colors.ink,
                    border: `1px solid ${colors.ink}`,
                    padding: "16px 22px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    lineHeight: "1.35",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.ink;
                    e.currentTarget.style.color = colors.paperLight;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = colors.paperLight;
                    e.currentTarget.style.color = colors.ink;
                  }}
                >
                  <span style={{ fontFamily: fontMono, fontSize: "13px", marginRight: "14px", letterSpacing: "1px", opacity: 0.7 }}>{letter}.</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {currentIdx > 0 && (
            <div style={{ marginTop: "24px", textAlign: "center" }}>
              <button
                onClick={onBack}
                style={{
                  fontFamily: fontMono,
                  fontSize: "11px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  background: "transparent",
                  border: "none",
                  color: colors.bordoDeep,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                ← Volver a la pregunta anterior
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
