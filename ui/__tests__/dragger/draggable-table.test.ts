import DraggableTable from '../../src/dragger/draggable-table';

test('test draggable-table notTable', () => {
  const unknownElement = document.createElement('tbody') as any;
  const error = 'table-dragger: el must be TABLE HTMLElement, not [object HTMLTableSectionElement]';
  expect(() => new DraggableTable(unknownElement, {})).toThrow(error);
});

test('test draggable-table no dragHandler', () => {
  const table = document.createElement('table');
  const td = document.createElement('td');
  const tr = document.createElement('tr');
  const tbody = document.createElement('tbody');
  tr.appendChild(td);
  tr.appendChild(td.cloneNode());
  tbody.appendChild(tr);
  tbody.appendChild(tr.cloneNode(true));
  table.appendChild(tbody);
  const error = 'table-dragger: please specify dragHandler in free mode';
  expect(() => new DraggableTable(table, {
    mode: 'free',
  })).toThrow(error);
  const errorText = 'table-dragger: no element match dragHandler selector';
  expect(() => new DraggableTable(table, {
    dragHandler: '.my-class',
  })).toThrow(errorText);
});

test('test draggable-table', () => {
  const table = document.createElement('table');
  const td = document.createElement('td');
  const tr = document.createElement('tr');
  const tbody = document.createElement('tbody');
  tr.appendChild(td);
  tr.appendChild(td.cloneNode());
  tbody.appendChild(tr);
  const cloneTr = tr.cloneNode(true);
  tbody.appendChild(cloneTr);
  table.appendChild(tbody);
  expect(new DraggableTable(table, {
    dragHandler: 'tr',
  })).toHaveProperty('handlers', [tr, cloneTr]);
  expect(new DraggableTable(table, {
    mode: 'row',
  })).toHaveProperty('handlers', [td, td]);
});

test('test draggable-table check Event', () => {
  const table = document.createElement('table');
  const td = document.createElement('td');
  const tr = document.createElement('tr');
  const tbody = document.createElement('tbody');
  tr.appendChild(td);
  tr.appendChild(td.cloneNode());
  tbody.appendChild(tr);
  const cloneTr = tr.cloneNode(true);
  tbody.appendChild(cloneTr);
  table.appendChild(tbody);
  tr.addEventListener = jest.fn().mockImplementationOnce((event, callback) => {
    const evt = new MouseEvent('mousedown', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    const target = document.createElement('div');
    td.appendChild(target);
    callback({
      ...evt,
      target,
      buttons: 1,
    });
  });
  let ignoreFirstMouseUp = 0;
  document.addEventListener = jest.fn().mockImplementation((event, callback) => {
    if (event === 'mouseup' && !ignoreFirstMouseUp) {
      ignoreFirstMouseUp = 1;
      return;
    }
    const evt = new MouseEvent(event, {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    callback({
      ...evt,
      target: document,
      buttons: 1,
    });
  });
  document.removeEventListener = jest.fn();
  tr.removeEventListener = jest.fn();
  const dragger = new DraggableTable(table, {
    mode: 'free',
    dragHandler: 'tr',
  });
  dragger.emitter.destroy();
  expect(tr.addEventListener).toBeCalledWith(
    'mousedown',
    expect.any(Function),
  );
  expect(tr.addEventListener).toBeCalledTimes(1);
  expect(tr.removeEventListener).toBeCalledTimes(1);
  expect(document.addEventListener).toBeCalledWith('mousemove', expect.any(Function));
  expect(document.addEventListener).toBeCalledTimes(3);
  expect(document.removeEventListener).toBeCalledTimes(3);
});

test('test draggable-table check event error mousedown', () => {
  const table = document.createElement('table');
  const td = document.createElement('td');
  const tr = document.createElement('tr');
  const tbody = document.createElement('tbody');
  tr.appendChild(td);
  tr.appendChild(td.cloneNode());
  tbody.appendChild(tr);
  const cloneTr = tr.cloneNode(true);
  tbody.appendChild(cloneTr);
  table.appendChild(tbody);
  let ignoreCallback: () => void;
  let evtCallback: () => void;
  let evtCallback2: () => void;
  let evtCallback3: () => void;
  tr.addEventListener = jest.fn().mockImplementationOnce((event, callback) => {
    const evt = new MouseEvent('mousedown', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    ignoreCallback = () => callback(evt);
    evtCallback = () => callback({
      ...evt,
      target: null,
      buttons: 1,
    });
    evtCallback2 = () => callback({
      ...evt,
      target: document.createElement('div'),
      buttons: 1,
    });
    evtCallback3 = () => callback({
      ...evt,
      target: document.createElement('td'),
      buttons: 1,
    });
  });
  const dragger = new DraggableTable(table, {
    dragHandler: 'tr',
  });
  dragger.emitter.destroy();
  expect(() => ignoreCallback()).not.toThrow(Error);
  expect(() => evtCallback()).toThrow('Logic Error 1');
  expect(() => evtCallback2()).toThrow('Logic Error 2');
  expect(() => evtCallback3()).toThrow('Logic Error 3');
});

test('test draggable-table check Event error mousemove', () => {
  const table = document.createElement('table');
  const td = document.createElement('td');
  const tr = document.createElement('tr');
  const tbody = document.createElement('tbody');
  tr.appendChild(td);
  tr.appendChild(td.cloneNode());
  tbody.appendChild(tr);
  const cloneTr = tr.cloneNode(true);
  tbody.appendChild(cloneTr);
  table.appendChild(tbody);
  tr.addEventListener = jest.fn().mockImplementationOnce((event, callback) => {
    const evt = new MouseEvent('mousedown', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    const target = document.createElement('div');
    td.appendChild(target);
    callback({
      ...evt,
      target,
      buttons: 1,
      clientX: 0,
      clientY: 0,
    });
  });
  let evtCallback: () => void;
  document.addEventListener = jest.fn().mockImplementationOnce((event, callback) => {
    const evt = new MouseEvent(event, {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    evtCallback = () => callback({
      ...evt,
      target: document,
      buttons: 1,
      clientX: 0,
      clientY: 0,
    });
    callback({
      ...evt,
      target: document,
      buttons: 1,
      clientX: 1,
      clientY: 1,
    });
  });
  const dragger = new DraggableTable(table, {
    dragHandler: 'tr',
  });
  dragger.emitter.destroy();
  expect(() => evtCallback()).not.toThrow(Error);
});
