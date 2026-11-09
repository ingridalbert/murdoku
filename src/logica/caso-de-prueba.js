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
    C: { nombre: 'cocina', articulo: 'la', suelo: 'baldosa' },
    S: { nombre: 'salón', articulo: 'el', suelo: 'madera' },
    B: { nombre: 'baño', articulo: 'el', suelo: 'baldosa' },
    J: { nombre: 'jardín', articulo: 'el', suelo: 'cesped' },
  },
  objetos: [
    { tipo: 'silla', fila: 0, columna: 0 },
    { tipo: 'planta', fila: 1, columna: 3 },
    { tipo: 'alfombra', fila: 3, columna: 3 },
  ],
  personajes: [
    { id: 'lola', nombre: 'Lola', genero: 'f', iniciales: 'LB', color: '#ff6b6b' },
    { id: 'carles', nombre: 'Carles', genero: 'm', iniciales: 'CM', color: '#4dabf7' },
    { id: 'helen', nombre: 'Helen', genero: 'f', iniciales: 'H', color: '#ffd43b' },
    { id: 'calikos', nombre: 'Calikos', genero: 'm', iniciales: 'CU', color: '#51cf66' },
    { id: 'ingrid', nombre: 'Ingrid', genero: 'f', iniciales: 'I', color: '#cc5de8' },
  ],
  victima: 'ingrid',
  pistas: [
    { persona: 'lola', tipo: 'sobre-objeto', objeto: 'silla' },
    { persona: 'carles', tipo: 'en-habitacion', habitacion: 'S' },
    { persona: 'helen', tipo: 'en-linea', eje: 'columna', indice: 4 },
    { persona: 'calikos', tipo: 'en-habitacion', habitacion: 'C', negada: true },
  ],
  generales: [{ tipo: 'habitaciones-vacias', cantidad: 0 }],
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
