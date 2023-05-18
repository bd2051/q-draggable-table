import { Locator, Page } from 'playwright';

const dragAndDrop = async (
  page: Page,
  testElement: Locator,
  dragCellCaption: string,
  dropCellCaption: string,
) => {
  const target = testElement.getByRole('cell', { name: dropCellCaption });
  const start = testElement.getByRole('cell', { name: dragCellCaption });
  await start.hover();
  const targetBox = await target.boundingBox();
  const x = targetBox.x + targetBox.width / 2;
  const y = targetBox.y + targetBox.height / 2;
  await page.mouse.down();
  await page.waitForTimeout(100);
  await start.hover();
  await page.mouse.move(x, y, {
    steps: 20,
  });
  await page.waitForTimeout(100);
  await page.mouse.up();
  await page.waitForTimeout(300);
};
export default dragAndDrop;
