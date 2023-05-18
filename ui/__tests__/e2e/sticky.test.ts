import { test, expect } from '@playwright/test';
import dragAndDrop from './drag-and-drop';

test('test column', async ({ page }) => {
  await page.goto('/sticky');
  await dragAndDrop(page, page.getByTestId('column'), 'Calories', 'Dessert (100g serving)');
  await expect(page.locator('table th').first()).toHaveText(/Calories.*/);
});

test('test row', async ({ page }) => {
  await page.goto('/sticky');
  await dragAndDrop(page, page.getByTestId('row'), 'Eclair', 'Frozen Yogurt');
  await expect(page.locator('table td').first()).toHaveText(/Eclair.*/);
});

test('test free', async ({ page }) => {
  await page.goto('/sticky');
  await dragAndDrop(page, page.getByTestId('free'), 'Calories', 'Dessert (100g serving)');
  await dragAndDrop(page, page.getByTestId('free'), 'Eclair', 'Frozen Yogurt');
  await expect(page.locator('table td').first()).toHaveText(/Eclair.*/);
});

