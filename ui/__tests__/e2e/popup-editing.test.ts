import { test, expect } from '@playwright/test';
import dragAndDrop from './drag-and-drop';

test('test page with popup', async ({ page }) => {
  await page.goto('/popup-editing');
  await dragAndDrop(page, page.getByRole('table'), '3%', 'Eclair');
  await dragAndDrop(page, page.getByRole('table'), '3%', '14%');
  await expect(page.locator('table td').first()).toHaveText(/3%.*/);
});
