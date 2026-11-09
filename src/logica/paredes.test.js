import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { paredes } from './paredes.js';

const PLANO = ['CCSSS', 'CCSSS', 'DDSJJ', 'DDJJJ', 'DDJJJ'];

describe('paredes', () => {
  it('casilla interior de una habitación: sin paredes', () => {
    assert.deepEqual(paredes(PLANO, 3, 3), {
      arriba: false, abajo: false, izquierda: false, derecha: false,
    });
  });

  it('esquina superior izquierda: pared arriba e izquierda (borde del plano)', () => {
    assert.deepEqual(paredes(PLANO, 0, 0), {
      arriba: true, abajo: false, izquierda: true, derecha: false,
    });
  });

  it('esquina inferior derecha: pared abajo y derecha', () => {
    assert.deepEqual(paredes(PLANO, 4, 4), {
      arriba: false, abajo: true, izquierda: false, derecha: true,
    });
  });

  it('frontera entre habitaciones: cocina (1,1) con salón a la derecha y dormitorio abajo', () => {
    assert.deepEqual(paredes(PLANO, 1, 1), {
      arriba: false, abajo: true, izquierda: false, derecha: true,
    });
  });

  it('casilla rodeada de otras habitaciones por tres lados: salón (2,2)', () => {
    assert.deepEqual(paredes(PLANO, 2, 2), {
      arriba: false, abajo: true, izquierda: true, derecha: true,
    });
  });
});
