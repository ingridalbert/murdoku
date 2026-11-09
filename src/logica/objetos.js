// Catálogos fijos del juego: objetos, tipos de pista, suelos y límites.
//
// Objetos:
// - ocupable: si una persona puede estar en esa casilla.
// - postura: cómo se dice que alguien está encima (f, m y femenino plural para
//   «personas»). null si no hay postura («sobre una alfombra»).
// - preposicion: «en» (sentada en una silla) o «sobre» (sobre una alfombra).
export const OBJETOS = {
  silla: {
    nombre: 'silla',
    articulo: 'una',
    ocupable: true,
    postura: { f: 'sentada', m: 'sentado', fp: 'sentadas' },
    preposicion: 'en',
  },
  cama: {
    nombre: 'cama',
    articulo: 'una',
    ocupable: true,
    postura: { f: 'tumbada', m: 'tumbado', fp: 'tumbadas' },
    preposicion: 'en',
  },
  alfombra: {
    nombre: 'alfombra',
    articulo: 'una',
    ocupable: true,
    postura: null,
    preposicion: 'sobre',
  },
  planta: { nombre: 'planta', articulo: 'una', ocupable: false },
  mesa: { nombre: 'mesa', articulo: 'una', ocupable: false },
  estanteria: { nombre: 'estantería', articulo: 'una', ocupable: false },
  sofa: { nombre: 'sofá', articulo: 'un', ocupable: false },
};

// Pistas de un sospechoso. Cualquiera admite `negada: true`.
export const TIPOS_DE_PISTA = [
  'en-habitacion',
  'en-linea',
  'sobre-objeto',
  'junto-a-objeto',
  'solo',
  'misma-habitacion',
  'a-solas-con',
  'en-diagonal',
  'direccion',
];

// Tipos que relacionan a la persona con otra (campo `otra`).
export const TIPOS_CON_OTRA = ['misma-habitacion', 'a-solas-con', 'en-diagonal', 'direccion'];

// Pistas generales, sobre todo el caso.
export const TIPOS_GENERALES = ['personas-en-habitacion', 'personas-sobre-objeto', 'habitaciones-vacias'];

export const DIRECCIONES = ['norte', 'sur', 'este', 'oeste'];

export const SUELOS = ['madera', 'baldosa', 'cesped', 'moqueta', 'piedra'];

export const TAMANO_MINIMO = 5;
export const TAMANO_MAXIMO = 9;
