import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validarCaso } from './formato.js';
import { casoDePrueba } from './caso-de-prueba.js';
import caso01 from '../casos/caso-01.js';

// validarCaso devuelve una lista de errores { codigo, detalle }. Vacía = caso válido.
const codigos = (caso) => validarCaso(caso).map((e) => e.codigo);

// Construye un caso válido de tamaño n (diagonal como solución) para los extremos.
function casoDeTamano(n) {
  const caso = casoDePrueba();
  caso.plano = Array.from({ length: n }, () => 'A'.repeat(n));
  caso.habitaciones = { A: { nombre: 'sala', articulo: 'la' } };
  caso.objetos = [];
  caso.personajes = Array.from({ length: n }, (_, i) => ({
    id: `p${i}`,
    nombre: `P${i}`,
    genero: 'f',
  }));
  caso.victima = 'p0';
  caso.pistas = [];
  caso.solucion = Object.fromEntries(caso.personajes.map((p, i) => [p.id, [i, i]]));
  return caso;
}

describe('validarCaso · casos normales', () => {
  it('el caso de prueba es válido', () => {
    assert.deepEqual(validarCaso(casoDePrueba()), []);
  });

  it('el caso 1 del juego es válido y es de 5×5', () => {
    assert.deepEqual(validarCaso(caso01), []);
    assert.equal(caso01.plano.length, 5);
  });

  it('un caso sin objetos también es válido', () => {
    const caso = casoDePrueba();
    caso.objetos = [];
    caso.pistas = caso.pistas.filter((p) => p.tipo !== 'sobre-objeto');
    assert.deepEqual(validarCaso(caso), []);
  });

  it('se puede estar sobre un objeto ocupable (silla)', () => {
    const caso = casoDePrueba();
    assert.deepEqual(caso.solucion.lola, [0, 0]); // la silla
    assert.deepEqual(validarCaso(caso), []);
  });
});

describe('validarCaso · casos extremos', () => {
  it('acepta el tamaño mínimo, 5×5', () => {
    assert.deepEqual(validarCaso(casoDeTamano(5)), []);
  });

  it('acepta el tamaño máximo, 9×9', () => {
    assert.deepEqual(validarCaso(casoDeTamano(9)), []);
  });

  it('rechaza 4×4, por debajo del mínimo', () => {
    assert.ok(codigos(casoDeTamano(4)).includes('tamano-fuera-de-rango'));
  });

  it('rechaza 10×10, por encima del máximo', () => {
    assert.ok(codigos(casoDeTamano(10)).includes('tamano-fuera-de-rango'));
  });

  it('una persona puede estar en una esquina (fila y columna 0 o N−1)', () => {
    const caso = casoDeTamano(9);
    assert.deepEqual(caso.solucion.p8, [8, 8]);
    assert.deepEqual(validarCaso(caso), []);
  });

  it('un caso con varios errores los devuelve todos, no solo el primero', () => {
    const caso = casoDePrueba();
    caso.victima = 'nadie';
    caso.personajes[0].genero = 'x';
    const errores = codigos(caso);
    assert.ok(errores.includes('victima-desconocida'));
    assert.ok(errores.includes('genero-invalido'));
  });
});

describe('validarCaso · casos erróneos: plano', () => {
  it('plano no cuadrado (una fila más larga)', () => {
    const caso = casoDePrueba();
    caso.plano[2] = 'BBJJJJ';
    assert.ok(codigos(caso).includes('plano-no-cuadrado'));
  });

  it('plano no cuadrado (una fila de menos)', () => {
    const caso = casoDePrueba();
    caso.plano.pop();
    assert.ok(codigos(caso).includes('plano-no-cuadrado'));
  });

  it('letra del plano sin habitación definida', () => {
    const caso = casoDePrueba();
    caso.plano[4] = 'BBJJX';
    assert.ok(codigos(caso).includes('habitacion-desconocida'));
  });

  it('habitación sin artículo', () => {
    const caso = casoDePrueba();
    delete caso.habitaciones.C.articulo;
    assert.ok(codigos(caso).includes('habitacion-incompleta'));
  });
});

describe('validarCaso · casos erróneos: objetos', () => {
  it('tipo de objeto que no está en el catálogo', () => {
    const caso = casoDePrueba();
    caso.objetos.push({ tipo: 'nave-espacial', fila: 2, columna: 2 });
    assert.ok(codigos(caso).includes('objeto-desconocido'));
  });

  it('objeto fuera del plano', () => {
    const caso = casoDePrueba();
    caso.objetos.push({ tipo: 'planta', fila: 5, columna: 0 });
    assert.ok(codigos(caso).includes('objeto-fuera-del-plano'));
  });

  it('dos objetos en la misma casilla', () => {
    const caso = casoDePrueba();
    caso.objetos.push({ tipo: 'planta', fila: 0, columna: 0 });
    assert.ok(codigos(caso).includes('objetos-superpuestos'));
  });
});

