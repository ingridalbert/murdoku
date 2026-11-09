import { test, expect } from '@playwright/test';

test('la página muestra el nombre, el plano 5×5 y las pistas del caso 1', async ({ page }) => {
  const errores = [];
  page.on('pageerror', (e) => errores.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errores.push(m.text()));

  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Murdoku');
  await expect(page.locator('.casilla')).toHaveCount(25);

  const pistas = page.locator('.pistas li');
  await expect(pistas).toHaveCount(5); // 4 de sospechosos + la regla del asesino
  await expect(pistas.first()).toHaveText('Lola estaba sentada en una silla.');

  await expect(page.getByText('Berta 💀 (víctima)')).toBeVisible();
  expect(errores).toEqual([]);
});

test('las paredes separan habitaciones distintas', async ({ page }) => {
  await page.goto('/');
  // (1,1) es cocina; a su derecha (1,2) es salón y debajo (2,1) dormitorio.
  const casilla = page.locator('.casilla[data-fila="1"][data-columna="1"]');
  await expect(casilla).toHaveClass(/pared-derecha/);
  await expect(casilla).toHaveClass(/pared-abajo/);
  await expect(casilla).not.toHaveClass(/pared-izquierda/);
});
