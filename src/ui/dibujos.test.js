import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DIBUJOS } from './dibujos.js';
import { OBJETOS } from '../logica/objetos.js';

describe('dibujos de los objetos', () => {
  it('cada objeto del catálogo tiene su dibujo', () => {
    assert.deepEqual(Object.keys(DIBUJOS).sort(), Object.keys(OBJETOS).sort());
  });

  it('cada dibujo es un SVG con viewBox cuadrado (se adapta al tamaño de la casilla)', () => {
    for (const [tipo, svg] of Object.entries(DIBUJOS)) {
      assert.match(svg, /^<svg[^>]*viewBox="0 0 100 100"/, tipo);
      assert.match(svg, /<\/svg>$/, tipo);
    }
  });

  it('ningún dibujo carga nada de fuera (ni imágenes ni enlaces)', () => {
    for (const [tipo, svg] of Object.entries(DIBUJOS)) {
      assert.doesNotMatch(svg, /href|<image|url\(/i, tipo);
    }
  });
});
