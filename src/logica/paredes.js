// Dice en qué lados de una casilla hay pared: el borde del plano
// o una casilla vecina que pertenece a otra habitación.
export function paredes(plano, fila, columna) {
  const aqui = plano[fila][columna];
  const distinta = (f, c) => plano[f]?.[c] === undefined || plano[f][c] !== aqui;
  return {
    arriba: distinta(fila - 1, columna),
    abajo: distinta(fila + 1, columna),
    izquierda: distinta(fila, columna - 1),
    derecha: distinta(fila, columna + 1),
  };
}
