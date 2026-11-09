# Plan

El agente trabaja una fase cada vez y marca las casillas al cerrarla. Cada fase termina con algo que se ve al abrir la app.

Arranque de la app: `python3 -m http.server 8000` y abrir http://localhost:8000. Las reglas del juego y el catálogo de pistas están en `docs/project-info.md`.

## Límites conocidos

- **Tamaño máximo 6×6.** El resolvedor es por fuerza bruta: 6!·6! ≈ 518.000 combinaciones. Con 8×8 serían ~1.600 millones. No se aceptan planos mayores sin cambiar de resolvedor.
- **Solución única no significa caso bien diseñado.** El resolvedor garantiza que la solución es única, no que se pueda deducir sin tantear. La dificultad se controla con el tamaño y la mezcla de pistas.
- **Hasta la Fase 3, el caso 1 no está validado.** Si el resolvedor encuentra más de una solución, se corrige en esa fase.

## Fase 1 · Preparar el proyecto y ver el caso 1

**Objetivo:** abrir la app y ver el plano del caso 1 con sus pistas, todavía sin poder jugar. Menos de una hora.

**Tareas:**
- [ ] La carpeta es un repositorio git (clon de `ingridalbert/murdoku`).
- [ ] `package.json` con `"type": "module"` y scripts `test` (`node --test`), `test:e2e` (`playwright test`) y `lint` (`eslint .`).
- [ ] Instalar `@playwright/test` (y sus navegadores) y ESLint. Configurar `playwright.config.js` con `webServer` que arranca `python3 -m http.server 8000`.
- [ ] Quitar `GEMINI_API_KEY` de `.env.example`.
- [ ] Formato del caso como módulo JS (`export default {...}`), con `id`, `version`, habitaciones y objetos con su artículo, objetos bloqueantes u ocupables, personas, pistas estructuradas y solución.
- [ ] Generador de texto de las pistas a partir de su estructura (los 8 tipos).
- [ ] Caso 1 (4×4, fácil).
- [ ] `index.html`, estilos y módulo que dibuja el plano: habitaciones en colores, paredes marcadas, objetos y lista de pistas.

**Pruebas:**
- Unitarias: el caso 1 está bien formado (4×4, cada casilla con su habitación, 4 personas, víctima sin pistas) y cada tipo de pista genera el texto esperado.
- E2E: la página muestra «Murdoku», 16 casillas y la lista de pistas.
- `npm run lint` sin avisos.

**Hecho cuando:** al abrir http://localhost:8000 se ven el plano y las pistas del caso 1, y las tres órdenes pasan.

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
- [ ] Resolvedor por fuerza bruta (máximo 6×6) que devuelve todas las soluciones.
- [ ] Script `node scripts/validate-case.js <id>`: número de soluciones (dos de ellas si hay varias), pistas que sobran y mezcla de dificultad de las pistas.
- [ ] Si el caso 1 no tiene solución única, corregirlo.
- [ ] Botón «Pista»: señala primero una regla incumplida y, si no hay, una pista incumplida. Si nada falla pero falta gente: «Ninguna pista falla; te falta colocar a alguien».

**Pruebas:**
- El resolvedor encuentra 0, 1 y varias soluciones en casos de prueba pequeños.
- Prueba que recorre **todos** los casos del repositorio: exactamente 1 solución, igual a la guardada.
- E2E: colocar a alguien mal y pulsar «Pista» resalta la pista que no se cumple.

**Hecho cuando:** el caso 1 pasa el validador, «Pista» funciona en la app y las pruebas pasan.

## Fase 4 · Menú y más casos

**Objetivo:** elegir entre varios casos de distintas dificultades.

**Tareas:**
- [ ] Pantalla de menú con los casos ordenados por dificultad.
- [ ] Unos 6 casos: 2 fáciles (4×4, pistas fáciles), 2 medios (5×5, con pistas medias) y 2 difíciles (6×6, con pistas difíciles), todos validados con el script.
- [ ] Nombres, textos y personajes propios.

**Pruebas:**
- La prueba de todos los casos (Fase 3) pasa con los nuevos.
- E2E: abrir un caso desde el menú y volver.

**Hecho cuando:** desde el menú se entra en un caso de cada dificultad y se puede resolver. La parte de crear casos se puede repetir más adelante («genera 3 casos nuevos de dificultad media»).

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
- E2E con viewport móvil: colocar a una persona y comprobarlo.

**Hecho cuando:** las comodidades funcionan, se guardan con el progreso y las pruebas pasan.

## Fuera del plan (requiere permiso expreso)

- Publicar la app (por ejemplo, en GitHub Pages) para que se pueda jugar sin arrancar nada. Es producción: se plantea como fase aparte y solo con tu permiso.
