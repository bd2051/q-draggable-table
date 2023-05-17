import { getScrollBarWidth, isLeftButton } from '../../src/dragger/util';

test('test utils getScrollBarWidth', () => {
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: 10,
  });
  expect(getScrollBarWidth()).toEqual(0);
});

test('test utils getScrollBarWidth', () => {
  const event = new TouchEvent('mousedown');
  expect(isLeftButton(event)).toBeFalsy();
});
