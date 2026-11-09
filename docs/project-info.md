# Información del proyecto: Murdoku

## Qué es
Un juego de lógica en el navegador que mezcla sudoku y misterio. Hay un plano en cuadrícula dividido en habitaciones y una lista de pistas. El jugador coloca a los sospechosos y a la víctima para descubrir quién es el asesino. Los casos, los textos y el diseño son propios.

## Para quién
Ingrid y su grupo de amigos, que aparecen como personajes, y en general gente a la que le gustan los puzles lógicos (sudoku, juegos de detectives) y quiere resolver un caso de 5 a 40 minutos sin registrarse.

## Reglas del juego
- El plano tiene N×N casillas, de 5×5 a 9×9, repartidas en habitaciones. Cuanto más grande, más difícil.
- Hay dos tipos de objetos:
  - **Bloqueantes** (mesa, planta, estantería): nadie puede ocupar esa casilla.
  - **Ocupables** (silla, alfombra, cama): se puede estar encima.
- Hay N personas: la víctima y N−1 sospechosos, una por fila y una por columna.
- Cada sospechoso tiene pistas. **La víctima no tiene pistas propias.**
- **Regla del asesino:** la víctima está a solas con su asesino. En la habitación de la víctima hay exactamente un sospechoso, y ese es el asesino. Es una regla más, que el jugador puede usar para deducir.
- **«Junto a»:** las 4 casillas en cruz (arriba, abajo, izquierda, derecha) y **dentro de la misma habitación**. A través de una pared no cuenta, ni con personas ni con objetos.
- **Norte** es arriba. «Más al norte que X» significa en una fila superior a la de X.
- Cada caso tiene una única solución.

## Pistas (primera versión)
| Dificultad | Tipo | Ejemplo |
|---|---|---|
| Fácil | En una habitación | «Bruno estaba en la cocina.» |
| Fácil | En una fila o columna | «Ana estaba en la última columna.» |
| Fácil | Sobre un objeto ocupable | «Carla estaba sentada en una silla.» |
| Media | No estaba en una habitación | «Bruno no estaba en el salón.» |
| Media | Junto a un objeto | «Ana estaba junto a una planta.» |
| Difícil | Junto a otra persona | «Carla estaba junto a Bruno.» |
| Difícil | A solas con otra persona | «Diego estaba a solas con Ana.» |
| Difícil | Dirección respecto a otra persona | «Ana estaba más al norte que Diego.» |

La dificultad de un caso depende del tamaño del plano y de la mezcla de pistas. Cada habitación y cada objeto guarda su artículo («la cocina», «un sofá») y cada personaje su género («sentado» o «sentada»), para que el texto de las pistas, que se genera a partir de su estructura, sea correcto.

## Funciones
- Menú de casos ordenados por dificultad, con la marca de resuelto.
- Colocar y quitar personas. Si dos personas comparten fila o columna, se permite y se marca en rojo.
- **Tachar casillas** donde sabes que no irá nadie (con una X, como las notas del sudoku). Las tachadas no admiten personas hasta que se destachan.
- **Comprobar:** aplica las reglas y las pistas a la colocación. Si todo se cumple, revela al asesino.
- **Pista de ayuda:** señala la regla o la pista que no se cumple, sin revelar casillas. Si nada falla pero falta gente, dice «Ninguna pista falla; te falta colocar a alguien».
- Guardar el progreso de cada caso en el navegador (colocación, tachadas y cronómetro).
- Deshacer, reiniciar caso y cronómetro. El cronómetro se pausa con la pestaña oculta y se para al resolver.

## Personajes
Los personajes son amigos de Ingrid, identificados **solo por su apodo**, con su género gramatical. Sin apellidos, fotos ni otros datos que permitan reconocerlos fuera del grupo. El repositorio es público: Ingrid da la lista de apodos y se asegura de que sus amigos están de acuerdo, porque alguno saldrá como asesino o víctima. Los apodos se reutilizan entre casos.

- **Mujeres:** Ingrid, Lola, Paloma, Helen, Lucia, Luza, Naomi, Karol, Zoryana, Anna, Berta.
- **Hombres:** Carles, Calikos.

## Cómo se crean los casos
Los escribe el agente (Claude) como módulos de datos dentro del repositorio: plano, objetos, personas, pistas y solución. Un resolvedor comprueba que cada caso tiene exactamente una solución y que esta coincide con la guardada. Piloto: 9 casos, uno de prueba de 5×5 y dos de cada tamaño de 6×6 a 9×9. Si gustan, se pide al agente: «genera 2 casos nuevos de 7×7». Si un caso no pasa el validador, no entra.

## Fuera de alcance
- Cuentas de usuario, servidor, base de datos, ranking o multijugador.
- IA dentro de la app y generación de casos en el navegador.
- Ventanas, puertas y reglas especiales por escenario (por ahora).
- Copiar casos, textos, personajes o ilustraciones de juegos o libros existentes.
- Planos de más de 9×9.
- App móvil nativa. La web debe poder usarse en el móvil, pero no es prioritaria.
- Publicar la app: es producción y necesita permiso expreso.

## Tecnología
- Ruta A: HTML + CSS + JavaScript (módulos ES), sin framework y sin servidor propio.
- La lógica (reglas, pistas, resolvedor) va en módulos separados de la interfaz.
- Pruebas unitarias con `node --test`, e2e con Playwright en `e2e/` y linter ESLint.

## Datos y claves
- Datos: los casos (archivos en el repositorio) y el progreso del jugador (`localStorage`). Los únicos datos de personas son apodos, como se explica en «Personajes». No hay base de datos.
- Claves: ninguna.

## Cómo se arranca
Desde la carpeta del proyecto: `npm start` (equivale a `python3 -m http.server 8000 --bind 127.0.0.1`) y abrir http://127.0.0.1:8000. Hace falta un servidor local porque los módulos ES no cargan con doble clic. El servidor solo escucha en este ordenador (`--bind 127.0.0.1`) y debe arrancarse **en la carpeta del proyecto**: si no, sirve otra carpeta, y sin `--bind` cualquiera en la misma wifi podría verla.

## Cómo se prueba
- `npm test` (lógica), `npm run test:e2e` (navegador) y `npm run lint`.
- **Caso concreto:** en el caso 1 (5×5, de prueba), al colocar a todos según la solución y pulsar «Comprobar», aparece «¡Resuelto! El asesino es [nombre]». Si se mueve a una persona y se pulsa «Comprobar», aparece «Todavía no», y «Pista» señala al menos una pista o regla que no se cumple.
- **Prueba clave:** para cada caso del repositorio, el resolvedor encuentra exactamente 1 solución, igual a la guardada.
