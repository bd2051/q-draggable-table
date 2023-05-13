interface Options {
  staticClass: string,
  direction: 'horizontal' | 'vertical',
}

interface Dragula {
  on: (type: string, cl: (droppedItem?: any) => void) => Dragula,
  destroy: () => void
}

declare module 'dragula-with-animation' {
  export default function dragula(el: Array<HTMLUListElement>, opt: Options): Dragula;
}
