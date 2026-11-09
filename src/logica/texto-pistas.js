// Escribe la frase que ve el jugador a partir de una pista estructurada.
import { OBJETOS } from './objetos.js';

const ORDINALES = [
  'primera', 'segunda', 'tercera', 'cuarta', 'quinta',
  'sexta', 'séptima', 'octava', 'novena',
];

function persona(caso, id) {
  const p = caso.personajes.find((x) => x.id === id);
  if (!p) throw new Error(`La persona «${id}» no existe en el caso.`);
  return p;
}

function habitacion(caso, letra) {
  const h = caso.habitaciones[letra];
  if (!h) throw new Error(`La habitación «${letra}» no existe en el caso.`);
  return `${h.articulo} ${h.nombre}`;
}

function objeto(tipo) {
  const o = OBJETOS[tipo];
  if (!o) throw new Error(`El objeto «${tipo}» no está en el catálogo.`);
  return o;
}

function ordinal(indice, n) {
  return indice === n - 1 ? 'última' : ORDINALES[indice];
}

export function textoPista(pista, caso) {
  const quien = persona(caso, pista.persona);
  const nombre = quien.nombre;

  switch (pista.tipo) {
    case 'en-habitacion':
      return `${nombre} estaba en ${habitacion(caso, pista.habitacion)}.`;
    case 'no-en-habitacion':
      return `${nombre} no estaba en ${habitacion(caso, pista.habitacion)}.`;
    case 'en-linea':
      return `${nombre} estaba en la ${ordinal(pista.indice, caso.plano.length)} ${pista.eje}.`;
    case 'sobre-objeto': {
      const o = objeto(pista.objeto);
      return `${nombre} estaba ${o.sobre[quien.genero]} ${o.articulo} ${o.nombre}.`;
    }
    case 'junto-a-objeto': {
      const o = objeto(pista.objeto);
      return `${nombre} estaba junto a ${o.articulo} ${o.nombre}.`;
    }
    case 'junto-a-persona':
      return `${nombre} estaba junto a ${persona(caso, pista.otra).nombre}.`;
    case 'a-solas-con':
      return `${nombre} estaba a solas con ${persona(caso, pista.otra).nombre}.`;
    case 'direccion':
      return `${nombre} estaba más al ${pista.direccion} que ${persona(caso, pista.otra).nombre}.`;
    default:
      throw new Error(`Tipo de pista desconocido: «${pista.tipo}».`);
  }
}
