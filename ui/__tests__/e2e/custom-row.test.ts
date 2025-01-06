import { test, expect } from '@playwright/test';
import dragAndDrop from './drag-and-drop';

test('test custom row', async ({ page }) => {
  await page.goto('/custom-row');
  await dragAndDrop(page, page.getByRole('table'), 'Eclair', 'Frozen Yogurt');
  await expect(page.locator('table td').first()).toHaveText(/Frozen Yogurt.*/);
  await dragAndDrop(page, page.getByRole('table'), 'Gingerbread', 'Eclair');
  await expect(page.locator('table tr:last-child td').first()).toHaveText(/Cupcake.*/);
});
