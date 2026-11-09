// Caso pequeño y válido que usan las pruebas. Cada llamada devuelve una copia
// nueva, para que una prueba pueda romperlo sin afectar a las demás.
//
//        col 0  1  2  3  4
// fila 0     C  C  S  S  S     C = cocina, S = salón,
// fila 1     C  C  S  S  S     B = baño,   J = jardín
// fila 2     B  B  J  J  J
// fila 3     B  B  J  J  J
// fila 4     B  B  J  J  J

const CASO = {
  id: 'caso-de-prueba',
  version: 1,
  titulo: 'Caso de prueba',
  plano: ['CCSSS', 'CCSSS', 'BBJJJ', 'BBJJJ', 'BBJJJ'],
  habitaciones: {
    C: { nombre: 'cocina', articulo: 'la' },
    S: { nombre: 'salón', articulo: 'el' },
    B: { nombre: 'baño', articulo: 'el' },
    J: { nombre: 'jardín', articulo: 'el' },
  },
  objetos: [
    { tipo: 'silla', fila: 0, columna: 0 },
    { tipo: 'planta', fila: 1, columna: 3 },
    { tipo: 'alfombra', fila: 3, columna: 3 },
  ],
  personajes: [
    { id: 'lola', nombre: 'Lola', genero: 'f' },
    { id: 'carles', nombre: 'Carles', genero: 'm' },
    { id: 'helen', nombre: 'Helen', genero: 'f' },
    { id: 'calikos', nombre: 'Calikos', genero: 'm' },
    { id: 'ingrid', nombre: 'Ingrid', genero: 'f' },
  ],
  victima: 'ingrid',
  pistas: [
    { persona: 'lola', tipo: 'sobre-objeto', objeto: 'silla' },
    { persona: 'carles', tipo: 'en-habitacion', habitacion: 'S' },
    { persona: 'helen', tipo: 'en-linea', eje: 'columna', indice: 4 },
    { persona: 'calikos', tipo: 'no-en-habitacion', habitacion: 'C' },
  ],
  solucion: {
    lola: [0, 0],
    carles: [1, 2],
    helen: [2, 4],
    calikos: [3, 1],
    ingrid: [4, 3],
  },
};

export function casoDePrueba() {
  return structuredClone(CASO);
}