describe('validarCaso · casos erróneos: personajes y víctima', () => {
  it('número de personajes distinto del tamaño del plano', () => {
    const caso = casoDePrueba();
    caso.personajes.pop();
    delete caso.solucion.ingrid;
    caso.victima = 'calikos';
    caso.pistas = caso.pistas.filter((p) => p.persona !== 'calikos');
    assert.ok(codigos(caso).includes('numero-de-personajes'));
  });

  it('dos personajes con el mismo id', () => {
    const caso = casoDePrueba();
    caso.personajes[1].id = 'lola';
    assert.ok(codigos(caso).includes('personaje-repetido'));
  });

  it('género distinto de "f" o "m"', () => {
    const caso = casoDePrueba();
    caso.personajes[0].genero = 'x';
    assert.ok(codigos(caso).includes('genero-invalido'));
  });

  it('la víctima no está entre los personajes', () => {
    const caso = casoDePrueba();
    caso.victima = 'nadie';
    assert.ok(codigos(caso).includes('victima-desconocida'));
  });

  it('la víctima tiene una pista propia', () => {
    const caso = casoDePrueba();
    caso.pistas.push({ persona: 'ingrid', tipo: 'en-habitacion', habitacion: 'J' });
    assert.ok(codigos(caso).includes('victima-con-pista'));
  });
});

describe('validarCaso · casos erróneos: pistas', () => {
  it('pista de una persona que no existe', () => {
    const caso = casoDePrueba();
    caso.pistas.push({ persona: 'nadie', tipo: 'en-habitacion', habitacion: 'C' });
    assert.ok(codigos(caso).includes('pista-persona-desconocida'));
  });

  it('pista de un tipo que no existe', () => {
    const caso = casoDePrueba();
    caso.pistas.push({ persona: 'lola', tipo: 'telepatia' });
    assert.ok(codigos(caso).includes('pista-tipo-desconocido'));
  });

  it('pista que nombra una habitación que no existe', () => {
    const caso = casoDePrueba();
    caso.pistas.push({ persona: 'lola', tipo: 'en-habitacion', habitacion: 'X' });
    assert.ok(codigos(caso).includes('pista-dato-invalido'));
  });

  it('pista que relaciona a una persona consigo misma', () => {
    const caso = casoDePrueba();
    caso.pistas.push({ persona: 'lola', tipo: 'junto-a-persona', otra: 'lola' });
    assert.ok(codigos(caso).includes('pista-dato-invalido'));
  });

  it('pista de fila o columna fuera del plano', () => {
    const caso = casoDePrueba();
    caso.pistas.push({ persona: 'lola', tipo: 'en-linea', eje: 'fila', indice: 5 });
    assert.ok(codigos(caso).includes('pista-dato-invalido'));
  });

  it('pista «sobre un objeto» con un objeto bloqueante', () => {
    const caso = casoDePrueba();
    caso.pistas.push({ persona: 'lola', tipo: 'sobre-objeto', objeto: 'planta' });
    assert.ok(codigos(caso).includes('pista-dato-invalido'));
  });

  it('pista de dirección con un punto cardinal inventado', () => {
    const caso = casoDePrueba();
    caso.pistas.push({ persona: 'lola', tipo: 'direccion', otra: 'carles', direccion: 'arriba' });
    assert.ok(codigos(caso).includes('pista-dato-invalido'));
  });
});

describe('validarCaso · casos erróneos: solución', () => {
  it('a una persona le falta su casilla', () => {
    const caso = casoDePrueba();
    delete caso.solucion.helen;
    assert.ok(codigos(caso).includes('solucion-incompleta'));
  });

  it('casilla de la solución fuera del plano', () => {
    const caso = casoDePrueba();
    caso.solucion.helen = [2, 7];
    assert.ok(codigos(caso).includes('solucion-fuera-del-plano'));
  });

  it('dos personas en la misma fila', () => {
    const caso = casoDePrueba();
    caso.solucion.helen = [1, 4];
    assert.ok(codigos(caso).includes('solucion-fila-repetida'));
  });

  it('dos personas en la misma columna', () => {
    const caso = casoDePrueba();
    caso.solucion.helen = [2, 2];
    assert.ok(codigos(caso).includes('solucion-columna-repetida'));
  });

  it('una persona sobre un objeto bloqueante (planta)', () => {
    const caso = casoDePrueba();
    caso.solucion.carles = [1, 3];
    caso.solucion.ingrid = [4, 2];
    assert.ok(codigos(caso).includes('solucion-sobre-bloqueante'));
  });
});
