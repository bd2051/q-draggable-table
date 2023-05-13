import DraggableTable, { DragOptions, Emitter } from './draggable-table';

type Create = (el: HTMLTableElement, options: Partial<DragOptions>) => Emitter
const create: Create = (el, options) => DraggableTable.create(el, options);
export default create;
