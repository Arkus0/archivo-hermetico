"use client";

import { useState, useRef } from "react";
import { Seal, MiniOrnament } from "./Seal.jsx";
import { colors, fontDisplay, fontBody, fontMono } from "@/lib/constants.js";

function makeIntroFileNumber() {
  const romans = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
  const greek = ["Α","Β","Γ","Δ","Ε","Ζ","Η","Θ","Λ","Μ","Ξ","Π","Σ","Φ","Ψ","Ω"];
  const year = 1700 + Math.floor(Math.random() * 325);
  const a = romans[Math.floor(Math.random()*romans.length)];
  const b = greek[Math.floor(Math.random()*greek.length)];
  const c = romans[Math.floor(Math.random()*romans.length)];
  return `${a}-${year}-${b}-${c}`;
}

export default function IntroScreen({ onStart, onContinue }) {
  const [mode, setMode] = useState(30);
  const fileNum = useRef(makeIntroFileNumber()).current;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "48px 24px", color: colors.ink }}>
      <div style={{ textAlign: "center", maxWidth: "720px", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", fontFamily: fontMono, fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: colors.bordo }}>
          <span>Expediente Nº {fileNum}</span>
          <span>Uso interno · No reproducir</span>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <Seal size={190} />
        </div>

        <h1 style={{ fontFamily: fontDisplay, fontSize: "64px", lineHeight: "1", letterSpacing: "4px", margin: "0 0 8px 0", color: colors.ink, fontWeight: "normal" }}>
          ARCHIVO<br />HERMÉTICO
        </h1>

        <div style={{ margin: "16px 0", display: "flex", justifyContent: "center" }}>
          <MiniOrnament />
        </div>

        <p style={{ fontFamily: fontBody, fontStyle: "italic", fontSize: "24px", color: colors.bordoDeep, margin: "0 0 4px 0" }}>
          Identificación esotérico-política del sujeto
        </p>
        <p style={{ fontFamily: fontMono, fontSize: "13px", letterSpacing: "1.5px", color: colors.ink, opacity: 0.7, margin: "0 0 32px 0" }}>
          Logia del Tedio · Sección Hispanias · est. <em>circa</em> MDCCCXXXII
        </p>

        <div style={{ borderTop: `1px solid ${colors.bordo}`, borderBottom: `1px solid ${colors.bordo}`, padding: "24px 16px", margin: "24px 0" }}>
          <p style={{ fontFamily: fontBody, fontSize: "20px", lineHeight: "1.55", color: colors.ink, margin: "0 0 16px 0" }}>
            El sujeto responderá a un cuestionario hermético-político. El Archivo
            cotejará sus respuestas con los expedientes de treinta políticos españoles
            —vivos, muertos, fusilados, exiliados, indultados o ascendidos a los
            cielos— y emitirá un <em>dictamen de afinidad</em> en triple grado.
            Al término podrá <em>encarnarse</em> en uno de ellos y abrir el plano
            hermético de Madrid.
          </p>
          <p style={{ fontFamily: fontBody, fontSize: "18px", fontStyle: "italic", color: colors.bordoDeep, margin: 0 }}>
            La sinceridad no se exige; se delata sola.
          </p>
        </div>

        <div style={{ margin: "32px 0 24px 0" }}>
          <p style={{ fontFamily: fontMono, fontSize: "13px", letterSpacing: "3px", color: colors.bordo, textTransform: "uppercase", marginBottom: "14px" }}>
            Seleccione la profundidad del expediente
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
            {[
              { n: 30, label: "Breve", desc: "diez minutos" },
              { n: 50, label: "Estándar", desc: "veinte minutos" },
              { n: 80, label: "Exhaustivo", desc: "una tarde entera" },
            ].map((m) => {
              const selected = mode === m.n;
              return (
                <button
                  key={m.n}
                  onClick={() => setMode(m.n)}
                  style={{
                    fontFamily: fontMono,
                    background: selected ? colors.ink : "transparent",
                    color: selected ? colors.paper : colors.ink,
                    border: `1px solid ${colors.ink}`,
                    padding: "16px 24px",
                    minWidth: "160px",
                    cursor: "pointer",
                    letterSpacing: "1.5px",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: "26px", fontFamily: fontDisplay, letterSpacing: "1px" }}>{m.n}</div>
                  <div style={{ fontSize: "12px", textTransform: "uppercase", opacity: 0.9, marginTop: "2px" }}>{m.label}</div>
                  <div style={{ fontSize: "11px", fontStyle: "italic", opacity: 0.7, marginTop: "2px" }}>{m.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          <button
            onClick={() => onStart(mode)}
            style={{
              fontFamily: fontDisplay,
              background: colors.bordo,
              color: colors.paperLight,
              border: `1px solid ${colors.bordoDeep}`,
              padding: "18px 52px",
              fontSize: "24px",
              letterSpacing: "5px",
              textTransform: "uppercase",
              cursor: "pointer",
              marginTop: "8px",
              boxShadow: `2px 2px 0 ${colors.ink}`,
            }}
          >
            Abrir Expediente
          </button>
          {onContinue && (
            <button
              onClick={onContinue}
              style={{
                fontFamily: fontMono,
                background: colors.paperLight,
                color: colors.ink,
                border: `1px solid ${colors.ink}`,
                padding: "10px 28px",
                fontSize: "13px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
              title="Cargar partida guardada en este navegador"
            >
              ↺ Continuar partida guardada
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
