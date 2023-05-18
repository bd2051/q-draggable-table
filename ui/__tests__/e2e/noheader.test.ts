import { test, expect } from '@playwright/test';
import dragAndDrop from './drag-and-drop';

test('test no header', async ({ page }) => {
  await page.goto('/no-header');
  await dragAndDrop(page, page.getByRole('table'), '3%', 'Eclair');
  await dragAndDrop(page, page.getByRole('table'), '3%', '14%');
  await expect(page.locator('table td').first()).toHaveText(/3%.*/);
});
