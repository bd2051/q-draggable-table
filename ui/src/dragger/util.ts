import classes from './classes';

type EventType = 'mouseup' | 'mousedown' | 'mousemove'

export const getTouchyEvent = () => new MouseEvent('mousedown', {
  view: window,
  bubbles: true,
  cancelable: true,
});

export const touchy = (el: GlobalEventHandlers, op: 'add' | 'remove', type: EventType, fn: (evt: MouseEvent) => void) => {
  if (op === 'add') {
    el.addEventListener(type, fn);
  } else {
    el.removeEventListener(type, fn);
  }
};

export const getLongestRow = (table: HTMLTableElement) => {
  let result = table.rows[0];
  Array.from(table.rows).forEach((row) => {
    const rowL = row.children.length;
    const resultL = result.children.length;
    result = rowL > resultL ? row : result;
  });
  return result;
};

export const css = (el: HTMLElement, styles: Record<string, string | number>) => {
  Object.keys(styles).forEach((k) => {
    el.style.setProperty(k, styles[k].toString());
  });
  return el;
};

export const empty = (node: HTMLElement) => {
  while (node.firstElementChild) {
    node.removeChild(node.firstElementChild);
  }
};

export const insertBeforeSibling = ({ target, origin }: Record<'target' | 'origin', HTMLElement>) => {
  if (!target || !origin.parentElement) {
    return;
  }
  origin.parentElement.insertBefore(target, origin);
};

export const getScrollBarWidth = () => {
  if (document.documentElement.scrollHeight <= document.documentElement.clientHeight) {
    return 0;
  }
  const inner = document.createElement('p');
  inner.style.width = '100%';
  inner.style.height = '200px';

  const outer = document.createElement('div');
  outer.style.position = 'absolute';
  outer.style.top = '0px';
  outer.style.left = '0px';
  outer.style.visibility = 'hidden';
  outer.style.width = '200px';
  outer.style.height = '150px';
  outer.style.overflow = 'hidden';
  outer.appendChild(inner);

  document.body.appendChild(outer);
  const w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  let w2 = inner.offsetWidth;
  if (w1 === w2) w2 = outer.clientWidth;

  document.body.removeChild(outer);

  return (w1 - w2);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkIsTable = (ele: any) => ele
    && typeof ele === 'object'
    && 'nodeType' in ele
    && ele.nodeType === 1
    && ele.cloneNode
    && ele.nodeName === 'TABLE';

export const isLeftButton = (e: TouchEvent | MouseEvent): boolean => {
  if ('touches' in e) {
    return e.touches.length === 1;
  }
  return e.buttons === 1;
};

function origin2DragItem(table: HTMLTableElement) {
  const liTable = table.cloneNode(true) as HTMLTableElement;
  css(liTable, {
    'table-layout': 'fixed', width: 'initial', height: 'initial', padding: 0, margin: 0,
  });
  ['width', 'height', 'id'].forEach((p) => {
    liTable.removeAttribute(p);
  });
  liTable.classList.remove(classes.originTable);
  Array.from(liTable.querySelectorAll('col')).forEach((col) => {
    col.removeAttribute('width');
    css(col, { width: 'initial' });
  });
  return liTable;
}

export function getColumnAsTable(table: HTMLTableElement, index: number) {
  const cTable = origin2DragItem(table);
  const cols = cTable.querySelectorAll('col');
  if (cols.length) {
    Array.from(cols).forEach((col, dex) => {
      if (dex !== index) {
        const parent = col.parentElement;
        if (parent === null) {
          throw new Error('Logic Error');
        }
        parent.removeChild(col);
      }
    });
  }
  Array.from(cTable.rows).forEach((row) => {
    const target = row.children[index];
    empty(row);
    if (target) {
      row.appendChild(target);
    }
  });
  return cTable;
}

export function getRowAsTable(table:HTMLTableElement, row: HTMLTableRowElement) {
  const cTable = origin2DragItem(table);
  Array.from(cTable.children).forEach((child) => {
    const { nodeName } = child;
    if (nodeName !== 'COL' && nodeName !== 'COLGROUP') {
      cTable.removeChild(child);
    }
  });
  const parent = row.parentElement;
  if (parent === null) {
    throw new Error('Logic Error');
  }
  const parentClone = parent.cloneNode() as HTMLElement;
  parentClone.innerHTML = '';
  parentClone.appendChild(row.cloneNode(true));
  cTable.appendChild(parentClone);
  return cTable;
}
