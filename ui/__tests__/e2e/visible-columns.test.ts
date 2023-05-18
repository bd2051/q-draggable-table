import { test, expect } from '@playwright/test';
import dragAndDrop from './drag-and-drop';

test('test page with visible-columns', async ({ page }) => {
  await page.goto('/visible-columns');
  await page.locator('div[aria-label="Fat"]').click();
  await dragAndDrop(page, page.getByRole('table'), 'Calories', 'Dessert (100g serving)');
  await page.locator('div[aria-label="Fat"]').click();
  await expect(page.locator('.text-right.sindu_handle:not(th)').first()).toHaveText(/24.*/);
  await expect(page.locator('table th').first()).toHaveText(/Calories.*/);
});
