import { Locator, Page } from 'playwright';

const dragAndDrop = async (
  page: Page,
  TestElement: Locator,
  dragCellCaption: string,
  dropCellCaption: string,
) => {
  await TestElement
    .getByRole('cell', { name: dragCellCaption })
    .hover();
  await page.mouse.down();
  const target = TestElement
    .getByRole('cell', { name: dropCellCaption });
  const targetBox = await target.boundingBox();
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2);
  await target.hover();
  await page.mouse.up();
};
export default dragAndDrop;
