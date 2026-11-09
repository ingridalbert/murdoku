// Ilustraciones propias de los objetos, vistas desde arriba.
// Todas usan viewBox 0 0 100 100 y se adaptan al tamaño de la casilla.

const T = '#3b2f4a'; // tinta del contorno
const svg = (contenido) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true" ` +
  `stroke="${T}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">${contenido}</svg>`;

export const DIBUJOS = {
  silla: svg(`
    <rect x="24" y="30" width="52" height="48" rx="10" fill="#ff9f43"/>
    <rect x="20" y="16" width="60" height="18" rx="8" fill="#ee5a24"/>
    <rect x="32" y="40" width="36" height="28" rx="6" fill="#ffc36b" stroke="none"/>
  `),
  cama: svg(`
    <rect x="18" y="8" width="64" height="84" rx="10" fill="#f8f3ff"/>
    <rect x="28" y="14" width="44" height="18" rx="8" fill="#ffffff"/>
    <path d="M18 40 H82 V82 a10 10 0 0 1 -10 10 H28 a10 10 0 0 1 -10 -10 Z" fill="#7c5cff"/>
    <path d="M18 40 H82 V50 H18 Z" fill="#a48bff"/>
  `),
  alfombra: svg(`
    <g stroke-width="3">
      <line x1="10" y1="22" x2="4" y2="22"/><line x1="10" y1="36" x2="4" y2="36"/>
      <line x1="10" y1="50" x2="4" y2="50"/><line x1="10" y1="64" x2="4" y2="64"/>
      <line x1="10" y1="78" x2="4" y2="78"/>
      <line x1="90" y1="22" x2="96" y2="22"/><line x1="90" y1="36" x2="96" y2="36"/>
      <line x1="90" y1="50" x2="96" y2="50"/><line x1="90" y1="64" x2="96" y2="64"/>
      <line x1="90" y1="78" x2="96" y2="78"/>
    </g>
    <rect x="10" y="14" width="80" height="72" rx="6" fill="#ff6b9d"/>
    <rect x="20" y="24" width="60" height="52" rx="4" fill="#ffd166" stroke-width="3"/>
    <path d="M50 32 L66 50 L50 68 L34 50 Z" fill="#06d6a0" stroke-width="3"/>
  `),
  planta: svg(`
    <circle cx="50" cy="54" r="22" fill="#e07a5f"/>
    <circle cx="50" cy="54" r="15" fill="#8d5b3c" stroke="none"/>
    <g fill="#52b788">
      <ellipse cx="50" cy="26" rx="10" ry="20"/>
      <ellipse cx="28" cy="40" rx="10" ry="20" transform="rotate(-55 28 40)"/>
      <ellipse cx="72" cy="40" rx="10" ry="20" transform="rotate(55 72 40)"/>
      <ellipse cx="34" cy="66" rx="9" ry="18" transform="rotate(-125 34 66)"/>
      <ellipse cx="66" cy="66" rx="9" ry="18" transform="rotate(125 66 66)"/>
    </g>
    <circle cx="50" cy="50" r="6" fill="#95d5b2"/>
  `),
  mesa: svg(`
    <rect x="10" y="16" width="80" height="68" rx="10" fill="#c98b5a"/>
    <rect x="18" y="24" width="64" height="52" rx="6" fill="#d9a273" stroke="none"/>
    <circle cx="36" cy="42" r="10" fill="#ffffff" stroke-width="3"/>
    <circle cx="64" cy="58" r="10" fill="#ffffff" stroke-width="3"/>
    <circle cx="64" cy="34" r="5" fill="#ffd166" stroke-width="3"/>
  `),
  estanteria: svg(`
    <rect x="8" y="24" width="84" height="52" rx="6" fill="#8d6e63"/>
    <g stroke-width="3">
      <rect x="16" y="32" width="10" height="36" rx="2" fill="#ef476f"/>
      <rect x="28" y="32" width="8" height="36" rx="2" fill="#ffd166"/>
      <rect x="38" y="32" width="12" height="36" rx="2" fill="#06d6a0"/>
      <rect x="52" y="32" width="8" height="36" rx="2" fill="#118ab2"/>
      <rect x="62" y="32" width="10" height="36" rx="2" fill="#c77dff"/>
      <rect x="74" y="32" width="10" height="36" rx="2" fill="#ff9f43"/>
    </g>
  `),
  sofa: svg(`
    <rect x="8" y="18" width="84" height="66" rx="14" fill="#118ab2"/>
    <rect x="8" y="18" width="84" height="20" rx="10" fill="#0b6e8f"/>
    <rect x="8" y="30" width="16" height="54" rx="8" fill="#0b6e8f"/>
    <rect x="76" y="30" width="16" height="54" rx="8" fill="#0b6e8f"/>
    <rect x="26" y="40" width="23" height="38" rx="6" fill="#48cae4" stroke-width="3"/>
    <rect x="51" y="40" width="23" height="38" rx="6" fill="#48cae4" stroke-width="3"/>
  `),
};

// Quita espacios sobrantes para que cada dibujo sea una sola línea limpia.
for (const tipo of Object.keys(DIBUJOS)) {
  DIBUJOS[tipo] = DIBUJOS[tipo].replace(/\s*\n\s*/g, ' ').replace(/>\s+</g, '><').trim();
}
