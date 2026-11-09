import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { colorDeTexto } from './colores.js';
import { PERSONAJES } from '../casos/personajes.js';

const OSCURO = '#2b2140';
const BLANCO = '#ffffff';

describe('colorDeTexto: texto legible sobre el círculo de cada personaje', () => {
  it('sobre colores claros (amarillo, verde lima) usa texto oscuro', () => {
    assert.equal(colorDeTexto('#ffc93c'), OSCURO);
    assert.equal(colorDeTexto('#9bdb4d'), OSCURO);
  });

  it('sobre colores oscuros (morado, azul marino) usa texto blanco', () => {
    assert.equal(colorDeTexto('#8338ec'), BLANCO);
    assert.equal(colorDeTexto('#1d3557'), BLANCO);
  });

  it('en un azul medio (#3a86ff) elige el que más contrasta, que es el oscuro', () => {
    assert.equal(colorDeTexto('#3a86ff'), OSCURO);
  });

  it('extremos: blanco puro y negro puro', () => {
    assert.equal(colorDeTexto('#ffffff'), OSCURO);
    assert.equal(colorDeTexto('#000000'), BLANCO);
  });

  it('todos los personajes del catálogo tienen un contraste de al menos 3:1', () => {
    const luminancia = (hex) => {
      const [r, g, b] = [1, 3, 5].map((i) => {
        const c = parseInt(hex.slice(i, i + 2), 16) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const contraste = (a, b) => {
      const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
      return (l1 + 0.05) / (l2 + 0.05);
    };
    for (const p of Object.values(PERSONAJES)) {
      assert.ok(contraste(p.color, colorDeTexto(p.color)) >= 3, `${p.nombre} (${p.color})`);
    }
  });

  it('erróneo: un color que no es #rrggbb lanza un error', () => {
    assert.throws(() => colorDeTexto('rojo'), /color/i);
  });
});
