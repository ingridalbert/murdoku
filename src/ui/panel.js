// Panel: título del caso, pistas generales y una tarjeta por personaje.
import { trozosPista, trozosGeneral } from '../logica/texto-pistas.js';
import { colorDeTexto } from './colores.js';

function crear(etiqueta, clase, texto) {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

// Convierte trozos { texto, destacado } en texto con <strong>, sin innerHTML.
function pintarTrozos(contenedor, trozos) {
  for (const t of trozos) {
    contenedor.append(t.destacado ? crear('strong', null, t.texto) : document.createTextNode(t.texto));
  }
  return contenedor;
}

function crearCirculo(personaje) {
  const circulo = crear('div', 'circulo', personaje.nombre);
  circulo.style.background = personaje.color;
  circulo.style.color = colorDeTexto(personaje.color);
  return circulo;
}

function crearTarjeta(caso, personaje) {
  const esVictima = personaje.id === caso.victima;
  const tarjeta = crear('article', esVictima ? 'tarjeta victima' : 'tarjeta');
  tarjeta.dataset.personaje = personaje.id;
  tarjeta.append(crearCirculo(personaje));

  if (esVictima) {
    tarjeta.append(crear('span', 'rotulo', '💀 Víctima'));
    tarjeta.append(crear('p', 'pista', 'Estaba a solas con su asesino.'));
    return tarjeta;
  }
  for (const pista of caso.pistas.filter((p) => p.persona === personaje.id)) {
    tarjeta.append(pintarTrozos(crear('p', 'pista'), trozosPista(pista, caso)));
  }
  return tarjeta;
}

function crearPistasGenerales(caso) {
  const lista = crear('ul', 'pistas-generales');
  const regla = crear('li');
  regla.append(
    'La víctima estaba ',
    crear('strong', null, 'a solas con'),
    ' su asesino: en su habitación había ',
    crear('strong', null, 'un único sospechoso'),
    '.',
  );
  lista.append(regla);
  for (const g of caso.generales ?? []) {
    lista.append(pintarTrozos(crear('li'), trozosGeneral(g, caso)));
  }
  return lista;
}

function seccion(titulo, contenido) {
  const s = crear('section', 'seccion');
  s.append(crear('h3', null, titulo), contenido);
  return s;
}

export function crearPanel(caso) {
  const panel = crear('aside', 'panel');
  const n = caso.plano.length;

  const titulo = crear('h2', 'titulo-caso', caso.titulo);
  titulo.append(crear('span', 'tamano', `${n}×${n}`));

  const tarjetas = crear('div', 'tarjetas');
  for (const p of caso.personajes) tarjetas.append(crearTarjeta(caso, p));

  panel.append(
    titulo,
    seccion('Pistas generales', crearPistasGenerales(caso)),
    seccion('Personajes', tarjetas),
  );
  return panel;
}
