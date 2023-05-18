import { test, expect } from '@playwright/test';
import dragAndDrop from './drag-and-drop';

test('test page with selection', async ({ page }) => {
  await page.goto('/selection');
  await dragAndDrop(page, page.getByRole('table'), 'Donut', 'Eclair');
  await dragAndDrop(page, page.getByRole('table'), 'Eclair', 'Frozen Yogurt');
  await dragAndDrop(page, page.getByRole('table'), '3%', 'Donut');
  await expect(page.locator('.text-right.sindu_handle:not(th)').first()).toHaveText(/6%.*/);
});
