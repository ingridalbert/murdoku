// Dibuja el tablero de un caso: suelos, paredes, objetos y nombres de habitación.
import { paredes } from '../logica/paredes.js';
import { posicionEtiqueta } from '../logica/etiquetas.js';
import { OBJETOS } from '../logica/objetos.js';
import { DIBUJOS } from './dibujos.js';

function crearCasilla(caso, fila, columna, objetos) {
  const letra = caso.plano[fila][columna];
  const habitacion = caso.habitaciones[letra];
  const casilla = document.createElement('div');
  casilla.className = `casilla suelo-${habitacion.suelo}`;
  casilla.dataset.fila = fila;
  casilla.dataset.columna = columna;
  casilla.style.gridRow = fila + 1;
  casilla.style.gridColumn = columna + 1;

  for (const [lado, hay] of Object.entries(paredes(caso.plano, fila, columna))) {
    if (hay) casilla.classList.add(`pared-${lado}`);
  }

  const tipo = objetos.get(`${fila},${columna}`);
  if (tipo) {
    casilla.innerHTML = DIBUJOS[tipo]; // dibujos propios y fijos, sin datos del usuario
    casilla.title = `${OBJETOS[tipo].nombre} (${habitacion.nombre})`;
  } else {
    casilla.title = habitacion.nombre;
  }
  return casilla;
}

function crearEtiqueta(caso, letra) {
  const { fila, desde, hasta } = posicionEtiqueta(caso.plano, letra);
  const etiqueta = document.createElement('span');
  etiqueta.className = 'etiqueta-habitacion';
  etiqueta.textContent = caso.habitaciones[letra].nombre;
  etiqueta.style.gridRow = fila + 1;
  etiqueta.style.gridColumn = `${desde + 1} / ${hasta + 2}`;
  return etiqueta;
}

export function crearPlano(caso) {
  const n = caso.plano.length;
  const objetos = new Map(caso.objetos.map((o) => [`${o.fila},${o.columna}`, o.tipo]));

  const tablero = document.createElement('div');
  tablero.className = 'tablero';
  tablero.setAttribute('role', 'grid');
  tablero.setAttribute('aria-label', `Plano de ${n}×${n}`);

  for (let fila = 0; fila < n; fila++) {
    for (let columna = 0; columna < n; columna++) {
      tablero.append(crearCasilla(caso, fila, columna, objetos));
    }
  }
  for (const letra of Object.keys(caso.habitaciones)) {
    tablero.append(crearEtiqueta(caso, letra));
  }
  return tablero;
}
