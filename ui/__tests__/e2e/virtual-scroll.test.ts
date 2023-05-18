import { test, expect } from '@playwright/test';
import dragAndDrop from './drag-and-drop';

test('test column with first column fix', async ({ page }) => {
  await page.goto('/virtual-scroll');
  await dragAndDrop(page, page.getByTestId('column-fix'), 'Calories', 'Dessert (100g serving)');
  await dragAndDrop(page, page.getByTestId('column-fix'), 'Calories', '#');
  await expect(page.locator('.q-virtual-scroll__content td:not(:first-child)').first()).toHaveText(/159.*/);
});

test('test column', async ({ page }) => {
  await page.goto('/virtual-scroll');
  await dragAndDrop(page, page.getByTestId('column'), 'Calories', 'Dessert (100g serving)');
  await dragAndDrop(page, page.getByTestId('column'), 'Calories', '#');
  await expect(page.getByTestId('column').locator('.q-virtual-scroll__content td').first()).toHaveText(/159.*/);
});
