// Catálogo único de personajes: amigos de Ingrid, solo con nombre de pila o apodo.
// Las iniciales las eligió Ingrid y se usan como notas en el plano. Los colores
// son del círculo de cada tarjeta. Los casos los piden con personajes('lola', ...).
//
// Norma: en un mismo caso no puede haber dos personajes con el mismo nombre
// (las dos Celias) ni con las mismas iniciales (Carles y Celia M., Paula y Cabedo).

const LISTA = [
  // Mujeres
  { id: 'ingrid', nombre: 'Ingrid', genero: 'f', iniciales: 'IA', color: '#ff5d8f' },
  { id: 'lola', nombre: 'Lola', genero: 'f', iniciales: 'LB', color: '#ff8c42' },
  { id: 'paloma', nombre: 'Paloma', genero: 'f', iniciales: 'PS', color: '#ffc93c' },
  { id: 'helen', nombre: 'Helen', genero: 'f', iniciales: 'HF', color: '#9bdb4d' },
  { id: 'lucia', nombre: 'Lucia', genero: 'f', iniciales: 'LS', color: '#2ec4b6' },
  { id: 'luza', nombre: 'Luza', genero: 'f', iniciales: 'LZ', color: '#3a86ff' },
  { id: 'naomi', nombre: 'Naomi', genero: 'f', iniciales: 'NB', color: '#8338ec' },
  { id: 'karol', nombre: 'Karol', genero: 'f', iniciales: 'CN', color: '#c77dff' },
  { id: 'zoryana', nombre: 'Zoryana', genero: 'f', iniciales: 'ZK', color: '#f15bb5' },
  { id: 'anna', nombre: 'Anna', genero: 'f', iniciales: 'AA', color: '#00bbf9' },
  { id: 'berta', nombre: 'Berta', genero: 'f', iniciales: 'BM', color: '#e63946' },
  { id: 'andrea', nombre: 'Andrea', genero: 'f', iniciales: 'AF', color: '#ffafcc' },
  { id: 'miriam', nombre: 'Miriam', genero: 'f', iniciales: 'MQ', color: '#b5179e' },
  { id: 'silvia', nombre: 'Silvia', genero: 'f', iniciales: 'SB', color: '#80ed99' },
  { id: 'celia-m', nombre: 'Celia', genero: 'f', iniciales: 'CM', color: '#fb8500' },
  { id: 'celia-j', nombre: 'Celia', genero: 'f', iniciales: 'CJ', color: '#4cc9f0' },
  { id: 'onis', nombre: 'Ónis', genero: 'f', iniciales: 'OM', color: '#ffd6a5' },
  { id: 'paula', nombre: 'Paula', genero: 'f', iniciales: 'PC', color: '#cdb4db' },
  { id: 'alba', nombre: 'Alba', genero: 'f', iniciales: 'AC', color: '#fee440' },
  // Hombres
  { id: 'carles', nombre: 'Carles', genero: 'm', iniciales: 'CM', color: '#06d6a0' },
  { id: 'calikos', nombre: 'Calikos', genero: 'm', iniciales: 'CU', color: '#f4a261' },
  { id: 'edgar', nombre: 'Edgar', genero: 'm', iniciales: 'EC', color: '#118ab2' },
  { id: 'sanahuja', nombre: 'Sanahuja', genero: 'm', iniciales: 'DS', color: '#7209b7' },
  { id: 'manuel', nombre: 'Manuel', genero: 'm', iniciales: 'MV', color: '#2a9d8f' },
  { id: 'oscar', nombre: 'Oscar', genero: 'm', iniciales: 'OT', color: '#ef476f' },
  { id: 'tendero', nombre: 'Tendero', genero: 'm', iniciales: 'CT', color: '#a7c957' },
  { id: 'cabedo', nombre: 'Cabedo', genero: 'm', iniciales: 'PC', color: '#4361ee' },
];

export const PERSONAJES = Object.freeze(Object.fromEntries(LISTA.map((p) => [p.id, Object.freeze(p)])));

export function personajes(...ids) {
  const elegidos = [];
  for (const id of ids) {
    const p = PERSONAJES[id];
    if (!p) throw new Error(`El personaje «${id}» no está en el catálogo.`);
    for (const otro of elegidos) {
      if (otro.id === id) throw new Error(`El personaje «${id}» está repetido.`);
      if (otro.nombre === p.nombre) {
        throw new Error(`«${otro.id}» y «${id}» tienen el mismo nombre: no pueden ir en el mismo caso.`);
      }
      if (otro.iniciales === p.iniciales) {
        throw new Error(`«${otro.id}» y «${id}» tienen las mismas iniciales (${p.iniciales}): no pueden ir en el mismo caso.`);
      }
    }
    elegidos.push({ ...p });
  }
  return elegidos;
}
