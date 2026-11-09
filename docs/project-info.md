# Información del proyecto: Murdoku

## Qué es
Un juego de lógica en el navegador que mezcla sudoku y misterio. Hay un plano en cuadrícula dividido en habitaciones y una lista de pistas. El jugador coloca a los sospechosos y a la víctima para descubrir quién es el asesino. Los casos, los textos y el diseño son propios.

## Para quién
Ingrid y su grupo de amigos, que aparecen como personajes, y en general gente a la que le gustan los puzles lógicos (sudoku, juegos de detectives) y quiere resolver un caso de 5 a 40 minutos sin registrarse.

## Reglas del juego
- El plano tiene N×N casillas, de 5×5 a 9×9, repartidas en habitaciones. Cuanto más grande, más difícil.
- Hay dos tipos de objetos:
  - **Bloqueantes** (mesa, planta, estantería, sofá): nadie puede ocupar esa casilla.
  - **Ocupables** (silla, alfombra, cama): se puede estar encima.
- Hay N personas: la víctima y N−1 sospechosos, una por fila y una por columna. Por eso **dos personas nunca están en casillas en cruz** (compartirían fila o columna).
- Cada sospechoso tiene una o varias pistas. **La víctima no tiene pistas propias.**
- **Regla del asesino:** la víctima está a solas con su asesino. En la habitación de la víctima hay exactamente un sospechoso, y ese es el asesino. Es una regla más, que el jugador puede usar para deducir.
- **«Junto a»** (solo con objetos): las 4 casillas en cruz y **dentro de la misma habitación**. A través de una pared no cuenta.
- **«En diagonal a»** (entre personas): una de las 4 casillas en diagonal y **dentro de la misma habitación**.
- **Norte** es arriba. «Más al norte que X» significa en una fila superior a la de X; «más al este», en una columna más a la derecha.
- Cada caso tiene una única solución.

## Pistas (primera versión)
**Pistas de un sospechoso** (van en su tarjeta). Cualquiera puede ir **en negativo**: «**No** estaba junto a una mesa».

| Dificultad | Tipo | Ejemplo |
|---|---|---|
| Fácil | En una habitación | «Carles estaba en la cocina.» |
| Fácil | En una fila o columna | «Lola estaba en la última columna.» |
| Fácil | Sobre un objeto ocupable | «Paloma estaba sentada en una silla.» |
| Media | Junto a un objeto | «Helen estaba junto a una planta.» |
| Media | Solo / sola (nadie más en su habitación) | «Naomi estaba sola.» |
| Media | En la misma habitación que otra persona | «Lola estaba en la misma habitación que Carles.» |
| Difícil | A solas con otra persona | «Karol estaba a solas con Anna.» |
| Difícil | En diagonal a otra persona | «Helen estaba en diagonal a Paloma.» |
| Difícil | Dirección respecto a otra persona | «Anna estaba más al norte que Calikos.» |
| — | Cualquiera de las anteriores en negativo | «Lucia no estaba sentada en una silla.» |

**Pistas generales** (sobre todo el caso; van arriba, junto a la regla del asesino):

| Tipo | Ejemplo |
|---|---|
| Personas en una habitación | «Había exactamente dos personas en la cocina.» · «No había nadie en el baño.» |
| Personas sobre un tipo de objeto | «Había exactamente una persona tumbada en una cama.» |
| Habitaciones vacías | «No había ninguna habitación vacía.» · «Había exactamente una habitación vacía.» |

La dificultad de un caso depende del tamaño del plano y de la mezcla de pistas. Cada habitación y cada objeto guarda su artículo («la cocina», «un sofá») y cada personaje su género («sentado» o «sentada», «solo» o «sola»), para que el texto, que se genera a partir de la estructura de la pista, sea correcto.

## Funciones
- Menú de casos ordenados por dificultad, con la marca de resuelto.
- **Jugar como en los murdokus online:** se elige un personaje en su tarjeta y luego:
  - **pulsar** una casilla pone o quita sus iniciales como **nota** (en una casilla caben notas de varios personajes, como en el sudoku);
  - **mantener pulsada** una casilla **coloca** ahí al personaje (si ya estaba en otra, se mueve), y mantener pulsado donde ya está lo quita.
