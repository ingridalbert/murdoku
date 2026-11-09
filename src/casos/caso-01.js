// Caso 1 · 5×5 · de prueba (fácil)
//
//        col 0  1  2  3  4
// fila 0     C  C  S  S  S     C = cocina,     S = salón,
// fila 1     C  C  S  S  S     D = dormitorio, J = jardín
// fila 2     D  D  S  J  J
// fila 3     D  D  J  J  J
// fila 4     D  D  J  J  J

export default {
  id: 'caso-01',
  version: 1,
  titulo: 'Cena con sorpresa',
  plano: ['CCSSS', 'CCSSS', 'DDSJJ', 'DDJJJ', 'DDJJJ'],
  habitaciones: {
    C: { nombre: 'cocina', articulo: 'la' },
    S: { nombre: 'salón', articulo: 'el' },
    D: { nombre: 'dormitorio', articulo: 'el' },
    J: { nombre: 'jardín', articulo: 'el' },
  },
  objetos: [
    { tipo: 'silla', fila: 0, columna: 0 },
    { tipo: 'mesa', fila: 1, columna: 1 },
    { tipo: 'sofa', fila: 0, columna: 3 },
    { tipo: 'alfombra', fila: 1, columna: 3 },
    { tipo: 'cama', fila: 3, columna: 0 },
    { tipo: 'estanteria', fila: 4, columna: 1 },
    { tipo: 'planta', fila: 2, columna: 4 },
  ],
  personajes: [
    { id: 'lola', nombre: 'Lola', genero: 'f' },
    { id: 'paloma', nombre: 'Paloma', genero: 'f' },
    { id: 'carles', nombre: 'Carles', genero: 'm' },
    { id: 'naomi', nombre: 'Naomi', genero: 'f' },
    { id: 'berta', nombre: 'Berta', genero: 'f' },
  ],
  victima: 'berta',
  pistas: [
    { persona: 'lola', tipo: 'sobre-objeto', objeto: 'silla' },
    { persona: 'paloma', tipo: 'sobre-objeto', objeto: 'alfombra' },
    { persona: 'carles', tipo: 'en-habitacion', habitacion: 'D' },
    { persona: 'naomi', tipo: 'junto-a-objeto', objeto: 'planta' },
  ],
  solucion: {
    lola: [0, 0],
    paloma: [1, 3],
    carles: [2, 1],
    naomi: [3, 4],
    berta: [4, 2],
  },
};
