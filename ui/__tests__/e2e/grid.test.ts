import { test, expect } from '@playwright/test';
import dragAndDrop from './drag-and-drop';

test('test column', async ({ page }) => {
  await page.goto('/grid');
  await dragAndDrop(page, page.getByTestId('column-none'), 'Calories', 'Dessert (100g serving)');
  await page.getByTestId('toggle').click();
  await dragAndDrop(page, page.getByTestId('none-column'), 'Dessert (100g serving)', 'Calories');
  await expect(page.locator('table th').first()).toHaveText(/Calories.*/);
});
