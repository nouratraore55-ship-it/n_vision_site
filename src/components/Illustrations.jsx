import logoRuby from '../assets/logo-ruby.png';

// Dessins des cartes « Nos services » (affichés tant qu'aucune photo n'est
// mise en ligne pour ce service depuis l'admin).

export function IlluPackaging() {
  return (
    <svg className="illu" viewBox="0 0 400 440" preserveAspectRatio="xMidYMid slice" ariaHidden="true">
  <defs><radialGradient id="ig4" cx="50%" cy="35%" r="75%"><stop offset="0" stopColor="#5A3536"/><stop offset="1" stopColor="#2E1617"/></radialGradient><filter id="sh4" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000" floodOpacity=".35"/></filter></defs>
  <rect width="400" height="440" fill="url(#ig4)"/>
  <g transform="translate(200 140) scale(.82)">
    {/* boîte ouverte */}
    <g filter="url(#sh4)">
      <path d="M-120 -10 L0 -50 L120 -10 L0 30 Z" fill="#2E1617"/>
      <path d="M-120 -10 L0 30 L0 140 L-120 100 Z" fill="#AA9F95"/>
      <path d="M0 30 L120 -10 L120 100 L0 140 Z" fill="#8F847A"/>
      <path d="M-120 -10 L-170 -70 L-50 -110 L0 -50 Z" fill="#C2B9AF"/>
      <path d="M120 -10 L170 -60 L60 -100 L0 -50 Z" fill="#D2CDC3"/>
      <path d="M-100 -14 Q-60 -60 -10 -30 Q30 -70 90 -18 L0 22 Z" fill="#EEEBE5" opacity=".95"/>
      <image href={logoRuby} x="-95" y="38" width="70" height="58" transform="skewY(18)" transformOrigin="-60 70"/>
    </g>
    {/* nuancier */}
    <g transform="translate(150 -150) rotate(-8)" filter="url(#sh4)">
      <rect x="0" y="0" width="36" height="56" rx="4" fill="#3E1F20" stroke="#EEEBE5" strokeWidth="2"/>
      <rect x="30" y="-6" width="36" height="56" rx="4" fill="#AA9F95" stroke="#EEEBE5" strokeWidth="2" transform="rotate(10 48 22)"/>
      <rect x="60" y="-10" width="36" height="56" rx="4" fill="#D2CDC3" stroke="#EEEBE5" strokeWidth="2" transform="rotate(20 78 18)"/>
    </g>
  </g>
</svg>
  );
}

export function IlluSacs() {
  return (
    <svg className="illu" viewBox="0 0 400 440" preserveAspectRatio="xMidYMid slice" ariaHidden="true">
  <defs>
    <radialGradient id="ig3" cx="50%" cy="35%" r="75%"><stop offset="0" stopColor="#5A3536"/><stop offset="1" stopColor="#2E1617"/></radialGradient>
    <linearGradient id="bf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F3F1EC"/><stop offset="1" stopColor="#DCD7CD"/></linearGradient>
    <linearGradient id="bs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#C9C3B8"/><stop offset=".5" stopColor="#B3AB9F"/><stop offset="1" stopColor="#C2BBB0"/></linearGradient>
    <filter id="sh3" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="6" dy="14" stdDeviation="12" floodColor="#000" floodOpacity=".4"/></filter>
  </defs>
  <rect width="400" height="440" fill="url(#ig3)"/>
  <g transform="translate(240 186) scale(.7) translate(-205 -190)">
  <ellipse cx="208" cy="338" rx="120" ry="12" fill="#000" opacity=".25"/>
  <g filter="url(#sh3)">
    {/* poignée arrière */}
    <path d="M183 112 C180 44 246 44 243 112" fill="none" stroke="#2A1415" strokeWidth="5" strokeLinecap="round"/>
    {/* papier de soie qui dépasse */}
    <path d="M128 112 Q140 70 168 92 Q186 58 206 88 Q228 62 246 94 Q268 74 276 112 Z" fill="#AA9F95"/>
    <path d="M150 112 Q168 84 190 100 Q214 78 232 104 L240 112 Z" fill="#C2B9AF"/>
    {/* soufflet */}
    <path d="M272 110 L306 124 L314 324 L280 334 Z" fill="url(#bs)"/>
    <path d="M289 117 L294 300 L280 334 M294 300 L314 324" fill="none" stroke="#8F847A" strokeWidth="1" opacity=".7"/>
    {/* face avant */}
    <path d="M108 110 L272 110 L280 334 L100 334 Z" fill="url(#bf)"/>
    <path d="M108 110 L272 110 L272.7 130 L107.3 130 Z" fill="#D2CDC3"/>
    <path d="M100 334 L280 334 L279 318 L101 318 Z" fill="#000" opacity=".05"/>
    <circle cx="160" cy="121" r="4" fill="#3E1F20"/><circle cx="220" cy="121" r="4" fill="#3E1F20"/>
    {/* poignée avant */}
    <path d="M160 121 C155 36 225 36 220 121" fill="none" stroke="#3E1F20" strokeWidth="5.5" strokeLinecap="round"/>
    {/* logo */}
    <image href={logoRuby} x="138" y="175" width="104" height="86"/>
    <rect x="160" y="276" width="60" height="2.5" rx="1.25" fill="#AA9F95"/>
  </g>
  </g>
</svg>
  );
}

