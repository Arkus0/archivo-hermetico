"use client";

import { useState, useEffect } from "react";
import { Seal } from "./Seal.jsx";
import { colors, fontBody, fontMono } from "@/lib/constants.js";

const PHRASES = [
  "Compulsando los archivos de la Logia…",
  "Cotejando con el Cronoarchivero Mayor…",
  "Consultando el Almanaque Numantino…",
  "Descifrando emblemas heredados…",
  "Rescatando legajos del Sumidero del Tedio…",
  "Alineando astros con escaños…",
  "Verificando juramentos rotos…",
  "Saldando viejas cuentas con el Vaticano…",
  "Revisando los rumores de Suresnes…",
  "Pesando el alma del sujeto en balanza de ágata…",
  "Cruzando entradas del Registro de Pactos Menores…",
  "Hojeando el Tomo IX de los Apóstatas…",
  "Midiendo la sombra del sujeto al mediodía…",
  "Anotando al margen del expediente con tinta sepia…",
];

export default function LoadingScreen() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((p) => (p + 1) % PHRASES.length), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", color: colors.ink }}>
      <div style={{ animation: "spin 14s linear infinite" }}>
        <Seal size={180} />
      </div>
      <div style={{ marginTop: "40px", textAlign: "center", maxWidth: "520px" }}>
        <p style={{ fontFamily: fontMono, fontSize: "13px", letterSpacing: "2px", color: colors.bordo, textTransform: "uppercase", marginBottom: "8px" }}>
          Dictamen en curso
        </p>
        <p key={idx} style={{ fontFamily: fontBody, fontSize: "20px", fontStyle: "italic", color: colors.ink, animation: "fade 1.5s ease-in-out" }}>
          {PHRASES[idx]}
        </p>
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fade { 0% { opacity: 0; } 30% { opacity: 1; } 70% { opacity: 1; } 100% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
