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
  caso.habitaciones = { A: { nombre: 'sala', articulo: 'la', suelo: 'madera' } };
  caso.objetos = [];
  caso.personajes = Array.from({ length: n }, (_, i) => ({
    id: `p${i}`,
    nombre: `P${i}`,
    genero: 'f',
    iniciales: String.fromCharCode(65 + i), // A, B, C…
    color: '#888888',
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

describe('validarCaso · tipos de pista nuevos válidos', () => {
  it('acepta solo, misma habitación, a solas, en diagonal y una pista negada', () => {
    const caso = casoDePrueba();
    caso.pistas.push(
      { persona: 'helen', tipo: 'solo' },
      { persona: 'lola', tipo: 'misma-habitacion', otra: 'carles', negada: true },
      { persona: 'carles', tipo: 'a-solas-con', otra: 'calikos', negada: true },
      { persona: 'helen', tipo: 'en-diagonal', otra: 'ingrid' },
    );
    assert.deepEqual(validarCaso(caso), []);
  });

  it('un caso sin pistas generales también es válido', () => {
    const caso = casoDePrueba();
    delete caso.generales;
    assert.deepEqual(validarCaso(caso), []);
  });
});

describe('validarCaso · pistas generales', () => {
  it('acepta los 3 tipos con datos correctos', () => {
    const caso = casoDePrueba();
    caso.generales = [
      { tipo: 'personas-en-habitacion', habitacion: 'J', cantidad: 2 },
      { tipo: 'personas-sobre-objeto', objeto: 'silla', cantidad: 1 },
      { tipo: 'habitaciones-vacias', cantidad: 0 },
    ];
    assert.deepEqual(validarCaso(caso), []);
  });

  it('extremo: cantidad 0 y cantidad igual al tamaño del plano son válidas', () => {
    const caso = casoDePrueba();
    caso.generales = [
      { tipo: 'personas-en-habitacion', habitacion: 'C', cantidad: 0 },
      { tipo: 'personas-en-habitacion', habitacion: 'J', cantidad: 5 },
    ];
    assert.deepEqual(validarCaso(caso), []);
  });

  it('tipo general desconocido', () => {
    const caso = casoDePrueba();
    caso.generales.push({ tipo: 'eclipse' });
    assert.ok(codigos(caso).includes('general-tipo-desconocido'));
  });

  it('cantidad negativa, decimal o mayor que el número de personas', () => {
    for (const cantidad of [-1, 1.5, 6]) {
      const caso = casoDePrueba();
      caso.generales.push({ tipo: 'personas-en-habitacion', habitacion: 'C', cantidad });
      assert.ok(codigos(caso).includes('general-dato-invalido'), String(cantidad));
    }
  });

  it('más habitaciones vacías de las que hay', () => {
    const caso = casoDePrueba();
    caso.generales.push({ tipo: 'habitaciones-vacias', cantidad: 5 }); // solo hay 4
    assert.ok(codigos(caso).includes('general-dato-invalido'));
  });

  it('habitación que no existe u objeto bloqueante o ausente', () => {
    const malos = [
      { tipo: 'personas-en-habitacion', habitacion: 'X', cantidad: 1 },
      { tipo: 'personas-sobre-objeto', objeto: 'planta', cantidad: 1 },
      { tipo: 'personas-sobre-objeto', objeto: 'cama', cantidad: 1 }, // no hay cama en este plano
    ];
    for (const g of malos) {
      const caso = casoDePrueba();
      caso.generales.push(g);
      assert.ok(codigos(caso).includes('general-dato-invalido'), JSON.stringify(g));
    }
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

  it('dos personajes con el mismo nombre (por ejemplo, las dos Celias)', () => {
    const caso = casoDePrueba();
    caso.personajes[1].nombre = 'Lola';
    assert.ok(codigos(caso).includes('nombre-repetido'));
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

  it('pista que relaciona a una persona consigo misma (misma habitación, a solas, diagonal)', () => {
    for (const tipo of ['misma-habitacion', 'a-solas-con', 'en-diagonal']) {
      const caso = casoDePrueba();
      caso.pistas.push({ persona: 'lola', tipo, otra: 'lola' });
      assert.ok(codigos(caso).includes('pista-dato-invalido'), tipo);
    }
  });

  it('«junto a otra persona» y «no-en-habitacion» ya no son tipos válidos', () => {
    for (const tipo of ['junto-a-persona', 'no-en-habitacion']) {
      const caso = casoDePrueba();
      caso.pistas.push({ persona: 'lola', tipo, otra: 'carles', habitacion: 'C' });
      assert.ok(codigos(caso).includes('pista-tipo-desconocido'), tipo);
    }
  });

  it('«negada» tiene que ser true o false', () => {
    const caso = casoDePrueba();
    caso.pistas.push({ persona: 'lola', tipo: 'solo', negada: 'sí' });
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

describe('validarCaso · suelo de las habitaciones (Fase 2)', () => {
  it('acepta los 5 suelos del catálogo', () => {
    for (const suelo of ['madera', 'baldosa', 'cesped', 'moqueta', 'piedra']) {
      const caso = casoDePrueba();
      caso.habitaciones.C.suelo = suelo;
      assert.deepEqual(validarCaso(caso), [], suelo);
    }
  });

  it('habitación sin suelo', () => {
    const caso = casoDePrueba();
    delete caso.habitaciones.C.suelo;
    assert.ok(codigos(caso).includes('suelo-invalido'));
  });

  it('suelo que no está en el catálogo', () => {
    const caso = casoDePrueba();
    caso.habitaciones.C.suelo = 'lava';
    assert.ok(codigos(caso).includes('suelo-invalido'));
  });
});

describe('validarCaso · iniciales y color de los personajes (Fase 2)', () => {
  it('acepta iniciales de 1 y de 2 letras', () => {
    const caso = casoDePrueba();
    assert.equal(caso.personajes.find((p) => p.id === 'helen').iniciales, 'H');
    assert.equal(caso.personajes.find((p) => p.id === 'lola').iniciales, 'LB');
    assert.deepEqual(validarCaso(caso), []);
  });

  it('personaje sin iniciales', () => {
    const caso = casoDePrueba();
    delete caso.personajes[0].iniciales;
    assert.ok(codigos(caso).includes('iniciales-invalidas'));
  });

  it('iniciales de 3 letras', () => {
    const caso = casoDePrueba();
    caso.personajes[0].iniciales = 'LOL';
    assert.ok(codigos(caso).includes('iniciales-invalidas'));
  });

  it('iniciales en minúscula o con números', () => {
    for (const mal of ['lb', 'L1', '']) {
      const caso = casoDePrueba();
      caso.personajes[0].iniciales = mal;
      assert.ok(codigos(caso).includes('iniciales-invalidas'), mal);
    }
  });

  it('dos personajes con las mismas iniciales en el mismo caso', () => {
    const caso = casoDePrueba();
    caso.personajes[1].iniciales = 'LB';
    assert.ok(codigos(caso).includes('iniciales-repetidas'));
  });

  it('personaje sin color o con un color que no es #rrggbb', () => {
    for (const mal of [undefined, 'rojo', '#fff']) {
      const caso = casoDePrueba();
      caso.personajes[0].color = mal;
      assert.ok(codigos(caso).includes('color-invalido'), String(mal));
    }
  });
});
