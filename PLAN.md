# Plan

El agente trabaja una fase cada vez y marca las casillas al cerrarla. Cada fase termina con algo que se ve al abrir la app.

Arranque de la app: `npm start` desde la carpeta del proyecto y abrir http://127.0.0.1:8000. Las reglas del juego y el catálogo de pistas están en `docs/project-info.md`.

## Límites conocidos

- **Tamaño máximo 9×9.** Probar todas las combinaciones no es viable (9!·9! ≈ 130.000 millones), así que el resolvedor usa vuelta atrás: coloca fila a fila y abandona un camino en cuanto una regla o pista falla. Además se para en cuanto encuentra 2 soluciones. Si un 9×9 tarda demasiado, se refuerza la poda antes de añadir casos.
- **Un 9×9 en el móvil** tiene casillas pequeñas. Se revisa en la Fase 6.
- **Solución única no significa caso bien diseñado.** El resolvedor garantiza que la solución es única, no que se pueda deducir sin tantear. La dificultad se controla con el tamaño y la mezcla de pistas.
- **Hasta la Fase 3, el caso 1 no está validado.** Si el resolvedor encuentra más de una solución, se corrige en esa fase.

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

## Fase 2 · Jugar el caso 1

**Objetivo:** poder resolver el caso 1 a mano.

**Tareas:**
- [ ] Comprobador de pistas con tres estados: se cumple / no se cumple / pendiente (falta colocar a alguien).
- [ ] Reglas del tablero: una persona por fila y columna, nadie sobre un objeto bloqueante y la regla del asesino.
- [ ] Elegir una persona y hacer clic en una casilla para colocarla; otro clic la quita.
- [ ] Tachar y destachar casillas con una X. Una casilla tachada no admite personas.
- [ ] Marcar en rojo a las personas que comparten fila o columna.
- [ ] Botón «Comprobar»: aplica reglas y pistas y, si todo se cumple, revela al asesino.

**Pruebas:**
- Unitarias de cada tipo de pista en sus tres estados, incluido «junto a» que no cruza paredes.
- Unitarias de las reglas del tablero, incluida la regla del asesino.
- Unitarias de colocar, quitar y tachar.
- E2E: con la solución aparece «¡Resuelto! El asesino es…»; al mover a una persona, «Todavía no».
- E2E: una casilla tachada no deja colocar a nadie.

**Hecho cuando:** el caso 1 se puede resolver a mano, tachando casillas, y las pruebas pasan.

## Fase 3 · Resolvedor y botón «Pista»

**Objetivo:** garantizar que cada caso tiene solución única y ayudar al jugador cuando se atasca.

**Tareas:**
- [ ] Resolvedor con vuelta atrás (hasta 9×9) que cuenta soluciones y se para en la segunda.
- [ ] Script `node scripts/validate-case.js <id>`: número de soluciones (dos de ellas si hay varias), pistas que sobran y mezcla de dificultad de las pistas.
- [ ] Si el caso 1 no tiene solución única, corregirlo.
- [ ] Botón «Pista»: señala primero una regla incumplida y, si no hay, una pista incumplida. Si nada falla pero falta gente: «Ninguna pista falla; te falta colocar a alguien».

**Pruebas:**
- El resolvedor encuentra 0, 1 y varias soluciones en casos de prueba pequeños.
- Prueba que recorre **todos** los casos del repositorio: exactamente 1 solución, igual a la guardada.
- Rendimiento: un caso de prueba de 9×9 se resuelve en menos de 5 segundos.
- E2E: colocar a alguien mal y pulsar «Pista» resalta la pista que no se cumple.

**Hecho cuando:** el caso 1 pasa el validador, «Pista» funciona en la app y las pruebas pasan.

## Fase 4 · Menú y más casos

**Objetivo:** elegir entre varios casos de distintas dificultades.

**Tareas:**
- [ ] Pantalla de menú con los casos ordenados por dificultad.
- [ ] 8 casos nuevos, dos de cada tamaño (6×6, 7×7, 8×8 y 9×9), con más pistas medias y difíciles cuanto mayor es el plano. Todos validados con el script.
- [ ] Personajes con los apodos de la lista; textos y planos propios.
- [ ] Si no cabe en una sesión, se parte en 6×6–7×7 y 8×8–9×9, con un commit cada parte.

**Pruebas:**
- La prueba de todos los casos (Fase 3) pasa con los nuevos.
- E2E: abrir un caso desde el menú y volver.

**Hecho cuando:** el menú muestra los 9 casos, se entra en uno de cada tamaño y se puede resolver. La parte de crear casos se puede repetir más adelante («genera 2 casos nuevos de 7×7»).

## Fase 5 · Guardar progreso

**Objetivo:** no perder lo hecho al recargar.

**Tareas:**
- [ ] Guardar cada caso en `localStorage` con su `id` y su `version`: colocación y tachadas. El formato es un objeto que admite campos nuevos (por ejemplo, el cronómetro en la Fase 6). Si la versión no coincide, se descarta lo guardado.
- [ ] Marca de «resuelto» en el menú.

**Pruebas:**
- Unitarias de guardar/cargar y de descartar el progreso de una versión antigua.
- E2E: colocar a dos personas y tachar una casilla, recargar y comprobar que todo sigue ahí.
- E2E: resolver un caso y ver la marca en el menú.

**Hecho cuando:** al recargar en mitad de un caso todo sigue igual, y un caso resuelto aparece marcado en el menú.

## Fase 6 · Comodidades de juego

**Objetivo:** jugar a gusto.

**Tareas:**
- [ ] Deshacer (incluye las tachadas) y reiniciar caso.
- [ ] Cronómetro: se guarda con el progreso, se pausa con la pestaña oculta y se para al resolver.
- [ ] Revisar que se puede jugar en el móvil.

**Pruebas:**
- Unitarias de deshacer, reiniciar y cronómetro.
- E2E: tachar una casilla, deshacer y comprobar que desaparece.
- E2E con viewport móvil: en un 9×9, colocar a una persona y comprobarlo.

**Hecho cuando:** las comodidades funcionan, se guardan con el progreso y las pruebas pasan.

## Fuera del plan (requiere permiso expreso)

- Publicar la app (por ejemplo, en GitHub Pages) para que se pueda jugar sin arrancar nada. Es producción: se plantea como fase aparte y solo con tu permiso.
