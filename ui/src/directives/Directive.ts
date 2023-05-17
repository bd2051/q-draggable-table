import { DirectiveBinding } from 'vue';
import { RealMode } from '../dragger/fake-table';
import { DragOptions } from '../dragger/draggable-table';
import tableDragger from '../dragger/index';

const draggerMap = new WeakMap();

interface Options {
  onDrop?: (from?: number, to?: number, table?: HTMLTableElement, mode?: RealMode) => void,
  onDrag?: (table?: HTMLTableElement, mode?: RealMode) => void,
  onShadowMove?: (from?: number, to?: number, table?: HTMLTableElement, mode?: RealMode) => void,
  onOut?: (table?: HTMLTableElement, mode?: RealMode) => void,
  options?: Partial<DragOptions>
}

const setDragger = (table: HTMLTableElement, {
  onDrop,
  onDrag,
  onShadowMove,
  onOut,
  options = {},
}: Options) => {
  const dragger = tableDragger(table, options);
  if (onDrop) dragger.on('drop', onDrop);
  if (onDrag) dragger.on('drag', onDrag);
  if (onShadowMove) dragger.on('shadowMove', onShadowMove);
  if (onOut) dragger.on('out', onOut);
  draggerMap.set(table, dragger);
};

const checkAndClearDragger = (table: HTMLTableElement) => {
  const dragger = draggerMap.get(table);
  if (dragger) {
    dragger.destroy();
    draggerMap.delete(table);
  }
};

export default {
  name: 'draggable-table',
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const table = el.querySelector('table');
    if (table === null) {
      throw new Error('Work only with table tag');
    }
    checkAndClearDragger(table);
    setDragger(table, binding.value);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    const table = el.querySelector('table');
    if (table === null) {
      throw new Error('Work only with table tag');
    }
    checkAndClearDragger(table);
    setDragger(table, binding.value);
  },
  unmounted(el: HTMLElement) {
    const table = el.querySelector('table');
    if (table === null) {
      throw new Error('Work only with table tag');
    }
    checkAndClearDragger(table);
  },
};