- Si dos personas comparten fila o columna, se permite y se marca en rojo.
- **Tachar casillas** donde sabes que no irá nadie: sin ningún personaje elegido, pulsar una casilla pone o quita una X. Las tachadas no admiten personas ni notas hasta que se destachan.
- En una casilla con un objeto bloqueante no se puede hacer nada. En una casilla con una persona colocada no se puede tachar ni anotar.
- **Comprobar:** aplica las reglas y las pistas a la colocación. Si todo se cumple, revela al asesino.
- **Pista de ayuda:** señala la regla o la pista que no se cumple, sin revelar casillas. Si nada falla pero falta gente, dice «Ninguna pista falla; te falta colocar a alguien».
- Guardar el progreso de cada caso en el navegador (colocación, notas, tachadas y cronómetro).
- Deshacer, reiniciar caso y cronómetro. El cronómetro se pausa con la pestaña oculta y se para al resolver.

## Personajes
Los personajes son amigos de Ingrid, identificados **solo por su nombre de pila o apodo**, con su género gramatical. Sin apellidos, fotos ni otros datos que permitan reconocerlos fuera del grupo. El repositorio es público: Ingrid da la lista y se asegura de que sus amigos están de acuerdo, porque alguno saldrá como asesino o víctima. Los nombres se reutilizan entre casos. Viven en un único catálogo (`src/casos/personajes.js`) del que tiran todos los casos.

Cada personaje tiene unas iniciales fijas, elegidas por Ingrid, que se usan como notas en el plano:

- **Mujeres (19):** Ingrid (IA), Lola (LB), Paloma (PS), Helen (HF), Lucia (LS), Luza (LZ), Naomi (NB), Karol (CN), Zoryana (ZK), Anna (AA), Berta (BM), Andrea (AF), Miriam (MQ), Silvia (SB), Celia M. (CM), Celia J. (CJ), Ónis (OM), Paula (PC), Alba (AC).
- **Hombres (8):** Carles (CM), Calikos (CU), Edgar (EC), Sanahuja (DS), Manuel (MV), Oscar (OT), Tendero (CT), Cabedo (PC).

**Norma:** en un mismo caso no puede haber dos personajes con el mismo nombre ni con las mismas iniciales. Por eso nunca coinciden Carles y Celia M. (CM), Paula y Cabedo (PC) ni las dos Celias. El catálogo y `validarCaso` lo comprueban.

## Estilo visual
Propio, alegre y colorido: colores vivos, formas redondeadas, suelos con textura por habitación e ilustraciones SVG de los objetos dibujadas para este proyecto. Cada personaje se representa con su nombre dentro de un círculo de color, sin fotos ni retratos. No se copia el aspecto, el logo ni las ilustraciones de ningún juego existente.

## Cómo se crean los casos
Los escribe el agente (Claude) como módulos de datos dentro del repositorio: plano, objetos, personas, pistas y solución. Un resolvedor comprueba que cada caso tiene exactamente una solución y que esta coincide con la guardada. Piloto: 9 casos, uno de prueba de 5×5 y dos de cada tamaño de 6×6 a 9×9. Si gustan, se pide al agente: «genera 2 casos nuevos de 7×7». Si un caso no pasa el validador, no entra. Para los casos grandes hay un script de ayuda, solo de desarrollo: a partir de un plano y una solución propone pistas hasta que la solución es única, y el agente revisa y pule el resultado.

## Fuera de alcance
- Cuentas de usuario, servidor, base de datos, ranking o multijugador.
- IA dentro de la app y generación de casos en el navegador (el script de ayuda solo se usa al desarrollar).
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
- Datos: los casos (archivos en el repositorio) y el progreso del jugador (`localStorage`). Los únicos datos de personas son nombres de pila o apodos, como se explica en «Personajes». No hay base de datos.
- Claves: ninguna.

## Cómo se arranca
Desde la carpeta del proyecto: `npm start` (equivale a `python3 -m http.server 8000 --bind 127.0.0.1`) y abrir http://127.0.0.1:8000. Hace falta un servidor local porque los módulos ES no cargan con doble clic. El servidor solo escucha en este ordenador (`--bind 127.0.0.1`) y debe arrancarse **en la carpeta del proyecto**: si no, sirve otra carpeta, y sin `--bind` cualquiera en la misma wifi podría verla.

## Cómo se prueba
- `npm test` (lógica), `npm run test:e2e` (navegador) y `npm run lint`.
- **Caso concreto:** en el caso 1 (5×5, de prueba), al colocar a todos según la solución y pulsar «Comprobar», aparece «¡Resuelto! El asesino es [nombre]». Si se mueve a una persona y se pulsa «Comprobar», aparece «Todavía no», y «Pista» señala al menos una pista o regla que no se cumple.
- **Prueba clave:** para cada caso del repositorio, el resolvedor encuentra exactamente 1 solución, igual a la guardada.
