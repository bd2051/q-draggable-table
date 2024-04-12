import FakeTable, { RealMode } from './fake-table';
import classes from './classes';
import { checkIsTable, isLeftButton, touchy } from './util';

export interface DragOptions {
  mode: RealMode | 'free' | 'none',
  dragHandler: string,
  onlyBody: boolean,
  fixFirstColumn: boolean
}

interface Coord {
  x: number,
  y: number
}

interface EmitterInit {
  dragging: boolean,
  destroy: () => void,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventParams = Array<any>

export interface Emitter extends EmitterInit{
  on: (type: string, fn: (...arg: EventParams) => void) => Emitter,
  emit: (type: string, ...arg: EventParams) => void
}

interface EmitterEvent {
  [key: string]: Array<(...arg: EventParams) => void>
}

export default class DraggableTable {
  options: DragOptions;

  handlers: Array<HTMLElement>;

  tappedCoord: Coord;

  cellIndex: Coord;

  el: HTMLTableElement;

  emitter: Emitter;

  constructor(table: HTMLTableElement, userOptions: Partial<DragOptions>) {
    this.options = {
      mode: 'column',
      dragHandler: '',
      onlyBody: true,
      fixFirstColumn: false,
      ...userOptions,
    };
    this.tappedCoord = { x: 0, y: 0 };
    this.cellIndex = { x: 0, y: 0 };
    this.el = table;
    if (!checkIsTable(table)) {
      throw new Error(`table-dragger: el must be TABLE HTMLElement, not ${{}.toString.call(table)}`);
    }
    const { options } = this;
    const { mode } = options;
    if (mode === 'free' && !options.dragHandler) {
      throw new Error('table-dragger: please specify dragHandler in free mode');
    }

    this._startBecauseMouseMoved = this._startBecauseMouseMoved.bind(this);
    this._onTap = this._onTap.bind(this);
    this._mouseUpHandler = this._mouseUpHandler.bind(this);

    this._emitter({
      dragging: false,
      destroy: this._destroy.bind(this),
    });

    let handlers;
    if (options.dragHandler) {
      handlers = table.querySelectorAll(options.dragHandler);
      if (handlers && !handlers.length) {
        throw new Error('table-dragger: no element match dragHandler selector');
      }
    } else if (mode === 'column') {
      handlers = table.rows[0] ? table.rows[0].children : [];
    } else {
      handlers = Array.from(table.rows).map((row) => row.children[0]);
    }
    this.handlers = Array.from(handlers) as unknown as Array<HTMLElement>;
    this.handlers.forEach((h) => {
      h.classList.add(classes.handle);
    });

    table.classList.add(classes.originTable);
    this._bindEvents();
  }

  _bindEvents() {
    this.handlers.forEach((handler) => {
      touchy(handler, 'add', 'mousedown', this._onTap);
    });
  }

  _onTap(event: MouseEvent | TouchEvent) {
    if (!isLeftButton(event) || event.metaKey || event.ctrlKey) {
      return;
    }
    const eventTarget = event.target;
    if (eventTarget === null || !(eventTarget instanceof HTMLElement)) {
      throw new Error('Logic Error 1');
    }
    function getCellElement(element: HTMLElement): HTMLTableCellElement {
      if (!(element instanceof HTMLTableCellElement)) {
        const parent = element.parentElement;
        if (parent === null) {
          throw new Error('Logic Error 2');
        }
        return getCellElement(parent);
      }
      return element;
    }
    const target = getCellElement(eventTarget);
    const parent = target.parentElement;
    if (!(parent instanceof HTMLTableRowElement)) {
      throw new Error('Logic Error 3');
    }
    this.cellIndex = { x: target.cellIndex, y: parent.rowIndex };
    if (!(event instanceof MouseEvent)) {
      this.tappedCoord = {
        x: ((event.touches || [])[0] || {}).clientX,
        y: ((event.touches || [])[0] || {}).clientY,
      };
    } else {
      this.tappedCoord = { x: event.clientX, y: event.clientY };
    }

    touchy(document, 'add', 'mousemove', this._startBecauseMouseMoved);
    touchy(document, 'add', 'mouseup', this._mouseUpHandler);
  }

  _mouseUpHandler() {
    touchy(document, 'remove', 'mousemove', this._startBecauseMouseMoved);
    touchy(document, 'remove', 'mouseup', this._mouseUpHandler);
  }

  _startBecauseMouseMoved(event: MouseEvent | TouchEvent) {
    const { tappedCoord, options: { mode } } = this;
    const clientX = !(event instanceof MouseEvent)
      ? ((event.touches || [])[0] || {}).clientX : event.clientX;
    const clientY = !(event instanceof MouseEvent)
      ? ((event.touches || [])[0] || {}).clientY : event.clientY;
    const gapX = Math.abs(clientX - tappedCoord.x);
    const gapY = Math.abs(clientY - tappedCoord.y);
    let realMode: RealMode;
    if (gapX === 0 && gapY === 0) {
      return;
    }

    if (mode === 'none') {
      throw new Error('Logic error');
    }

    if (mode === 'free') {
      realMode = gapX < gapY ? 'row' : 'column';
    } else {
      realMode = mode;
    }

    const sortTable = new FakeTable({
      mode: realMode,
      originTable: this,
    });
    touchy(document, 'remove', 'mousemove', this._startBecauseMouseMoved);
    touchy(document, 'add', 'mouseup', sortTable.destroy);
  }

  _destroy() {
    this.handlers.forEach((handler) => {
      touchy(handler, 'remove', 'mousedown', this._onTap);
    });
    this.el.classList.remove(classes.originTable);
  }

  _emitter(thing: EmitterInit) {
    const evt = {} as EmitterEvent;
    this.emitter = {
      ...thing,
      on: (type, fn) => {
        evt[type] = evt[type] || [];
        evt[type].push(fn);
        return this.emitter;
      },
      emit: (type, ...args) => {
        if (!evt[type]) {
          return;
        }
        evt[type].forEach((fn) => {
          fn(...args);
        });
      },
    };
  }

  static create(el: HTMLTableElement, options: Partial<DragOptions>) {
    const d = new DraggableTable(el, options);
    return d.emitter;
  }
}
