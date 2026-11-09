// Punto de entrada: valida el caso 1 y lo dibuja.
import caso from './casos/caso-01.js';
import { validarCaso } from './logica/formato.js';
import { crearPlano } from './ui/plano.js';
import { crearPanel } from './ui/panel.js';

const juego = document.getElementById('juego');
const errores = validarCaso(caso);

if (errores.length > 0) {
  const aviso = document.createElement('p');
  aviso.className = 'error';
  aviso.textContent = `El caso «${caso.id}» tiene errores: ${errores.map((e) => e.detalle).join(' ')}`;
  juego.append(aviso);
} else {
  document.documentElement.style.setProperty('--n', caso.plano.length);
  juego.append(crearPlano(caso), crearPanel(caso));
}
