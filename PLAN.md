# Plan

El agente trabaja una fase cada vez y marca las casillas al cerrarla. Cada fase termina con algo que se ve al abrir la app.

Arranque de la app: `npm start` desde la carpeta del proyecto y abrir http://127.0.0.1:8000. Las reglas del juego y el catálogo de pistas están en `docs/project-info.md`.

## Límites conocidos

- **Tamaño máximo 9×9.** Probar todas las combinaciones no es viable (9!·9! ≈ 130.000 millones), así que el resolvedor usa vuelta atrás: coloca fila a fila y abandona un camino en cuanto una regla o pista falla. Además se para en cuanto encuentra 2 soluciones. Si un 9×9 tarda demasiado, se refuerza la poda antes de añadir casos.
- **Un 9×9 en el móvil** tiene casillas pequeñas. Se revisa en la Fase 7.
- **Solución única no significa caso bien diseñado.** El resolvedor garantiza que la solución es única, no que se pueda deducir sin tantear. La dificultad se controla con el tamaño y la mezcla de pistas.
- **Hasta la Fase 4, el caso 1 no está validado.** Si el resolvedor encuentra más de una solución, se corrige en esa fase.

## Antes de la Fase 1

- [x] La carpeta es un repositorio git conectado a `ingridalbert/murdoku`.
- [x] Ingrid da la lista de apodos (13) con su género. Está en `docs/project-info.md`.
- [x] Los amigos están de acuerdo en salir en un repo público (lo confirma Ingrid).

## Fase 1 · Preparar el proyecto y ver el caso 1

**Objetivo:** abrir la app y ver el plano del caso 1 con sus pistas, todavía sin poder jugar. Menos de una hora.

**Tareas:**
- [x] `package.json` con `"type": "module"` y scripts `test` (`node --test`), `test:e2e` (`playwright test`) y `lint` (`eslint .`).
- [x] Instalar `@playwright/test` (y sus navegadores) y ESLint. Configurar `playwright.config.js` con `webServer` que arranca `python3 -m http.server 8000 --bind 127.0.0.1`.
- [x] Quitar `GEMINI_API_KEY` de `.env.example`.
- [x] Formato del caso como módulo JS (`export default {...}`), con `id`, `version`, habitaciones y objetos con su artículo, objetos bloqueantes u ocupables, personajes (apodo y género), pistas estructuradas y solución.
- [x] Generador de texto de las pistas a partir de su estructura (los 8 tipos).
- [x] Caso 1 (5×5, de prueba), con apodos de la lista que da Ingrid.
- [x] `index.html`, estilos y módulo que dibuja el plano: habitaciones en colores, paredes marcadas, objetos y lista de pistas.

**Pruebas:**
- Unitarias: el caso 1 está bien formado (5×5, cada casilla con su habitación, 5 personas, víctima sin pistas) y cada tipo de pista genera el texto esperado, en masculino y en femenino.
- E2E: la página muestra «Murdoku», 25 casillas y la lista de pistas.
- `npm run lint` sin avisos.

**Hecho cuando:** al abrir http://127.0.0.1:8000 se ven el plano y las pistas del caso 1, y las tres órdenes pasan.

## Fase 2 · Diseño visual

**Objetivo:** que el caso 1 tenga un diseño propio, alegre y colorido, con un acabado al nivel de los juegos de puzles publicados, sin copiar el aspecto de ninguno. Las reglas no cambian.

