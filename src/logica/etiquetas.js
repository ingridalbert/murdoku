// Dónde escribir el nombre de una habitación dentro del plano: en su tramo
// seguido de casillas más largo; si empatan, el de más abajo.
export function posicionEtiqueta(plano, letra) {
  let mejor = null;
  plano.forEach((fila, f) => {
    let desde = null;
    for (let c = 0; c <= fila.length; c++) {
      if (fila[c] === letra) {
        if (desde === null) desde = c;
        continue;
      }
      if (desde !== null) {
        const tramo = { fila: f, desde, hasta: c - 1 };
        const largo = tramo.hasta - tramo.desde;
        if (!mejor || largo >= mejor.hasta - mejor.desde) mejor = tramo;
        desde = null;
      }
    }
  });
  if (!mejor) throw new Error(`La habitación «${letra}» no aparece en el plano.`);
  return mejor;
}
