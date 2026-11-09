import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { textoPista, trozosPista, textoGeneral, trozosGeneral } from './texto-pistas.js';
import { casoDePrueba } from './caso-de-prueba.js';

// textoPista(pista, caso): la frase completa, con el nombre.
// trozosPista(pista, caso): la frase para la tarjeta, SIN el nombre, en trozos
//   { texto, destacado }. En estas pruebas lo destacado se marca con **asteriscos**.
// textoGeneral / trozosGeneral: lo mismo para las pistas generales del caso.
const texto = (pista, caso = casoDePrueba()) => textoPista(pista, caso);
const unir = (trozos) => trozos.map((t) => (t.destacado ? `**${t.texto}**` : t.texto)).join('');
const marcado = (pista, caso = casoDePrueba()) => unir(trozosPista(pista, caso));
const general = (g, caso = casoDePrueba()) => textoGeneral(g, caso);
const generalMarcado = (g, caso = casoDePrueba()) => unir(trozosGeneral(g, caso));

describe('textoPista · los 9 tipos personales', () => {
  it('en una habitación', () => {
    assert.equal(
      texto({ persona: 'carles', tipo: 'en-habitacion', habitacion: 'S' }),
      'Carles estaba en el salón.',
    );
  });

  it('en una fila o columna', () => {
    assert.equal(
      texto({ persona: 'lola', tipo: 'en-linea', eje: 'fila', indice: 1 }),
      'Lola estaba en la segunda fila.',
    );
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

  it('junto a un objeto', () => {
    assert.equal(
      texto({ persona: 'helen', tipo: 'junto-a-objeto', objeto: 'planta' }),
      'Helen estaba junto a una planta.',
    );
  });

  it('solo / sola', () => {
    assert.equal(texto({ persona: 'helen', tipo: 'solo' }), 'Helen estaba sola.');
    assert.equal(texto({ persona: 'carles', tipo: 'solo' }), 'Carles estaba solo.');
  });

  it('en la misma habitación que otra persona', () => {
    assert.equal(
      texto({ persona: 'lola', tipo: 'misma-habitacion', otra: 'carles' }),
      'Lola estaba en la misma habitación que Carles.',
    );
  });

  it('a solas con otra persona', () => {
    assert.equal(
      texto({ persona: 'carles', tipo: 'a-solas-con', otra: 'lola' }),
      'Carles estaba a solas con Lola.',
    );
  });

  it('en diagonal a otra persona', () => {
    assert.equal(
      texto({ persona: 'helen', tipo: 'en-diagonal', otra: 'lola' }),
      'Helen estaba en diagonal a Lola.',
    );
  });

  it('dirección (los 4 puntos cardinales)', () => {
    const frase = (direccion) =>
      texto({ persona: 'lola', tipo: 'direccion', otra: 'helen', direccion });
    assert.equal(frase('norte'), 'Lola estaba más al norte que Helen.');
    assert.equal(frase('sur'), 'Lola estaba más al sur que Helen.');
    assert.equal(frase('este'), 'Lola estaba más al este que Helen.');
    assert.equal(frase('oeste'), 'Lola estaba más al oeste que Helen.');
  });
});

describe('textoPista · en negativo (negada: true)', () => {
  it('cualquier tipo admite «no» delante de «estaba»', () => {
    const casos = [
      [{ persona: 'calikos', tipo: 'en-habitacion', habitacion: 'C' }, 'Calikos no estaba en la cocina.'],
      [{ persona: 'lola', tipo: 'sobre-objeto', objeto: 'silla' }, 'Lola no estaba sentada en una silla.'],
      [{ persona: 'helen', tipo: 'junto-a-objeto', objeto: 'planta' }, 'Helen no estaba junto a una planta.'],
      [{ persona: 'carles', tipo: 'solo' }, 'Carles no estaba solo.'],
      [{ persona: 'lola', tipo: 'direccion', otra: 'helen', direccion: 'sur' }, 'Lola no estaba más al sur que Helen.'],
    ];
    for (const [pista, esperado] of casos) {
      assert.equal(texto({ ...pista, negada: true }), esperado);
    }
  });

  it('negada: false es lo mismo que no ponerla', () => {
    const pista = { persona: 'carles', tipo: 'en-habitacion', habitacion: 'S' };
    assert.equal(texto({ ...pista, negada: false }), texto(pista));
  });
});

describe('textoPista · género', () => {
  it('silla: sentada / sentado', () => {
    assert.equal(texto({ persona: 'helen', tipo: 'sobre-objeto', objeto: 'silla' }), 'Helen estaba sentada en una silla.');
    assert.equal(texto({ persona: 'carles', tipo: 'sobre-objeto', objeto: 'silla' }), 'Carles estaba sentado en una silla.');
  });

  it('cama: tumbada / tumbado', () => {
    assert.equal(texto({ persona: 'lola', tipo: 'sobre-objeto', objeto: 'cama' }), 'Lola estaba tumbada en una cama.');
    assert.equal(texto({ persona: 'calikos', tipo: 'sobre-objeto', objeto: 'cama' }), 'Calikos estaba tumbado en una cama.');
  });

  it('alfombra: «sobre», igual para los dos', () => {
    assert.equal(texto({ persona: 'lola', tipo: 'sobre-objeto', objeto: 'alfombra' }), 'Lola estaba sobre una alfombra.');
    assert.equal(texto({ persona: 'carles', tipo: 'sobre-objeto', objeto: 'alfombra' }), 'Carles estaba sobre una alfombra.');
  });

  it('artículo masculino del objeto: junto a un sofá', () => {
    assert.equal(texto({ persona: 'lola', tipo: 'junto-a-objeto', objeto: 'sofa' }), 'Lola estaba junto a un sofá.');
  });
});

describe('textoPista · casos extremos', () => {
  it('la fila 0 es «la primera» y la última se llama «la última»', () => {
    assert.equal(texto({ persona: 'lola', tipo: 'en-linea', eje: 'fila', indice: 0 }), 'Lola estaba en la primera fila.');
    assert.equal(texto({ persona: 'helen', tipo: 'en-linea', eje: 'columna', indice: 4 }), 'Helen estaba en la última columna.');
  });

  it('en un 9×9, la columna 7 es «la octava» y la 8 es «la última»', () => {
    const caso = casoDePrueba();
    caso.plano = Array.from({ length: 9 }, () => 'C'.repeat(9));
    const frase = (indice) => texto({ persona: 'lola', tipo: 'en-linea', eje: 'columna', indice }, caso);
    assert.equal(frase(7), 'Lola estaba en la octava columna.');
    assert.equal(frase(8), 'Lola estaba en la última columna.');
  });

  it('respeta tildes y mayúsculas del nombre tal como están', () => {
    const caso = casoDePrueba();
    caso.personajes[0].nombre = 'Lucía';
    assert.equal(texto({ persona: 'lola', tipo: 'en-habitacion', habitacion: 'J' }, caso), 'Lucía estaba en el jardín.');
  });
});

describe('textoPista · casos erróneos (lanza un error claro)', () => {
  it('tipo de pista desconocido', () => {
    assert.throws(() => texto({ persona: 'lola', tipo: 'telepatia' }), /tipo de pista/i);
  });

  it('«junto a otra persona» ya no existe (es imposible con una persona por fila y columna)', () => {
    assert.throws(() => texto({ persona: 'lola', tipo: 'junto-a-persona', otra: 'carles' }), /tipo de pista/i);
  });

  it('persona u otra persona que no existe', () => {
    assert.throws(() => texto({ persona: 'nadie', tipo: 'solo' }), /persona/i);
    assert.throws(() => texto({ persona: 'lola', tipo: 'en-diagonal', otra: 'nadie' }), /persona/i);
  });

  it('habitación que no existe', () => {
    assert.throws(() => texto({ persona: 'lola', tipo: 'en-habitacion', habitacion: 'X' }), /habitaci/i);
  });

  it('objeto que no está en el catálogo', () => {
    assert.throws(() => texto({ persona: 'lola', tipo: 'junto-a-objeto', objeto: 'nave-espacial' }), /objeto/i);
  });
});

describe('trozosPista · palabras clave en negrita (para la tarjeta, sin el nombre)', () => {
  it('los 9 tipos', () => {
    const casos = [
      [{ persona: 'carles', tipo: 'en-habitacion', habitacion: 'S' }, 'Estaba en el **salón**.'],
      [{ persona: 'helen', tipo: 'en-linea', eje: 'columna', indice: 4 }, 'Estaba en la **última columna**.'],
      [{ persona: 'lola', tipo: 'sobre-objeto', objeto: 'silla' }, 'Estaba **sentada** en una **silla**.'],
      [{ persona: 'lola', tipo: 'sobre-objeto', objeto: 'alfombra' }, 'Estaba **sobre** una **alfombra**.'],
      [{ persona: 'helen', tipo: 'junto-a-objeto', objeto: 'planta' }, 'Estaba **junto a** una **planta**.'],
      [{ persona: 'carles', tipo: 'solo' }, 'Estaba **solo**.'],
      [{ persona: 'lola', tipo: 'misma-habitacion', otra: 'carles' }, 'Estaba en la **misma habitación** que **Carles**.'],
      [{ persona: 'carles', tipo: 'a-solas-con', otra: 'lola' }, 'Estaba **a solas con** **Lola**.'],
      [{ persona: 'helen', tipo: 'en-diagonal', otra: 'lola' }, 'Estaba **en diagonal** a **Lola**.'],
      [{ persona: 'lola', tipo: 'direccion', otra: 'helen', direccion: 'norte' }, 'Estaba **más al norte** que **Helen**.'],
    ];
    for (const [pista, esperado] of casos) assert.equal(marcado(pista), esperado, pista.tipo);
  });

  it('en negativo, «No» va al principio y en negrita', () => {
    assert.equal(
      marcado({ persona: 'helen', tipo: 'junto-a-objeto', objeto: 'mesa', negada: true }),
      '**No** estaba **junto a** una **mesa**.',
    );
  });

  it('coherencia: nombre + trozos (con minúscula inicial) = textoPista, en todos los tipos y negados', () => {
    const caso = casoDePrueba();
    const pistas = [
      { persona: 'carles', tipo: 'en-habitacion', habitacion: 'S' },
      { persona: 'lola', tipo: 'en-linea', eje: 'fila', indice: 0 },
      { persona: 'lola', tipo: 'sobre-objeto', objeto: 'silla' },
      { persona: 'helen', tipo: 'junto-a-objeto', objeto: 'planta' },
      { persona: 'carles', tipo: 'solo' },
      { persona: 'lola', tipo: 'misma-habitacion', otra: 'carles' },
      { persona: 'carles', tipo: 'a-solas-con', otra: 'lola' },
      { persona: 'helen', tipo: 'en-diagonal', otra: 'lola' },
      { persona: 'lola', tipo: 'direccion', otra: 'helen', direccion: 'oeste' },
    ];
    for (const base of pistas) {
      for (const pista of [base, { ...base, negada: true }]) {
        const nombre = caso.personajes.find((p) => p.id === pista.persona).nombre;
        const frase = trozosPista(pista, caso).map((t) => t.texto).join('');
        const trozos = trozosPista(pista, caso);
        assert.equal(`${nombre} ${frase[0].toLowerCase()}${frase.slice(1)}`, textoPista(pista, caso), pista.tipo);
        assert.ok(trozos.every((t) => t.texto.length > 0), `trozo vacío en ${pista.tipo}`);
        assert.ok(trozos.some((t) => t.destacado), `nada destacado en ${pista.tipo}`);
      }
    }
  });
});

describe('textoGeneral · las 3 pistas generales', () => {
  it('personas en una habitación: 0, 1 y varias', () => {
    const g = (cantidad) => general({ tipo: 'personas-en-habitacion', habitacion: 'C', cantidad });
    assert.equal(g(0), 'No había nadie en la cocina.');
    assert.equal(g(1), 'Había exactamente una persona en la cocina.');
    assert.equal(g(2), 'Había exactamente dos personas en la cocina.');
  });

  it('personas sobre un tipo de objeto: 0, 1 y varias (en femenino: «personas»)', () => {
    const g = (objeto, cantidad) => general({ tipo: 'personas-sobre-objeto', objeto, cantidad });
    assert.equal(g('silla', 0), 'No había nadie sentado en una silla.');
    assert.equal(g('cama', 1), 'Había exactamente una persona tumbada en una cama.');
    assert.equal(g('silla', 2), 'Había exactamente dos personas sentadas en una silla.');
    assert.equal(g('alfombra', 3), 'Había exactamente tres personas sobre una alfombra.');
  });

  it('habitaciones vacías: 0, 1 y varias', () => {
    const g = (cantidad) => general({ tipo: 'habitaciones-vacias', cantidad });
    assert.equal(g(0), 'No había ninguna habitación vacía.');
    assert.equal(g(1), 'Había exactamente una habitación vacía.');
    assert.equal(g(2), 'Había exactamente dos habitaciones vacías.');
  });

  it('extremo: cantidades hasta nueve escritas con letra', () => {
    assert.equal(
      general({ tipo: 'personas-en-habitacion', habitacion: 'J', cantidad: 9 }),
      'Había exactamente nueve personas en el jardín.',
    );
  });

  it('negritas de las generales', () => {
    assert.equal(
      generalMarcado({ tipo: 'personas-en-habitacion', habitacion: 'C', cantidad: 2 }),
      'Había exactamente **dos** personas en la **cocina**.',
    );
    assert.equal(
      generalMarcado({ tipo: 'habitaciones-vacias', cantidad: 0 }),
      '**No** había ninguna **habitación vacía**.',
    );
  });

  it('erróneo: tipo de pista general desconocido', () => {
    assert.throws(() => general({ tipo: 'eclipse' }), /tipo de pista general/i);
  });
});
