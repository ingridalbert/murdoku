import { test, expect } from '@playwright/test';

// Recoge errores de la página para comprobar que la consola queda limpia.
function vigilarErrores(page) {
  const errores = [];
  page.on('pageerror', (e) => errores.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errores.push(m.text()));
  return errores;
}

test('la página muestra el nombre, el plano 5×5 y el caso 1', async ({ page }) => {
  const errores = vigilarErrores(page);
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Murdoku');
  await expect(page.getByRole('heading', { name: /Cena con sorpresa/ })).toBeVisible();
  await expect(page.locator('.casilla')).toHaveCount(25);
  expect(errores).toEqual([]);
});

test('hay una tarjeta por personaje, con el nombre dentro de un círculo de color', async ({ page }) => {
  await page.goto('/');
  const tarjetas = page.locator('.tarjeta');
  await expect(tarjetas).toHaveCount(5);

  const lola = tarjetas.filter({ hasText: 'Lola' });
  await expect(lola.locator('.circulo')).toHaveText('Lola');
  // El círculo tiene el color de Lola del catálogo, no el fondo por defecto.
  const fondo = await lola.locator('.circulo').evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(fondo).not.toBe('rgba(0, 0, 0, 0)');
});

test('la pista va bajo la tarjeta, sin el nombre y con las palabras clave en negrita', async ({ page }) => {
  await page.goto('/');
  const pista = page.locator('.tarjeta', { hasText: 'Lola' }).locator('.pista');
  await expect(pista).toHaveText('Estaba sentada en una silla.');
  await expect(pista.locator('strong')).toHaveText(['sentada', 'silla']);
});

test('la víctima tiene una tarjeta distinta y la regla del asesino aparece como pista general', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.tarjeta.victima')).toHaveCount(1);
  await expect(page.locator('.tarjeta.victima')).toContainText('Berta');
  await expect(page.locator('.pistas-generales')).toContainText('a solas con');
});

test('los nombres de las 4 habitaciones se ven dentro del plano', async ({ page }) => {
  await page.goto('/');
  const etiquetas = page.locator('.tablero .etiqueta-habitacion');
  await expect(etiquetas).toHaveText(['cocina', 'salón', 'dormitorio', 'jardín'], { ignoreCase: true });
});

test('cada habitación tiene su suelo y cada objeto se dibuja con su SVG', async ({ page }) => {
  await page.goto('/');
  // El caso 1 tiene 7 objetos: todos con dibujo, ninguno con emoji.
  await expect(page.locator('.casilla svg')).toHaveCount(7);
  // (0,0) es la cocina y (4,4) el jardín: suelos distintos.
  const cocina = page.locator('.casilla[data-fila="0"][data-columna="0"]');
  const jardin = page.locator('.casilla[data-fila="4"][data-columna="4"]');
  await expect(cocina).toHaveClass(/suelo-/);
  await expect(jardin).toHaveClass(/suelo-cesped/);
});

test('las paredes separan habitaciones distintas', async ({ page }) => {
  await page.goto('/');
  // (1,1) es cocina; a su derecha (1,2) es salón y debajo (2,1) dormitorio.
  const casilla = page.locator('.casilla[data-fila="1"][data-columna="1"]');
  await expect(casilla).toHaveClass(/pared-derecha/);
  await expect(casilla).toHaveClass(/pared-abajo/);
  await expect(casilla).not.toHaveClass(/pared-izquierda/);
});

test.describe('en el móvil', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('no hay desplazamiento horizontal y el plano cabe en la pantalla', async ({ page }) => {
    const errores = vigilarErrores(page);
    await page.goto('/');
    const anchoPagina = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(anchoPagina).toBeLessThanOrEqual(390);
    const plano = await page.locator('.tablero').boundingBox();
    expect(plano.width).toBeLessThanOrEqual(390);
    expect(errores).toEqual([]);
  });
});