**Tareas:**
- [x] Corregir el catálogo de pistas de la Fase 1 (ver `docs/project-info.md`): quitar «junto a otra persona», que es imposible; añadir «misma habitación que», «solo/sola» y «en diagonal a»; campo `negada` para cualquier pista (así «no estaba en una habitación» deja de ser un tipo aparte); y las 3 pistas generales (`generales` en el caso). Actualizar `validarCaso`, `textoPista` y el caso 1.
- [x] Catálogo único de personajes (`src/casos/personajes.js`) con nombre, género, iniciales y color; los casos tiran de él.
- [x] Paleta de colores vivos y formas redondeadas, como variables CSS. Tipografías de Google Fonts, con fuentes del sistema como respaldo si no hay internet.
- [x] Logo propio de «Murdoku» hecho con texto y CSS.
- [x] Maquetación: panel a la izquierda (título del caso y tamaño, pistas generales, tarjetas de sospechosos) y plano grande a la derecha. En el móvil, uno debajo del otro.
- [x] Suelo de cada habitación (madera, baldosa, césped, moqueta, piedra) como campo `suelo` del caso, dibujado con texturas CSS.
- [x] Nombre de cada habitación dentro del plano, grande y con contorno.
- [x] Ilustraciones SVG propias de los 7 objetos, vistos desde arriba, en `src/ui/dibujos.js`.
- [x] Tarjeta por personaje: su nombre dentro de un círculo de color y sus pistas debajo (puede tener varias). La víctima tiene una tarjeta distinta.
- [x] Pistas generales arriba del panel, junto a la regla del asesino.
- [x] Campo `iniciales` de cada personaje en el caso (las que eligió Ingrid), que se usarán como notas en la Fase 3.
- [x] Palabras clave de las pistas en negrita (`trozosPista` devuelve trozos marcados y `textoPista` los une).

**Pruebas:**
- Unitarias: texto y negritas de los 9 tipos personales, en afirmativo y en negativo, y de los 3 generales; `validarCaso` rechaza datos imposibles de los tipos nuevos y exige un `suelo` válido, `iniciales` de 1 o 2 letras sin repetir y un `color` #rrggbb; el catálogo tiene a los 13 amigos con sus iniciales.
- E2E: hay 5 tarjetas de personaje con su nombre, los 4 nombres de habitación están dentro del plano y cada objeto se dibuja con su SVG.
- E2E con viewport móvil (390 px): no hay desplazamiento horizontal.

**Hecho cuando:** Ingrid ve el caso 1 con el diseño nuevo en el ordenador y en el móvil, le gusta, y las pruebas pasan.

## Fase 3 · Jugar el caso 1

**Objetivo:** poder resolver el caso 1 a mano.

**Tareas:**
- [ ] Comprobador de pistas con tres estados: se cumple / no se cumple / pendiente (falta colocar a alguien). Incluye las negadas y las generales.
- [ ] Reglas del tablero: una persona por fila y columna, nadie sobre un objeto bloqueante y la regla del asesino.
- [ ] Elegir un personaje pulsando su tarjeta (queda resaltada; pulsarla otra vez la deselecciona).
- [ ] Con un personaje elegido, **pulsar** una casilla pone o quita sus iniciales como nota; caben notas de varios personajes.
- [ ] Con un personaje elegido, **mantener pulsada** una casilla (unos 400 ms, con ratón o dedo) lo coloca ahí; si ya estaba en otra, se mueve. Mantener pulsado donde ya está lo quita.
- [ ] Sin personaje elegido, pulsar una casilla pone o quita una X. Una casilla tachada no admite personas ni notas.
- [ ] En una casilla con objeto bloqueante no se puede hacer nada; en una con persona colocada no se puede tachar ni anotar.
- [ ] Mantener pulsado en el móvil no debe abrir el menú del navegador ni seleccionar texto.
- [ ] Marcar en rojo a las personas que comparten fila o columna.
- [ ] Botón «Comprobar»: aplica reglas y pistas y, si todo se cumple, revela al asesino.

**Pruebas:**
- Unitarias de cada tipo de pista en sus tres estados, en afirmativo y negativo, incluidos «junto a» y «en diagonal a» que no cruzan paredes, y de las 3 generales.
- Unitarias de las reglas del tablero, incluida la regla del asesino.
- Unitarias del estado del tablero: poner y quitar notas, colocar, mover y quitar personajes, tachar y destachar, y que una casilla tachada rechaza personas y notas.
- E2E: elegir a Lola y pulsar una casilla muestra «LB»; mantener pulsado la coloca; pulsar sin nadie elegido tacha.
- E2E: con la solución aparece «¡Resuelto! El asesino es…»; al mover a una persona, «Todavía no».
- E2E: una casilla tachada no deja colocar a nadie.
- E2E con pantalla táctil de móvil: mantener pulsado coloca al personaje y no aparece el menú del navegador.

**Hecho cuando:** el caso 1 se puede resolver a mano, tachando casillas, y las pruebas pasan.

## Fase 4 · Resolvedor y botón «Pista»

