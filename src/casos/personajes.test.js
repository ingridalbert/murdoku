import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PERSONAJES, personajes } from './personajes.js';

// Catálogo único de los amigos de Ingrid. Los casos lo usan con personajes('lola', ...)
// para no repetir (ni equivocar) nombres, géneros, iniciales y colores.

const ESPERADO = {
  // Mujeres
  ingrid: ['Ingrid', 'f', 'IA'], lola: ['Lola', 'f', 'LB'], paloma: ['Paloma', 'f', 'PS'],
  helen: ['Helen', 'f', 'HF'], lucia: ['Lucia', 'f', 'LS'], luza: ['Luza', 'f', 'LZ'],
  naomi: ['Naomi', 'f', 'NB'], karol: ['Karol', 'f', 'CN'], zoryana: ['Zoryana', 'f', 'ZK'],
  anna: ['Anna', 'f', 'AA'], berta: ['Berta', 'f', 'BM'], andrea: ['Andrea', 'f', 'AF'],
  miriam: ['Miriam', 'f', 'MQ'], silvia: ['Silvia', 'f', 'SB'], 'celia-m': ['Celia', 'f', 'CM'],
  'celia-j': ['Celia', 'f', 'CJ'], onis: ['Ónis', 'f', 'OM'], paula: ['Paula', 'f', 'PC'],
  alba: ['Alba', 'f', 'AC'],
  // Hombres
  carles: ['Carles', 'm', 'CM'], calikos: ['Calikos', 'm', 'CU'], edgar: ['Edgar', 'm', 'EC'],
  sanahuja: ['Sanahuja', 'm', 'DS'], manuel: ['Manuel', 'm', 'MV'], oscar: ['Oscar', 'm', 'OT'],
  tendero: ['Tendero', 'm', 'CT'], cabedo: ['Cabedo', 'm', 'PC'],
};

describe('catálogo de personajes · casos normales', () => {
  it('tiene a los 27 amigos con el nombre, el género y las iniciales que dio Ingrid', () => {
    const real = Object.fromEntries(
      Object.values(PERSONAJES).map((p) => [p.id, [p.nombre, p.genero, p.iniciales]]),
    );
    assert.deepEqual(real, ESPERADO);
  });

  it('personajes(...) devuelve los elegidos en el orden pedido', () => {
    assert.deepEqual(personajes('naomi', 'lola').map((p) => p.nombre), ['Naomi', 'Lola']);
  });

  it('las dos Celias se pueden usar, cada una en su caso', () => {
    assert.equal(personajes('celia-m', 'lola')[0].iniciales, 'CM');
    assert.equal(personajes('celia-j', 'lola')[0].iniciales, 'CJ');
  });
});

describe('catálogo de personajes · casos extremos', () => {
  it('las únicas iniciales repetidas en el catálogo son CM (Carles, Celia M.) y PC (Paula, Cabedo)', () => {
    const cuenta = {};
    for (const p of Object.values(PERSONAJES)) cuenta[p.iniciales] = (cuenta[p.iniciales] ?? 0) + 1;
    const repetidas = Object.keys(cuenta).filter((i) => cuenta[i] > 1).sort();
    assert.deepEqual(repetidas, ['CM', 'PC']);
  });

  it('ningún color se repite entre los 27 y todos son #rrggbb', () => {
    const colores = Object.values(PERSONAJES).map((p) => p.color.toLowerCase());
    assert.equal(new Set(colores).size, 27);
    for (const c of colores) assert.match(c, /^#[0-9a-f]{6}$/);
  });

  it('se pueden pedir 9 compatibles para un 9×9', () => {
    const nueve = personajes('ingrid', 'lola', 'paloma', 'helen', 'celia-j', 'onis', 'edgar', 'oscar', 'paula');
    assert.equal(nueve.length, 9);
  });

  it('devuelve copias: cambiar un personaje de un caso no cambia el catálogo', () => {
    const [lola] = personajes('lola');
    lola.nombre = 'Otra';
    assert.equal(PERSONAJES.lola.nombre, 'Lola');
  });
});

describe('catálogo de personajes · casos erróneos', () => {
  it('pedir un personaje que no existe lanza un error claro', () => {
    assert.throws(() => personajes('lola', 'nadie'), /nadie/);
  });

  it('pedir el mismo personaje dos veces lanza un error', () => {
    assert.throws(() => personajes('lola', 'lola'), /repetid/i);
  });

  it('Carles y Celia M. no pueden ir juntos (mismas iniciales, CM)', () => {
    assert.throws(() => personajes('carles', 'celia-m'), /iniciales/i);
  });

  it('Paula y Cabedo no pueden ir juntos (mismas iniciales, PC)', () => {
    assert.throws(() => personajes('cabedo', 'lola', 'paula'), /iniciales/i);
  });

  it('las dos Celias no pueden ir juntas (mismo nombre)', () => {
    assert.throws(() => personajes('celia-m', 'celia-j'), /nombre/i);
  });
});
