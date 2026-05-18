"use client";

import { useState } from "react";
import { MiniOrnament } from "./Seal.jsx";
import { colors, fontDisplay, fontBody, fontMono } from "@/lib/constants.js";

export default function ResultScreen({ result, onRestart }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const summary =
      `ARCHIVO HERMÉTICO — Expediente ${result.file_number}\n\n` +
      result.matches
        .map((m, i) => `${i + 1}. ${m.name} — ${m.match_percent}%\n   ${m.epitaph}\n\n${m.justification}\n`)
        .join("\n") +
      `\n— ${result.verdict}`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Archivo Hermético",
          text: `Mi expediente: ${result.matches[0].name} (${result.matches[0].match_percent}%), ${result.matches[1].name} (${result.matches[1].match_percent}%) y ${result.matches[2].name} (${result.matches[2].match_percent}%). — ${result.verdict}`,
          url: window.location.href,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "48px 16px", color: colors.ink }}>
      <div style={{ maxWidth: "780px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", borderBottom: `2px double ${colors.bordo}`, paddingBottom: "20px", marginBottom: "40px" }}>
          <div style={{ fontFamily: fontMono, fontSize: "11px", letterSpacing: "3px", color: colors.bordo, textTransform: "uppercase", marginBottom: "6px" }}>
            Dictamen preliminar
          </div>
          <h1 style={{ fontFamily: fontDisplay, fontSize: "44px", letterSpacing: "3px", margin: "0 0 6px 0", color: colors.ink, fontWeight: "normal" }}>
            ARCHIVO HERMÉTICO
          </h1>
          <div style={{ fontFamily: fontMono, fontSize: "12px", letterSpacing: "2px", color: colors.bordoDeep }}>
            Expediente {result.file_number}
          </div>
        </div>

        {result.matches.map((m, i) => (
          <div key={i} style={{ border: `1px solid ${colors.ink}`, background: colors.paperLight, marginBottom: "32px", position: "relative", boxShadow: `3px 3px 0 ${colors.bordo}` }}>
            <div style={{ borderBottom: `1px solid ${colors.ink}`, padding: "16px 24px", background: colors.paper, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: fontMono, fontSize: "10px", letterSpacing: "3px", color: colors.bordo, textTransform: "uppercase" }}>
                  {["Coincidencia primera", "Coincidencia segunda", "Coincidencia tercera"][i]}
                </div>
                <h3 style={{ fontFamily: fontDisplay, fontSize: "28px", letterSpacing: "1px", margin: "4px 0 0 0", color: colors.ink, fontWeight: "normal", lineHeight: 1.15 }}>
                  {m.name}
                </h3>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: fontDisplay, fontSize: "38px", color: colors.bordo, lineHeight: 1 }}>
                  {m.match_percent}<span style={{ fontSize: "20px" }}>%</span>
                </div>
                <div style={{ fontFamily: fontMono, fontSize: "9px", letterSpacing: "2px", color: colors.bordoDeep, textTransform: "uppercase", marginTop: "2px" }}>
                  Afinidad hermética
                </div>
              </div>
            </div>

            <div style={{ padding: "20px 28px 24px 28px" }}>
              <div style={{ fontFamily: fontMono, fontSize: "12px", letterSpacing: "1px", color: colors.bordoDeep, marginBottom: "16px", fontStyle: "italic" }}>
                {m.epitaph}
              </div>
              <div style={{ fontFamily: fontBody, fontSize: "17px", lineHeight: "1.6", color: colors.ink, whiteSpace: "pre-wrap", marginBottom: m.hits && m.hits.length > 0 ? "20px" : 0 }}>
                {m.justification}
              </div>

              {m.hits && m.hits.length > 0 && (
                <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: `1px dashed ${colors.bordoDeep}` }}>
                  <div style={{ fontFamily: fontMono, fontSize: "10px", letterSpacing: "2px", color: colors.bordo, textTransform: "uppercase", marginBottom: "10px" }}>
                    Coincidencias específicas registradas
                  </div>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {m.hits.map((h, j) => (
                      <li key={j} style={{ fontFamily: fontBody, fontSize: "15px", color: colors.ink, marginBottom: "6px", paddingLeft: "16px", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, color: colors.bordo }}>›</span>
                        <span style={{ fontStyle: "italic", color: colors.bordoDeep }}>{h.qText}</span>
                        <span style={{ marginLeft: "6px" }}>→ {h.answerText}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}

        <div style={{ textAlign: "center", margin: "48px 0 32px 0", padding: "32px 16px", borderTop: `1px solid ${colors.bordo}`, borderBottom: `1px solid ${colors.bordo}` }}>
          <div style={{ fontFamily: fontMono, fontSize: "10px", letterSpacing: "4px", color: colors.bordo, textTransform: "uppercase", marginBottom: "14px" }}>
            Sentencia de archivo
          </div>
          <p style={{ fontFamily: fontDisplay, fontStyle: "italic", fontSize: "24px", lineHeight: "1.4", color: colors.ink, margin: 0 }}>
            «{result.verdict}»
          </p>
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
            <MiniOrnament />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={handleShare}
            style={{
              fontFamily: fontMono,
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              background: colors.paperLight,
              color: colors.ink,
              border: `1px solid ${colors.ink}`,
              padding: "14px 28px",
              cursor: "pointer",
            }}
          >
            Compartir
          </button>
          <button
            onClick={handleCopy}
            style={{
              fontFamily: fontMono,
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              background: colors.paperLight,
              color: colors.ink,
              border: `1px solid ${colors.ink}`,
              padding: "14px 28px",
              cursor: "pointer",
            }}
          >
            {copied ? "Copiado ✓" : "Copiar dictamen"}
          </button>
          <button
            onClick={onRestart}
            style={{
              fontFamily: fontMono,
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              background: colors.ink,
              color: colors.paperLight,
              border: `1px solid ${colors.ink}`,
              padding: "14px 28px",
              cursor: "pointer",
            }}
          >
            Nuevo expediente
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "48px", fontFamily: fontMono, fontSize: "10px", letterSpacing: "2px", color: colors.bordoDeep, textTransform: "uppercase", opacity: 0.7 }}>
          Logia del Tedio · Hispanias · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