**Objetivo:** garantizar que cada caso tiene solución única y ayudar al jugador cuando se atasca.

**Tareas:**
- [ ] Resolvedor con vuelta atrás (hasta 9×9) que tiene en cuenta todas las pistas (personales, negadas y generales) y la regla del asesino; cuenta soluciones y se para en la segunda.
- [ ] Script `node scripts/validate-case.js <id>`: número de soluciones (dos de ellas si hay varias), pistas que sobran y mezcla de dificultad de las pistas.
- [ ] Si el caso 1 no tiene solución única, corregirlo.
- [ ] Botón «Pista»: señala primero una regla incumplida y, si no hay, una pista incumplida (personal o general). Si nada falla pero falta gente: «Ninguna pista falla; te falta colocar a alguien».

**Pruebas:**
- El resolvedor encuentra 0, 1 y varias soluciones en casos de prueba pequeños.
- Prueba que recorre **todos** los casos del repositorio: exactamente 1 solución, igual a la guardada.
- Rendimiento: un caso de prueba de 9×9 se resuelve en menos de 5 segundos.
- E2E: colocar a alguien mal y pulsar «Pista» resalta la pista que no se cumple.

**Hecho cuando:** el caso 1 pasa el validador, «Pista» funciona en la app y las pruebas pasan.

## Fase 5 · Menú y más casos

**Objetivo:** elegir entre varios casos de distintas dificultades.

**Tareas:**
- [ ] Pantalla de menú con los casos ordenados por dificultad.
- [ ] Script de ayuda, solo para desarrollo (`node scripts/proponer-pistas.js`): a partir de un plano y una solución, propone pistas hasta que la solución es única. El agente revisa y pule el resultado.
- [ ] 8 casos nuevos, dos de cada tamaño (6×6, 7×7, 8×8 y 9×9), con más pistas medias y difíciles cuanto mayor es el plano. Todos validados con el script.
- [ ] Personajes con los apodos de la lista; textos y planos propios.
- [ ] Si no cabe en una sesión, se parte en 6×6–7×7 y 8×8–9×9, con un commit cada parte.

**Pruebas:**
- El script de ayuda: las pistas que propone se cumplen con la solución y la dejan única (probado con un 6×6).
- La prueba de todos los casos (Fase 4) pasa con los nuevos.
- E2E: abrir un caso desde el menú y volver.

**Hecho cuando:** el menú muestra los 9 casos, se entra en uno de cada tamaño y se puede resolver. La parte de crear casos se puede repetir más adelante («genera 2 casos nuevos de 7×7»).

## Fase 6 · Guardar progreso

**Objetivo:** no perder lo hecho al recargar.

**Tareas:**
- [ ] Guardar cada caso en `localStorage` con su `id` y su `version`: colocación, notas y tachadas. El formato es un objeto que admite campos nuevos (por ejemplo, el cronómetro en la Fase 7). Si la versión no coincide, se descarta lo guardado.
- [ ] Marca de «resuelto» en el menú.

**Pruebas:**
- Unitarias de guardar/cargar y de descartar el progreso de una versión antigua.
- E2E: colocar a dos personas, poner una nota y tachar una casilla, recargar y comprobar que todo sigue ahí.
- E2E: resolver un caso y ver la marca en el menú.

**Hecho cuando:** al recargar en mitad de un caso todo sigue igual, y un caso resuelto aparece marcado en el menú.

## Fase 7 · Comodidades de juego

**Objetivo:** jugar a gusto.

**Tareas:**
- [ ] Deshacer (incluye notas y tachadas) y reiniciar caso.
- [ ] Cronómetro: se guarda con el progreso, se pausa con la pestaña oculta y se para al resolver.
- [ ] Revisar que se puede jugar en el móvil.

**Pruebas:**
- Unitarias de deshacer, reiniciar y cronómetro.
- E2E: tachar una casilla, deshacer y comprobar que desaparece.
- E2E con viewport móvil: en un 9×9, colocar a una persona y comprobarlo.

**Hecho cuando:** las comodidades funcionan, se guardan con el progreso y las pruebas pasan.

## Fuera del plan (requiere permiso expreso)

- Publicar la app (por ejemplo, en GitHub Pages) para que se pueda jugar sin arrancar nada. Es producción: se plantea como fase aparte y solo con tu permiso.
