# Directive v-draggable-table

[![npm](https://img.shields.io/npm/v/quasar-ui-q-draggable-table.svg?label=quasar-ui-q-draggable-table)](https://www.npmjs.com/package/quasar-ui-q-draggable-table)
[![npm](https://img.shields.io/npm/dt/quasar-ui-q-draggable-table.svg)](https://www.npmjs.com/package/quasar-ui-q-draggable-table)

**Compatible with Quasar UI v2 and Vue 3**.




# Directive v-draggable-table
> The directive makes q-table component draggable. Works only with q-table. Allows you to move both columns and rows. With some settings, such as virtual-scroll, row movement is not available

## Installation

```bash
npm install quasar-ui-q-draggable-table
```

## Usage

Create and register a boot file:

Create in *boot* folder `q-draggable-table.js`
```js
import { boot } from 'quasar/wrappers';
import qDraggableTable from 'quasar-ui-q-draggable-table';
import 'quasar-ui-q-draggable-table/dist/index.css';

export default boot(({ app }) => {
  app.use(qDraggableTable);
});
```

Register in *boot* of `quasr.conf.js` "q-draggable-table"

```js
module.exports = configure(function (ctx) {
  return {
    // ...
    boot: ["q-draggable-table"],
    // ...
  }
})
```

Use directive ```v-draggable-table``` with q-table component

```vue
<q-table
  v-draggable-table="{
    options,
    onDrop,
    onDrag,
    onShadowMove,
    onOut,
  }"
  title="Drag columns"
  :rows="rows"
  :columns="columns"
  row-key="name"
/>
```

### Directive value

### `options`

|key|description| options                            |
|:---|---|------------------------------------|
| `mode` | Available mode for moving. Default: 'column' | 'column' / 'row' / 'free' / 'none' |
| `dragHandler` | Selector of the element being moved. Required for 'free' mode | string                             |
| `onlyBody` | If true, only main body of table is moved. Relevant for 'row' mode | boolean                            |
| `fixFirstColumn` | If true , all columns except the first one are moved . Relevant for 'column' mode | boolean                            |

#### Mode 'none'
In some cases, it may be necessary to disable table dragging. For example, when using grid mode, the table is missing and dragging will not work. Use the mode 'none' option

#### Options Reactivity
In general, changing an option does not cause a component change. Use the component's key to rerender with new options

```vue
<q-table
  v-draggable-table="{
    onDrop,
    options,
  }"
  :key="options.mode"
/>
```

### `onDrop(from?: number, to?: number, table?: HTMLTableElement, mode?: 'column'|'row')`
 
Hook that is triggered when an element is dropped

### `onDrag(table?: HTMLTableElement, mode?: 'column'|'row')`

Hook that is triggered when an element is dragged

### `onShadowMove(from?: number, to?: number, table?: HTMLTableElement, mode?: 'column'|'row')`

Hook that triggers when the shadow of element is moved

### `onOut(table?: HTMLTableElement, mode?: 'column'|'row')`

Hook that triggers when element goes outside the table

**<u>Note:</u>** Library does not redraw original component, but only represents indexes of elements being moved. Use hooks to rerender table. All indexes correspond to real cells of the table.

## Quick example

```vue
<template>
  <q-page padding>
    <q-table
      v-draggable-table="{
        onDrop,
      }"
      title="Drag columns"
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const columns = ref([
      { name: 'name', label: 'Name', field: 'name' },
      { name: 'calories', label: 'Calories', field: 'calories' },
      { name: 'fat', label: 'Fat (g)', field: 'fat' },
      { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
      { name: 'protein', label: 'Protein (g)', field: 'protein' },
    ])
    const rows = ref([
      {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
      },
      {
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
      },
    ])
    return {
      columns,
      rows,
    }
  },
  methods: {
    onDrop(from, to) {
      this.columns.splice(to, 0, this.columns.splice(from, 1)[0]);
    },
  }
}
</script>
```

## Demo

[Codesanbox example](https://codesandbox.io/p/sandbox/agitated-bogdan-tngniw?file=%2Fsrc%2Fpages%2FBasic.vue)

# License
MIT (c) bd2051 <bd2051@mail.ru>
