<template>
  <q-page padding>
    <q-table
      v-draggable-table="{
        options: {
          mode: 'free',
          onlyBody: true,
          dragHandler: 'th,td'
        },
        onDrop,
      }"
      v-model:pagination="pagination"
      flat bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      binary-state-sort
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <template
            v-for="column in columns"
          >
            <q-td
              v-if="column.name === 'name'"
              :key="column.name"
              :props="props"
            >
              {{ props.row[column.name] }}
              <q-popup-edit v-model="props.row[column.name]" v-slot="scope">
                <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
              </q-popup-edit>
            </q-td>
            <q-td
              v-else-if="column.name === 'calories'"
              :key="column.name"
              :props="props"
            >
              {{ props.row.calories }}
              <q-popup-edit v-model="props.row.calories" title="Update calories" buttons v-slot="scope">
                <q-input type="number" v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>
            <q-td
              v-else-if="column.name === 'fat'"
              :key="column.name"
              :props="props"
            >
              <div class="text-pre-wrap">{{ props.row.fat }}</div>
              <q-popup-edit v-model="props.row.fat" v-slot="scope" buttons>
                <q-input type="textarea" v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>
            <q-td
              v-else-if="column.name === 'carbs'"
              :key="column.name"
              :props="props"
            >
              {{ props.row.carbs }}
              <q-popup-edit v-model="props.row.carbs" title="Update carbs" buttons persistent v-slot="scope">
                <q-input type="number" v-model="scope.value" dense autofocus hint="Use buttons to close" />
              </q-popup-edit>
            </q-td>
            <q-td v-else :key="column.name" :props="props">{{ props.row[column.name] }}</q-td>
          </template>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const columns = ref([
      {
        name: 'name',
        required: true,
        label: 'Dessert (100g serving)',
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
        sortable: true
      },
      { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
      { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true, style: 'width: 10px' },
      { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
      { name: 'protein', label: 'Protein (g)', field: 'protein' },
      { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
      { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
      { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
    ])

    const rows = ref([
      {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        sodium: 87,
        calcium: '14%',
        iron: '1%'
      },
      {
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        sodium: 129,
        calcium: '8%',
        iron: '1%'
      },
      {
        name: 'Eclair',
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        sodium: 337,
        calcium: '6%',
        iron: '7%'
      },
      {
        name: 'Cupcake',
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3,
        sodium: 413,
        calcium: '3%',
        iron: '8%'
      },
      {
        name: 'Gingerbread',
        calories: 356,
        fat: 16.0,
        carbs: 49,
        protein: 3.9,
        sodium: 327,
        calcium: '7%',
        iron: '16%'
      },
      {
        name: 'Jelly bean',
        calories: 375,
        fat: 0.0,
        carbs: 94,
        protein: 0.0,
        sodium: 50,
        calcium: '0%',
        iron: '0%'
      },
      {
        name: 'Lollipop',
        calories: 392,
        fat: 0.2,
        carbs: 98,
        protein: 0,
        sodium: 38,
        calcium: '0%',
        iron: '2%'
      },
      {
        name: 'Honeycomb',
        calories: 408,
        fat: 3.2,
        carbs: 87,
        protein: 6.5,
        sodium: 562,
        calcium: '0%',
        iron: '45%'
      },
      {
        name: 'Donut',
        calories: 452,
        fat: 25.0,
        carbs: 51,
        protein: 4.9,
        sodium: 326,
        calcium: '2%',
        iron: '22%'
      },
      {
        name: 'KitKat',
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7,
        sodium: 54,
        calcium: '12%',
        iron: '6%'
      }
    ])
    return {
      console,
      pagination: ref(null),
      columns,
      rows
    }
  },
  computed: {
    columnsMap() {
      return this.columns.reduce((acc, curr, index) => {
        acc[curr] = index + 1
        return acc
      }, {})
    }
  },
  methods: {
    onDrop(from, to, table, mode) {
      if (mode === 'column') {
        this.onDropColumn(from, to)
      } else {
        this.onDropRow(from, to)
      }
    },
    onDropColumn(from, to) {
      this.columns.splice(to, 0, this.columns.splice(from, 1)[0]);
    },
    onDropRow(from, to) {
      const offset = (this.pagination.page - 1) * this.pagination.rowsPerPage
      this.rows.splice(offset + to - 1, 0, this.rows.splice(offset + from - 1, 1)[0]);
    },
  }
}
</script>
