// Comprueba que un caso está bien formado. No comprueba si las pistas
// se cumplen ni si la solución es única: eso es de las fases 2 y 3.
import {
  OBJETOS,
  TIPOS_DE_PISTA,
  DIRECCIONES,
  TAMANO_MINIMO,
  TAMANO_MAXIMO,
} from './objetos.js';

const error = (codigo, detalle) => ({ codigo, detalle });

const dentro = (n, fila, columna) =>
  Number.isInteger(fila) && Number.isInteger(columna) &&
  fila >= 0 && fila < n && columna >= 0 && columna < n;

function validarPlano(caso) {
  const errores = [];
  const n = caso.plano.length;
  if (n < TAMANO_MINIMO || n > TAMANO_MAXIMO) {
    errores.push(error('tamano-fuera-de-rango', `El plano es de ${n}×${n}.`));
  }
  caso.plano.forEach((fila, i) => {
    if (fila.length !== n) {
      errores.push(error('plano-no-cuadrado', `La fila ${i} tiene ${fila.length} casillas.`));
    }
  });
  const letras = new Set(caso.plano.join(''));
  for (const letra of letras) {
    if (!caso.habitaciones[letra]) {
      errores.push(error('habitacion-desconocida', `La letra «${letra}» no es una habitación.`));
    }
  }
  for (const [letra, hab] of Object.entries(caso.habitaciones)) {
    if (!hab.nombre || !hab.articulo) {
      errores.push(error('habitacion-incompleta', `A la habitación «${letra}» le falta nombre o artículo.`));
    }
  }
  return errores;
}

function validarObjetos(caso) {
  const errores = [];
  const n = caso.plano.length;
  const ocupadas = new Set();
  for (const obj of caso.objetos) {
    if (!OBJETOS[obj.tipo]) {
      errores.push(error('objeto-desconocido', `«${obj.tipo}» no está en el catálogo.`));
    }
    if (!dentro(n, obj.fila, obj.columna)) {
      errores.push(error('objeto-fuera-del-plano', `${obj.tipo} en (${obj.fila}, ${obj.columna}).`));
      continue;
    }
    const clave = `${obj.fila},${obj.columna}`;
    if (ocupadas.has(clave)) {
      errores.push(error('objetos-superpuestos', `Dos objetos en (${clave}).`));
    }
    ocupadas.add(clave);
  }
  return errores;
}

function validarPersonajes(caso) {
  const errores = [];
  const n = caso.plano.length;
  if (caso.personajes.length !== n) {
    errores.push(error('numero-de-personajes', `Hay ${caso.personajes.length} personajes y el plano es de ${n}.`));
  }
  const ids = new Set();
  for (const p of caso.personajes) {
    if (ids.has(p.id)) errores.push(error('personaje-repetido', `«${p.id}» está repetido.`));
    ids.add(p.id);
    if (p.genero !== 'f' && p.genero !== 'm') {
      errores.push(error('genero-invalido', `${p.id} tiene género «${p.genero}».`));
    }
  }
  if (!ids.has(caso.victima)) {
    errores.push(error('victima-desconocida', `La víctima «${caso.victima}» no es un personaje.`));
  }
  return errores;
}

// Devuelve un texto con el problema de los datos de la pista, o null si están bien.
function problemaDePista(pista, caso, ids) {
  const n = caso.plano.length;
  const hayObjeto = (tipo) => caso.objetos.some((o) => o.tipo === tipo);
  const otraValida = () => ids.has(pista.otra) && pista.otra !== pista.persona;

  switch (pista.tipo) {
    case 'en-habitacion':
    case 'no-en-habitacion':
      return caso.habitaciones[pista.habitacion] ? null : `habitación «${pista.habitacion}»`;
    case 'en-linea':
      return ['fila', 'columna'].includes(pista.eje) &&
        Number.isInteger(pista.indice) && pista.indice >= 0 && pista.indice < n
        ? null
        : `${pista.eje} ${pista.indice}`;
    case 'sobre-objeto':
      return OBJETOS[pista.objeto]?.ocupable && hayObjeto(pista.objeto)
        ? null
        : `no se puede estar sobre «${pista.objeto}» en este plano`;
    case 'junto-a-objeto':
      return OBJETOS[pista.objeto] && hayObjeto(pista.objeto) ? null : `objeto «${pista.objeto}»`;
    case 'junto-a-persona':
    case 'a-solas-con':
      return otraValida() ? null : `otra persona «${pista.otra}»`;
    case 'direccion':
      return otraValida() && DIRECCIONES.includes(pista.direccion)
        ? null
        : `dirección «${pista.direccion}» respecto a «${pista.otra}»`;
    default:
      return null;
  }
}

function validarPistas(caso) {
  const errores = [];
  const ids = new Set(caso.personajes.map((p) => p.id));
  for (const pista of caso.pistas) {
    if (!ids.has(pista.persona)) {
      errores.push(error('pista-persona-desconocida', `«${pista.persona}» no es un personaje.`));
    }
    if (pista.persona === caso.victima) {
      errores.push(error('victima-con-pista', 'La víctima no puede tener pistas propias.'));
    }
    if (!TIPOS_DE_PISTA.includes(pista.tipo)) {
      errores.push(error('pista-tipo-desconocido', `Tipo «${pista.tipo}».`));
      continue;
    }
    const problema = problemaDePista(pista, caso, ids);
    if (problema) {
      errores.push(error('pista-dato-invalido', `Pista de ${pista.persona} (${pista.tipo}): ${problema}.`));
    }
  }
  return errores;
}

function validarSolucion(caso) {
  const errores = [];
  const n = caso.plano.length;
  const filas = new Set();
  const columnas = new Set();
  const bloqueadas = new Set(
    caso.objetos
      .filter((o) => OBJETOS[o.tipo] && !OBJETOS[o.tipo].ocupable)
      .map((o) => `${o.fila},${o.columna}`),
  );

  for (const p of caso.personajes) {
    const casilla = caso.solucion[p.id];
    if (!casilla) {
      errores.push(error('solucion-incompleta', `Falta la casilla de ${p.id}.`));
      continue;
    }
    const [fila, columna] = casilla;
    if (!dentro(n, fila, columna)) {
      errores.push(error('solucion-fuera-del-plano', `${p.id} en (${fila}, ${columna}).`));
      continue;
    }
    if (filas.has(fila)) errores.push(error('solucion-fila-repetida', `Fila ${fila}.`));
    if (columnas.has(columna)) errores.push(error('solucion-columna-repetida', `Columna ${columna}.`));
    if (bloqueadas.has(`${fila},${columna}`)) {
      errores.push(error('solucion-sobre-bloqueante', `${p.id} está sobre un objeto bloqueante.`));
    }
    filas.add(fila);
    columnas.add(columna);
  }
  return errores;
}

// Devuelve la lista de errores del caso. Vacía si está bien formado.
export function validarCaso(caso) {
  return [
    ...validarPlano(caso),
    ...validarObjetos(caso),
    ...validarPersonajes(caso),
    ...validarPistas(caso),
    ...validarSolucion(caso),
  ];
}
