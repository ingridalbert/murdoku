// Panel lateral: habitaciones, personajes y pistas del caso.
import { textoPista } from '../logica/texto-pistas.js';
import { coloresDeHabitaciones } from './plano.js';

function lista(elementos, clase) {
  const ul = document.createElement('ul');
  if (clase) ul.className = clase;
  for (const el of elementos) ul.append(el);
  return ul;
}

function item(texto, clase) {
  const li = document.createElement('li');
  li.textContent = texto;
  if (clase) li.className = clase;
  return li;
}

function titulo(nivel, texto) {
  const h = document.createElement(`h${nivel}`);
  h.textContent = texto;
  return h;
}

export function crearPanel(caso) {
  const panel = document.createElement('section');
  panel.className = 'panel';

  const colores = coloresDeHabitaciones(caso);
  const habitaciones = Object.entries(caso.habitaciones).map(([letra, h]) => {
    const li = document.createElement('li');
    const muestra = document.createElement('span');
    muestra.className = 'muestra';
    muestra.style.background = colores[letra];
    li.append(muestra, h.nombre);
    return li;
  });

  const personajes = caso.personajes.map((p) =>
    p.id === caso.victima ? item(`${p.nombre} 💀 (víctima)`, 'victima') : item(p.nombre),
  );

  const pistas = caso.pistas.map((p) => item(textoPista(p, caso)));
  pistas.push(item(
    'La víctima estaba a solas con su asesino: en su habitación había un único sospechoso.',
  ));

  panel.append(
    titulo(2, caso.titulo),
    titulo(3, 'Habitaciones'),
    lista(habitaciones, 'leyenda'),
    titulo(3, 'Personajes'),
    lista(personajes),
    titulo(3, 'Pistas'),
    lista(pistas, 'pistas'),
  );
  return panel;
}
