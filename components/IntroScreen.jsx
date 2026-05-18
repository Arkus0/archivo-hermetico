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

export default function IntroScreen({ onStart }) {
  const [mode, setMode] = useState(30);
  const fileNum = useRef(makeIntroFileNumber()).current;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "48px 24px", color: colors.ink }}>
      <div style={{ textAlign: "center", maxWidth: "640px", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", fontFamily: fontMono, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: colors.bordo }}>
          <span>Expediente Nº {fileNum}</span>
          <span>Uso interno · No reproducir</span>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <Seal size={170} />
        </div>

        <h1 style={{ fontFamily: fontDisplay, fontSize: "54px", lineHeight: "1", letterSpacing: "4px", margin: "0 0 8px 0", color: colors.ink, fontWeight: "normal" }}>
          ARCHIVO<br />HERMÉTICO
        </h1>

        <div style={{ margin: "16px 0", display: "flex", justifyContent: "center" }}>
          <MiniOrnament />
        </div>

        <p style={{ fontFamily: fontBody, fontStyle: "italic", fontSize: "20px", color: colors.bordoDeep, margin: "0 0 4px 0" }}>
          Identificación esotérico-política del sujeto
        </p>
        <p style={{ fontFamily: fontMono, fontSize: "11px", letterSpacing: "1.5px", color: colors.ink, opacity: 0.7, margin: "0 0 32px 0" }}>
          Logia del Tedio · Sección Hispanias · est. <em>circa</em> MDCCCXXXII
        </p>

        <div style={{ borderTop: `1px solid ${colors.bordo}`, borderBottom: `1px solid ${colors.bordo}`, padding: "24px 16px", margin: "24px 0" }}>
          <p style={{ fontFamily: fontBody, fontSize: "17px", lineHeight: "1.55", color: colors.ink, margin: "0 0 16px 0" }}>
            El sujeto responderá a un cuestionario hermético-político. El Archivo
            cruzará sus respuestas con los expedientes de políticos españoles —
            vivos, muertos, fusilados, exiliados, indultados, ascendidos a los
            cielos — y emitirá un <em>dictamen de afinidad</em> en triple grado.
          </p>
          <p style={{ fontFamily: fontBody, fontSize: "15px", fontStyle: "italic", color: colors.bordoDeep, margin: 0 }}>
            La sinceridad no se exige, pero se nota.
          </p>
        </div>

        <div style={{ margin: "32px 0 24px 0" }}>
          <p style={{ fontFamily: fontMono, fontSize: "11px", letterSpacing: "3px", color: colors.bordo, textTransform: "uppercase", marginBottom: "12px" }}>
            Seleccione la profundidad del expediente
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
            {[
              { n: 30, label: "Breve", desc: "diez minutos" },
              { n: 50, label: "Estándar", desc: "veinte minutos" },
              { n: 80, label: "Exhaustivo", desc: "media tarde" },
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
                    padding: "14px 22px",
                    minWidth: "140px",
                    cursor: "pointer",
                    letterSpacing: "1.5px",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: "20px", fontFamily: fontDisplay, letterSpacing: "1px" }}>{m.n}</div>
                  <div style={{ fontSize: "10px", textTransform: "uppercase", opacity: 0.9 }}>{m.label}</div>
                  <div style={{ fontSize: "9px", fontStyle: "italic", opacity: 0.7, marginTop: "2px" }}>{m.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => onStart(mode)}
          style={{
            fontFamily: fontDisplay,
            background: colors.bordo,
            color: colors.paperLight,
            border: `1px solid ${colors.bordoDeep}`,
            padding: "16px 48px",
            fontSize: "20px",
            letterSpacing: "5px",
            textTransform: "uppercase",
            cursor: "pointer",
            marginTop: "8px",
            boxShadow: `2px 2px 0 ${colors.ink}`,
          }}
        >
          Abrir Expediente
        </button>
      </div>
    </div>
  );
}
