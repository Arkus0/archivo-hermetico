export function Seal({ size = 180 }) {
  return (
    <svg width={size} height={size} viewBox="-100 -100 200 200" style={{ display: "block" }}>
      <defs>
        <path id="topArc" d="M -85 0 A 85 85 0 0 1 85 0" fill="none" />
        <path id="botArc" d="M -85 0 A 85 85 0 0 0 85 0" fill="none" />
      </defs>
      <circle cx="0" cy="0" r="92" fill="none" stroke="#5C1820" strokeWidth="1.2" />
      <circle cx="0" cy="0" r="86" fill="none" stroke="#5C1820" strokeWidth="0.6" />
      <circle cx="0" cy="0" r="70" fill="none" stroke="#5C1820" strokeWidth="0.6" />
      <polygon points="0,-50 44,28 -44,28" fill="none" stroke="#1A1410" strokeWidth="1.4" />
      <ellipse cx="0" cy="2" rx="22" ry="11" fill="none" stroke="#1A1410" strokeWidth="1.2" />
      <circle cx="0" cy="2" r="5" fill="#5C1820" />
      <circle cx="0" cy="2" r="2" fill="#1A1410" />
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 16;
        const x1 = Math.cos(angle) * 56;
        const y1 = Math.sin(angle) * 56;
        const x2 = Math.cos(angle) * 64;
        const y2 = Math.sin(angle) * 64;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5C1820" strokeWidth="0.8" />;
      })}
      <text fontFamily='"IM Fell English", serif' fontSize="9" letterSpacing="3" fill="#1A1410">
        <textPath href="#topArc" startOffset="50%" textAnchor="middle">
          ARCHIVUM HERMETICUM HISPANIARUM
        </textPath>
      </text>
      <text fontFamily='"IM Fell English", serif' fontSize="8" letterSpacing="4" fill="#1A1410">
        <textPath href="#botArc" startOffset="50%" textAnchor="middle">
          · TÆDIUM · OBSCURITAS · CONCORDIA ·
        </textPath>
      </text>
    </svg>
  );
}

export function MiniOrnament() {
  return (
    <svg width="160" height="14" viewBox="0 0 160 14">
      <line x1="0" y1="7" x2="60" y2="7" stroke="#5C1820" strokeWidth="0.8" />
      <line x1="100" y1="7" x2="160" y2="7" stroke="#5C1820" strokeWidth="0.8" />
      <circle cx="80" cy="7" r="3" fill="none" stroke="#5C1820" strokeWidth="0.8" />
      <circle cx="80" cy="7" r="1.2" fill="#5C1820" />
      <circle cx="68" cy="7" r="1" fill="#5C1820" />
      <circle cx="92" cy="7" r="1" fill="#5C1820" />
    </svg>
  );
}
