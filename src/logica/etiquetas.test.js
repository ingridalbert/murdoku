import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { posicionEtiqueta } from './etiquetas.js';

// posicionEtiqueta(plano, letra) dice dónde escribir el nombre de una habitación:
// en su fila más ancha (si empatan, la de más abajo), sobre las casillas
// seguidas de esa fila. Devuelve { fila, desde, hasta } (columnas incluidas).

const PLANO = ['CCSSS', 'CCSSS', 'DDSJJ', 'DDJJJ', 'DDJJJ'];

describe('posicionEtiqueta · casos normales', () => {
  it('cocina (2×2): la fila de abajo', () => {
    assert.deepEqual(posicionEtiqueta(PLANO, 'C'), { fila: 1, desde: 0, hasta: 1 });
  });

  it('salón: la fila más ancha (1, de 3 casillas), no la de abajo (2, de 1 casilla)', () => {
    assert.deepEqual(posicionEtiqueta(PLANO, 'S'), { fila: 1, desde: 2, hasta: 4 });
  });

  it('jardín: entre filas igual de anchas, la de más abajo', () => {
    assert.deepEqual(posicionEtiqueta(PLANO, 'J'), { fila: 4, desde: 2, hasta: 4 });
  });
});

describe('posicionEtiqueta · casos extremos', () => {
  it('habitación de una sola casilla', () => {
    assert.deepEqual(posicionEtiqueta(['AB', 'BB'], 'A'), { fila: 0, desde: 0, hasta: 0 });
  });

  it('habitación que ocupa todo el plano (9×9)', () => {
    const plano = Array.from({ length: 9 }, () => 'A'.repeat(9));
    assert.deepEqual(posicionEtiqueta(plano, 'A'), { fila: 8, desde: 0, hasta: 8 });
  });

  it('fila partida por otra habitación: usa el tramo seguido más largo', () => {
    // fila 0: A A B A A A  → el tramo de 3 (columnas 3–5) gana al de 2
    assert.deepEqual(posicionEtiqueta(['AABAAA'], 'A'), { fila: 0, desde: 3, hasta: 5 });
  });
});

describe('posicionEtiqueta · casos erróneos', () => {
  it('letra que no aparece en el plano: lanza un error', () => {
    assert.throws(() => posicionEtiqueta(PLANO, 'X'), /X/);
  });
});
