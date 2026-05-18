"use client";

import { MiniOrnament } from "./Seal.jsx";
import CharacterSheet from "./CharacterSheet.jsx";
import MadridMap from "./MadridMap.jsx";
import { colors, fontDisplay, fontBody, fontMono } from "@/lib/constants.js";

export default function GameScreen({ character, onBack, onRestart }) {
  return (
    <div style={{ minHeight: "100vh", padding: "32px 16px 64px 16px", color: colors.ink }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Cabecera del capítulo */}
        <div style={{ textAlign: "center", borderBottom: `2px double ${colors.bordo}`, paddingBottom: "16px", marginBottom: "28px" }}>
          <div style={{ fontFamily: fontMono, fontSize: "11px", letterSpacing: "4px", color: colors.bordo, textTransform: "uppercase", marginBottom: "6px" }}>
            Capítulo I · El sujeto se encarna
          </div>
          <h1 style={{ fontFamily: fontDisplay, fontSize: "44px", letterSpacing: "3px", margin: "0 0 6px 0", color: colors.ink, fontWeight: "normal" }}>
            EL TABLERO DE LA VILLA
          </h1>
          <p style={{ fontFamily: fontBody, fontStyle: "italic", fontSize: "18px", color: colors.bordoDeep, margin: 0 }}>
            Has tomado el cuerpo. Madrid se despliega ante ti. Empieza, paso a paso, la lenta conquista de España.
          </p>
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
            <MiniOrnament />
          </div>
        </div>

        {/* Layout responsivo: dos columnas en desktop, apiladas en móvil */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: "28px",
          }}
        >
          <style>{`
            @media (min-width: 1024px) {
              .game-grid {
                grid-template-columns: 460px minmax(0, 1fr) !important;
                align-items: start !important;
              }
              .game-sticky {
                position: sticky;
                top: 24px;
              }
            }
          `}</style>
          <div className="game-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "28px", alignItems: "stretch" }}>
            <div className="game-sticky">
              <CharacterSheet character={character} />
            </div>
            <div>
              <MadridMap />
            </div>
          </div>
        </div>

        {/* Próximos capítulos teaser */}
        <div style={{ marginTop: "40px", padding: "24px 24px", border: `1px dashed ${colors.bordoDeep}`, background: "rgba(168, 139, 63, 0.08)" }}>
          <div style={{ fontFamily: fontMono, fontSize: "11px", letterSpacing: "3px", color: colors.bordo, textTransform: "uppercase", marginBottom: "10px" }}>
            Próximos capítulos · Borrador de la Logia
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, fontFamily: fontBody, fontSize: "17px", color: colors.ink, lineHeight: 1.6 }}>
            <li>› Cap. II — <em>Pactos de servilleta</em>: reclutar aliados en cada enclave. Cada encuentro pondrá en juego un atributo.</li>
            <li>› Cap. III — <em>Maniobras de provincia</em>: extender la red más allá de Madrid — Sevilla, Bilbao, Barcelona, Santiago.</li>
            <li>› Cap. IV — <em>Asalto a la Moncloa</em>: investidura final. Si la suma de Perspicacia, Carisma y Voluntad supera 22, el Consejo de Ministros se constituye a tu favor.</li>
          </ul>
        </div>

        {/* Botonera */}
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginTop: "36px" }}>
          <button
            onClick={onBack}
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
            ← Volver al dictamen
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
            Abrir nuevo expediente
          </button>
        </div>
      </div>
    </div>
  );
}
