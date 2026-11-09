// Escribe las pistas a partir de su estructura.
// - trozosPista / trozosGeneral: trozos { texto, destacado } para pintar negritas.
//   Las pistas personales van SIN el nombre (ya está en la tarjeta).
// - textoPista / textoGeneral: la frase completa en texto plano.
import { OBJETOS } from './objetos.js';

const ORDINALES = [
  'primera', 'segunda', 'tercera', 'cuarta', 'quinta',
  'sexta', 'séptima', 'octava', 'novena',
];
const NUMEROS = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];

const n = (texto) => ({ texto, destacado: false });
const b = (texto) => ({ texto, destacado: true });

function persona(caso, id) {
  const p = caso.personajes.find((x) => x.id === id);
  if (!p) throw new Error(`La persona «${id}» no existe en el caso.`);
  return p;
}

function habitacion(caso, letra) {
  const h = caso.habitaciones[letra];
  if (!h) throw new Error(`La habitación «${letra}» no existe en el caso.`);
  return h;
}

function objeto(tipo) {
  const o = OBJETOS[tipo];
  if (!o) throw new Error(`El objeto «${tipo}» no está en el catálogo.`);
  return o;
}

const ordinal = (indice, tamano) => (indice === tamano - 1 ? 'última' : ORDINALES[indice]);

// Lo que va detrás de «estaba» en cada tipo de pista personal.
function predicado(pista, caso, genero) {
  const otra = () => persona(caso, pista.otra).nombre;
  switch (pista.tipo) {
    case 'en-habitacion': {
      const h = habitacion(caso, pista.habitacion);
      return [n(` en ${h.articulo} `), b(h.nombre)];
    }
    case 'en-linea':
      return [n(' en la '), b(`${ordinal(pista.indice, caso.plano.length)} ${pista.eje}`)];
    case 'sobre-objeto': {
      const o = objeto(pista.objeto);
      const postura = o.postura
        ? [n(' '), b(o.postura[genero]), n(` ${o.preposicion} ${o.articulo} `)]
        : [n(' '), b(o.preposicion), n(` ${o.articulo} `)];
      return [...postura, b(o.nombre)];
    }
    case 'junto-a-objeto': {
      const o = objeto(pista.objeto);
      return [n(' '), b('junto a'), n(` ${o.articulo} `), b(o.nombre)];
    }
    case 'solo':
      return [n(' '), b(genero === 'm' ? 'solo' : 'sola')];
    case 'misma-habitacion':
      return [n(' en la '), b('misma habitación'), n(' que '), b(otra())];
    case 'a-solas-con':
      return [n(' '), b('a solas con'), n(' '), b(otra())];
    case 'en-diagonal':
      return [n(' '), b('en diagonal'), n(' a '), b(otra())];
    case 'direccion':
      return [n(' '), b(`más al ${pista.direccion}`), n(' que '), b(otra())];
    default:
      throw new Error(`Tipo de pista desconocido: «${pista.tipo}».`);
  }
}

// Une trozos seguidos del mismo tipo para que no haya trozos sobrantes.
function juntar(trozos) {
  const salida = [];
  for (const t of trozos) {
    const ultimo = salida[salida.length - 1];
    if (ultimo && ultimo.destacado === t.destacado) ultimo.texto += t.texto;
    else salida.push({ ...t });
  }
  return salida;
}

export function trozosPista(pista, caso) {
  const quien = persona(caso, pista.persona);
  const resto = predicado(pista, caso, quien.genero);
  const inicio = pista.negada ? [b('No'), n(' estaba')] : [n('Estaba')];
  return juntar([...inicio, ...resto, n('.')]);
}

export function textoPista(pista, caso) {
  const nombre = persona(caso, pista.persona).nombre;
  const frase = trozosPista(pista, caso).map((t) => t.texto).join('');
  return `${nombre} ${frase[0].toLowerCase()}${frase.slice(1)}`;
}

// «Había exactamente dos personas …» o «No había nadie …».
function cuantas(cantidad, singular, plural) {
  if (cantidad === 0) return null;
  return [n('Había exactamente '), b(NUMEROS[cantidad]), n(` ${cantidad === 1 ? singular : plural}`)];
}

export function trozosGeneral(general, caso) {
  switch (general.tipo) {
    case 'personas-en-habitacion': {
      const h = habitacion(caso, general.habitacion);
      const inicio = cuantas(general.cantidad, 'persona', 'personas') ?? [b('No'), n(' había '), b('nadie')];
      return juntar([...inicio, n(` en ${h.articulo} `), b(h.nombre), n('.')]);
    }
    case 'personas-sobre-objeto': {
      const o = objeto(general.objeto);
      const c = general.cantidad;
      const forma = c === 0 ? 'm' : c === 1 ? 'f' : 'fp';
      const inicio = cuantas(c, 'persona', 'personas') ?? [b('No'), n(' había '), b('nadie')];
      const postura = o.postura
        ? [n(' '), b(o.postura[forma]), n(` ${o.preposicion} ${o.articulo} `)]
        : [n(' '), b(o.preposicion), n(` ${o.articulo} `)];
      return juntar([...inicio, ...postura, b(o.nombre), n('.')]);
    }
    case 'habitaciones-vacias': {
      const c = general.cantidad;
      if (c === 0) return juntar([b('No'), n(' había ninguna '), b('habitación vacía'), n('.')]);
      return juntar([
        n('Había exactamente '), b(NUMEROS[c]),
        n(' '), b(c === 1 ? 'habitación vacía' : 'habitaciones vacías'), n('.'),
      ]);
    }
    default:
      throw new Error(`Tipo de pista general desconocido: «${general.tipo}».`);
  }
}

export function textoGeneral(general, caso) {
  return trozosGeneral(general, caso).map((t) => t.texto).join('');
}
