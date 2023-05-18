import 'dragula-with-animation';
import FakeTable from '@/dragger/fake-table';
import DraggableTable from '@/dragger/draggable-table';

interface DragulaMock {
  on: (type: string, fn: (o?: unknown) => void) => DragulaMock
  destroy: () => void
}

const dragulaMock: DragulaMock = {
  on: jest.fn().mockImplementation((type, fn) => {
    fn();
    return dragulaMock;
  }),
  destroy: jest.fn(),
};

jest.mock('dragula-with-animation', () => () => dragulaMock);

test('test fake-table destroy', () => {
  const td = document.createElement('td');
  const table = document.createElement('table');
  const tr = document.createElement('tr');
  const tbody = document.createElement('tbody');
  const col = document.createElement('col');
  tbody.appendChild(col);
  tr.appendChild(td);
  tr.appendChild(td.cloneNode());
  tbody.appendChild(tr);
  const cloneTr = tr.cloneNode(true);
  tbody.appendChild(cloneTr);
  table.appendChild(tbody);
  document.body.appendChild(table);
  const originTable = new DraggableTable(table, {
    mode: 'free',
    dragHandler: 'td',
    fixFirstColumn: true,
  });
  window.setTimeout = jest.fn().mockImplementationOnce((fn, timer, ...args) => {
    fn();
  }) as unknown as typeof setTimeout;
  const dragCallback = jest.fn();
  originTable.emitter.on('drag', () => {
    dragCallback();
  });
  const fakeTable = new FakeTable({
    originTable,
    mode: 'column',
  });
  const fakeTable2 = new FakeTable({
    originTable,
    mode: 'row',
  });
  expect(dragCallback).toBeCalledTimes(2);
  expect(() => fakeTable.destroy()).not.toThrow(Error);
  expect(() => fakeTable2.destroy()).not.toThrow(Error);
  expect(window.setTimeout).toBeCalledTimes(4);
});
