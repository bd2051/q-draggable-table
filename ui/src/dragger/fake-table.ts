import dragula from 'dragula-with-animation';
import classes from './classes';
import {
  insertBeforeSibling,
  getScrollBarWidth,
  css,
  getLongestRow,
  touchy,
  getTouchyEvent,
  getColumnAsTable,
  getRowAsTable,
} from './util';
import type DraggableTable from './draggable-table';
import { DragOptions, Emitter } from './draggable-table';

export type RealMode = 'row' | 'column'

interface FakeTableParams {
  originTable: DraggableTable,
  mode: RealMode
}

export default class FakeTable {
  bodyPaddingRight: number;

  bodyOverflow: string;

  fakeTableElements: HTMLTableElement[];

  options: DragOptions;

  mode: RealMode;

  originTable: DraggableTable;

  emitter: Emitter;

  index: number;

  el: HTMLUListElement;

  dragula: Dragula;

  constructor({ originTable, mode }: FakeTableParams) {
    const {
      emitter, cellIndex, el: originEl, options,
    } = originTable;
    this._buildTables(originEl, mode);
    this.bodyPaddingRight = parseInt(document.body.style.paddingRight, 10) || 0;
    this.bodyOverflow = document.body.style.overflow;
    this.options = options;
    this.mode = mode;
    this.originTable = originTable;
    this.emitter = emitter;
    this.index = mode === 'column' ? cellIndex.x : cellIndex.y;
    this.el = this.fakeTableElements.reduce((previous, current) => {
      const li = document.createElement('li');
      li.appendChild(current);
      return previous.appendChild(li) && previous;
    }, document.createElement('ul'));
    this.dragula = dragula([this.el], {
      staticClass: classes.static,
      direction: mode === 'column' ? 'horizontal' : 'vertical',
    })
      .on('drag', this._onDrag.bind(this))
      .on('dragend', this._onDragend.bind(this))
      .on('shadow', this._onShadow.bind(this))
      .on('out', this._onOut.bind(this));
    this.destroy = this.destroy.bind(this);
    this._renderEl();
    this._dispatchMousedown();
  }

  destroy() {
    touchy(document, 'remove', 'mouseup', this.destroy);
    const parent = this.el.parentElement;
    if (parent !== null) {
      parent.classList.remove(classes.dragging);
      parent.removeChild(this.el);
    }
    setTimeout(() => {
      this.dragula.destroy();
    }, 0);
  }

  _buildTables(table: HTMLTableElement, mode: RealMode) {
    if (mode === 'column') {
      this._buildColumnTables(table);
    } else {
      this._buildRowTables(table);
    }
  }

  _buildColumnTables(table: HTMLTableElement) {
    this.fakeTableElements = Array.from(getLongestRow(table).children)
      .map((cell, index) => getColumnAsTable(table, index));
  }

  _buildRowTables(table: HTMLTableElement) {
    this.fakeTableElements = Array.from(table.rows)
      .map((row) => getRowAsTable(table, row));
  }

  _onDrag() {
    const barWidth = getScrollBarWidth();
    this.emitter.dragging = true;
    css(document.body, { overflow: 'hidden' });
    if (barWidth) {
      css(document.body, { 'padding-right': `${barWidth + this.bodyPaddingRight}px` });
    }
    touchy(document, 'remove', 'mouseup', this.destroy);
    this.emitter.emit('drag', this.originTable.el, this.options.mode);
  }

  _onDragend(droppedItem: HTMLElement) {
    const {
      originTable: { el: originEl }, emitter, index, mode, el,
    } = this;
    css(document.body, { overflow: this.bodyOverflow, 'padding-right': `${this.bodyPaddingRight}px` });
    this.emitter.dragging = false;
    const from = index;
    const to = Array.from(el.children).indexOf(droppedItem);
    this.destroy();
    emitter.emit('drop', from, to, originEl, mode);
  }

  _onShadow(draggingItem: HTMLElement) {
    const {
      originTable: { el: originEl }, emitter, index, el, mode,
    } = this;
    const from = index;
    const to = Array.from(el.children).indexOf(draggingItem);
    emitter.emit('shadowMove', from, to, originEl, mode);
  }

  _onOut() {
    this.emitter.dragging = false;
    this.emitter.emit('out', this.originTable.el, this.mode);
  }

  _dispatchMousedown() {
    this.el.children[this.index].dispatchEvent(getTouchyEvent());
  }

  _renderEl() {
    const { el } = this;
    const originEl = this.originTable.el;
    this._sizeFakes();
    css(el, {
      position: 'absolute',
      top: '0',
      left: `${originEl.offsetLeft}px`,
    });
    insertBeforeSibling({ target: el, origin: originEl });

    const borderSpacing = window.getComputedStyle(originEl).getPropertyValue('border-spacing').split(' ')[0];
    const attr: 'margin-right' | 'margin-bottom' = this.mode === 'column' ? 'margin-right' : 'margin-bottom';
    const fakeTableLastIndex = el.children.length - 1;
    (Array.from(el.children) as Array<HTMLLIElement>).forEach((li, index) => {
      const table = li.querySelector('table');
      if (table === null) {
        throw new Error('Logic Error');
      }
      if ((this.options.onlyBody && this.mode === 'row' && !Array.from(table.children).some((o) => o.nodeName === 'TBODY'))
         || (this.options.fixFirstColumn && this.mode === 'column' && index === 0)) {
        li.classList.add(classes.static);
      }

      if (borderSpacing && index < fakeTableLastIndex) {
        li.style.setProperty(attr, `-${borderSpacing}`);
      }
    });

    const parent = el.parentElement;
    if (parent !== null) {
      parent.classList.add(classes.dragging);
    }
    el.classList.add(classes.draggableTable);
    el.classList.add(`sindu_${this.mode}`);
  }

  _sizeFakes() {
    return this.mode === 'column' ? this._sizeColumnFake() : this._sizeRowFake();
  }

  _sizeColumnFake() {
    const { fakeTableElements } = this;
    const originEl = this.originTable.el;
    Array.from(getLongestRow(originEl).children)
      .forEach((cell, index) => {
        const { width } = cell.getBoundingClientRect();
        css(fakeTableElements[index], { width: `${width}px` });
        css(fakeTableElements[index].rows[0].children[0] as HTMLElement, { width: `${width}px` });
      });
    fakeTableElements.forEach((element) => {
      Array.from(element.rows).forEach((row, index) => {
        const { height } = Array.from(originEl.rows)[index].children[0].getBoundingClientRect();
        css(row, { height: `${height}px` });
      });
    });
  }

  _sizeRowFake() {
    const { fakeTableElements } = this;
    const originEl = this.originTable.el;
    const cells = getLongestRow(originEl).children;
    const { width } = originEl.getBoundingClientRect();
    fakeTableElements.forEach((element) => {
      css(element, { width: `${width}px` });
      (Array.from(element.rows[0].children) as HTMLElement[]).forEach((cell, index) => {
        css(cell, { width: `${cells[index].getBoundingClientRect().width}px` });
      });
    });
  }
}
