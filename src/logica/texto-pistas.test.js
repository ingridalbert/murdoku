import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { textoPista } from './texto-pistas.js';
import { casoDePrueba } from './caso-de-prueba.js';

// textoPista(pista, caso) devuelve la frase que ve el jugador.
const texto = (pista) => textoPista(pista, casoDePrueba());

describe('textoPista · casos normales (los 8 tipos)', () => {
  it('en una habitación', () => {
    assert.equal(
      texto({ persona: 'carles', tipo: 'en-habitacion', habitacion: 'S' }),
      'Carles estaba en el salón.',
    );
  });

  it('en una fila', () => {
    assert.equal(
      texto({ persona: 'lola', tipo: 'en-linea', eje: 'fila', indice: 1 }),
      'Lola estaba en la segunda fila.',
    );
  });

  it('en una columna', () => {
    assert.equal(
      texto({ persona: 'lola', tipo: 'en-linea', eje: 'columna', indice: 2 }),
      'Lola estaba en la tercera columna.',
    );
  });

  it('sobre un objeto ocupable', () => {
    assert.equal(
      texto({ persona: 'lola', tipo: 'sobre-objeto', objeto: 'silla' }),
      'Lola estaba sentada en una silla.',
    );
  });

  it('no estaba en una habitación', () => {
    assert.equal(
      texto({ persona: 'calikos', tipo: 'no-en-habitacion', habitacion: 'C' }),
      'Calikos no estaba en la cocina.',
    );
  });

  it('junto a un objeto', () => {
    assert.equal(
      texto({ persona: 'helen', tipo: 'junto-a-objeto', objeto: 'planta' }),
      'Helen estaba junto a una planta.',
    );
  });

  it('junto a otra persona', () => {
    assert.equal(
      texto({ persona: 'helen', tipo: 'junto-a-persona', otra: 'carles' }),
      'Helen estaba junto a Carles.',
    );
  });

  it('a solas con otra persona', () => {
    assert.equal(
      texto({ persona: 'carles', tipo: 'a-solas-con', otra: 'lola' }),
      'Carles estaba a solas con Lola.',
    );
  });

  it('dirección respecto a otra persona (los 4 puntos cardinales)', () => {
    const frase = (direccion) =>
      texto({ persona: 'lola', tipo: 'direccion', otra: 'helen', direccion });
    assert.equal(frase('norte'), 'Lola estaba más al norte que Helen.');
    assert.equal(frase('sur'), 'Lola estaba más al sur que Helen.');
    assert.equal(frase('este'), 'Lola estaba más al este que Helen.');
    assert.equal(frase('oeste'), 'Lola estaba más al oeste que Helen.');
  });
});

describe('textoPista · género', () => {
  it('sobre una silla: sentada / sentado', () => {
    assert.equal(
      texto({ persona: 'helen', tipo: 'sobre-objeto', objeto: 'silla' }),
      'Helen estaba sentada en una silla.',
    );
    assert.equal(
      texto({ persona: 'carles', tipo: 'sobre-objeto', objeto: 'silla' }),
      'Carles estaba sentado en una silla.',
    );
  });

  it('sobre una cama: tumbada / tumbado', () => {
    assert.equal(
      texto({ persona: 'lola', tipo: 'sobre-objeto', objeto: 'cama' }),
      'Lola estaba tumbada en una cama.',
    );
    assert.equal(
      texto({ persona: 'calikos', tipo: 'sobre-objeto', objeto: 'cama' }),
      'Calikos estaba tumbado en una cama.',
    );
  });

  it('sobre una alfombra no cambia con el género', () => {
    assert.equal(
      texto({ persona: 'lola', tipo: 'sobre-objeto', objeto: 'alfombra' }),
      'Lola estaba sobre una alfombra.',
    );
    assert.equal(
      texto({ persona: 'carles', tipo: 'sobre-objeto', objeto: 'alfombra' }),
      'Carles estaba sobre una alfombra.',
    );
  });

  it('artículo masculino del objeto: junto a un sofá', () => {
    assert.equal(
      texto({ persona: 'lola', tipo: 'junto-a-objeto', objeto: 'sofa' }),
      'Lola estaba junto a un sofá.',
    );
  });
});

describe('textoPista · casos extremos', () => {
  it('la fila 0 es «la primera»', () => {
    assert.equal(
      texto({ persona: 'lola', tipo: 'en-linea', eje: 'fila', indice: 0 }),
      'Lola estaba en la primera fila.',
    );
  });

  it('la última fila o columna se llama «la última», no por su número', () => {
    assert.equal(
      texto({ persona: 'helen', tipo: 'en-linea', eje: 'columna', indice: 4 }),
      'Helen estaba en la última columna.',
    );
  });

  it('en un 9×9, la columna 7 es «la octava» y la 8 es «la última»', () => {
    const caso = casoDePrueba();
    caso.plano = Array.from({ length: 9 }, () => 'C'.repeat(9));
    const frase = (indice) =>
      textoPista({ persona: 'lola', tipo: 'en-linea', eje: 'columna', indice }, caso);
    assert.equal(frase(7), 'Lola estaba en la octava columna.');
    assert.equal(frase(8), 'Lola estaba en la última columna.');
  });

  it('respeta tildes y mayúsculas del nombre tal como están', () => {
    const caso = casoDePrueba();
    caso.personajes[0].nombre = 'Lucía';
    assert.equal(
      textoPista({ persona: 'lola', tipo: 'en-habitacion', habitacion: 'J' }, caso),
      'Lucía estaba en el jardín.',
    );
  });
});

describe('textoPista · casos erróneos (lanza un error claro)', () => {
  it('tipo de pista desconocido', () => {
    assert.throws(() => texto({ persona: 'lola', tipo: 'telepatia' }), /tipo de pista/i);
  });

  it('persona que no existe', () => {
    assert.throws(
      () => texto({ persona: 'nadie', tipo: 'en-habitacion', habitacion: 'C' }),
      /persona/i,
    );
  });

  it('otra persona que no existe', () => {
    assert.throws(
      () => texto({ persona: 'lola', tipo: 'junto-a-persona', otra: 'nadie' }),
      /persona/i,
    );
  });

  it('habitación que no existe', () => {
    assert.throws(
      () => texto({ persona: 'lola', tipo: 'en-habitacion', habitacion: 'X' }),
      /habitaci/i,
    );
  });

  it('objeto que no está en el catálogo', () => {
    assert.throws(
      () => texto({ persona: 'lola', tipo: 'junto-a-objeto', objeto: 'nave-espacial' }),
      /objeto/i,
    );
  });
});
