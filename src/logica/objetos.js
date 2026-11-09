// Catálogo de objetos que pueden aparecer en un plano.
// - ocupable: si una persona puede estar en esa casilla.
// - sobre: cómo se dice que alguien está encima, en femenino y masculino
//   (solo en los ocupables).
export const OBJETOS = {
  silla: {
    nombre: 'silla',
    articulo: 'una',
    ocupable: true,
    sobre: { f: 'sentada en', m: 'sentado en' },
    emoji: '🪑',
  },
  cama: {
    nombre: 'cama',
    articulo: 'una',
    ocupable: true,
    sobre: { f: 'tumbada en', m: 'tumbado en' },
    emoji: '🛏️',
  },
  alfombra: {
    nombre: 'alfombra',
    articulo: 'una',
    ocupable: true,
    sobre: { f: 'sobre', m: 'sobre' },
    emoji: '🧶',
  },
  planta: { nombre: 'planta', articulo: 'una', ocupable: false, emoji: '🪴' },
  mesa: { nombre: 'mesa', articulo: 'una', ocupable: false, emoji: '🍽️' },
  estanteria: { nombre: 'estantería', articulo: 'una', ocupable: false, emoji: '📚' },
  sofa: { nombre: 'sofá', articulo: 'un', ocupable: false, emoji: '🛋️' },
};

export const TIPOS_DE_PISTA = [
  'en-habitacion',
  'en-linea',
  'sobre-objeto',
  'no-en-habitacion',
  'junto-a-objeto',
  'junto-a-persona',
  'a-solas-con',
  'direccion',
];

export const DIRECCIONES = ['norte', 'sur', 'este', 'oeste'];

export const TAMANO_MINIMO = 5;
export const TAMANO_MAXIMO = 9;