export function IlluPapier() {
  return (
    <svg className="illu" viewBox="0 0 400 440" preserveAspectRatio="xMidYMid slice" ariaHidden="true">
  <defs><radialGradient id="ig2" cx="50%" cy="35%" r="75%"><stop offset="0" stopColor="#5A3536"/><stop offset="1" stopColor="#2E1617"/></radialGradient><filter id="sh2" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#000" floodOpacity=".35"/></filter>
    <pattern id="pn" width="34" height="34" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)"><text x="6" y="22" fontFamily="Shippori Mincho,Georgia,serif" fontSize="15" fill="#3E1F20" opacity=".22">N</text><circle cx="27" cy="9" r="1.6" fill="#3E1F20" opacity=".18"/></pattern>
  </defs>
  <rect width="400" height="440" fill="url(#ig2)"/>
  <g transform="translate(200 180)">
    <path filter="url(#sh2)" transform="rotate(-16)" d="M-150 -70 Q-120 -82 -80 -74 T0 -78 T80 -70 T150 -76 L140 70 Q100 80 60 72 T-20 78 T-100 70 T-145 76 Z" fill="#AA9F95" opacity=".95"/>
    <path filter="url(#sh2)" transform="rotate(8)" d="M-140 -80 Q-100 -90 -60 -82 T20 -86 T100 -80 T145 -84 L150 74 Q110 84 70 76 T-10 82 T-90 74 T-148 80 Z" fill="#EEEBE5"/>
    <path transform="rotate(8)" d="M-140 -80 Q-100 -90 -60 -82 T20 -86 T100 -80 T145 -84 L150 74 Q110 84 70 76 T-10 82 T-90 74 T-148 80 Z" fill="url(#pn)"/>
    <path transform="rotate(8)" d="M-60 -82 L-40 78 M40 -82 L58 78" stroke="#3E1F20" strokeWidth="1" opacity=".08" fill="none"/>
    <path transform="rotate(8)" d="M-148 80 L-60 -10 L-140 -80 Z" fill="#D2CDC3" opacity=".7"/>
  </g>
</svg>
  );
}

export function IlluCartes() {
  return (
    <svg className="illu" viewBox="0 0 400 440" preserveAspectRatio="xMidYMid slice" ariaHidden="true">
  <defs><radialGradient id="ig" cx="50%" cy="35%" r="75%"><stop offset="0" stopColor="#5A3536"/><stop offset="1" stopColor="#2E1617"/></radialGradient><filter id="sh1" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#000" floodOpacity=".35"/></filter></defs>
  <rect width="400" height="440" fill="url(#ig)"/>
  <g transform="translate(200 175)">
    <g filter="url(#sh1)" transform="rotate(-12) translate(-120 -72)"><rect width="230" height="132" rx="8" fill="#AA9F95"/><rect x="18" y="20" width="70" height="8" rx="4" fill="#3E1F20" opacity=".5"/><rect x="18" y="36" width="48" height="6" rx="3" fill="#3E1F20" opacity=".3"/></g>
    <g filter="url(#sh1)" transform="rotate(5) translate(-100 -50)"><rect width="230" height="132" rx="8" fill="#EEEBE5"/><rect x="20" y="30" width="96" height="10" rx="5" fill="#3E1F20" opacity=".55"/><rect x="20" y="60" width="120" height="6" rx="3" fill="#3E1F20" opacity=".25"/><rect x="20" y="74" width="90" height="6" rx="3" fill="#3E1F20" opacity=".25"/><rect x="20" y="104" width="40" height="3" rx="1.5" fill="#AA9F95"/></g>
    <g transform="translate(96 66) rotate(-10)"><g filter="url(#sh1)"><circle r="46" fill="#FFFFFF"/><circle r="41" fill="#EEEBE5"/><circle r="35" fill="none" stroke="#AA9F95" strokeWidth="1"/><image href={logoRuby} x="-29" y="-24" width="57" height="47"/></g></g>
  </g>
</svg>
  );
}
