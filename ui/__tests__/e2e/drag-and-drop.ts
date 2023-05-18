import { Locator, Page } from 'playwright';

const dragAndDrop = async (
  page: Page,
  testElement: Locator,
  dragCellCaption: string,
  dropCellCaption: string,
) => {
  const target = testElement.getByRole('cell', { name: dropCellCaption });
  await target.hover();
  await testElement
    .getByRole('cell', { name: dragCellCaption })
    .hover();
  const targetBox = await target.boundingBox();
  const x = targetBox.x + targetBox.width / 2;
  const y = targetBox.y + targetBox.height / 2;
  await page.mouse.down();
  await page.mouse.move(x, y, {
    steps: 20,
  });
  await page.mouse.up();
};
export default dragAndDrop;
