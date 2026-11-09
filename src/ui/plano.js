// Dibuja el plano de un caso: habitaciones en colores, paredes y objetos.
import { paredes } from '../logica/paredes.js';
import { OBJETOS } from '../logica/objetos.js';

const COLORES = [
  '#f3d9b1', '#cfe3c8', '#c9dcef', '#ecc9d6',
  '#e2d5f0', '#f5e7a8', '#c8e6e1', '#e9cfc0', '#d9d9d9',
];

export function coloresDeHabitaciones(caso) {
  return Object.fromEntries(
    Object.keys(caso.habitaciones).map((letra, i) => [letra, COLORES[i % COLORES.length]]),
  );
}

export function crearPlano(caso) {
  const n = caso.plano.length;
  const colores = coloresDeHabitaciones(caso);
  const objetos = new Map(caso.objetos.map((o) => [`${o.fila},${o.columna}`, o.tipo]));

  const plano = document.createElement('div');
  plano.className = 'plano';
  plano.style.gridTemplateColumns = `repeat(${n}, var(--casilla))`;
  plano.setAttribute('role', 'grid');
  plano.setAttribute('aria-label', `Plano de ${n}×${n}`);

  for (let fila = 0; fila < n; fila++) {
    for (let columna = 0; columna < n; columna++) {
      const letra = caso.plano[fila][columna];
      const casilla = document.createElement('div');
      casilla.className = 'casilla';
      casilla.dataset.fila = fila;
      casilla.dataset.columna = columna;
      casilla.style.background = colores[letra];

      for (const [lado, hay] of Object.entries(paredes(caso.plano, fila, columna))) {
        if (hay) casilla.classList.add(`pared-${lado}`);
      }

      const habitacion = caso.habitaciones[letra].nombre;
      const tipo = objetos.get(`${fila},${columna}`);
      if (tipo) {
        casilla.textContent = OBJETOS[tipo].emoji;
        casilla.title = `${OBJETOS[tipo].nombre} (${habitacion})`;
      } else {
        casilla.title = habitacion;
      }
      plano.append(casilla);
    }
  }
  return plano;
}
