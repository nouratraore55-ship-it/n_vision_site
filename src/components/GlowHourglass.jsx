/**
 * Forme lumineuse abstraite (dégradé + flou) façon "hourglass glow",
 * utilisée en fond de la section CTA. Purement décorative (aria-hidden).
 */
export default function GlowHourglass({ className = '' }) {
  return (
    <svg
      className={`glow-hourglass ${className}`}
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="glowCore" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#FCEFD9" />
          <stop offset="35%" stopColor="#F8AD5C" />
          <stop offset="75%" stopColor="#F4A044" />
          <stop offset="100%" stopColor="#4A3220" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M20 15 L380 15 L200 150 L380 285 L20 285 L200 150 Z"
        fill="url(#glowCore)"
      />
    </svg>
  );
}
