// Elige texto oscuro o blanco: el que más contraste tenga con el fondo
// (fórmula de contraste de las pautas de accesibilidad WCAG).
const OSCURO = '#2b2140';
const BLANCO = '#ffffff';

function luminancia(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contraste(a, b) {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

export function colorDeTexto(hex) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error(`El color «${hex}» no es #rrggbb.`);
  return contraste(hex, OSCURO) >= contraste(hex, BLANCO) ? OSCURO : BLANCO;
}
