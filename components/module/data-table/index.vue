<script setup lang="ts">
import { useDisplay } from 'vuetify'
const props = withDefaults(
  defineProps<{
    headers: { title: string; key: string }[]
    items: any[]
    customColumns: string[]
    page: number
    perPage: number
    totalPageCount: number
    showExpand: boolean
  }>(),
  {
    headers: () => [],
    items: () => [],
    customColumns: () => [],
    page: 1,
    perPage: 30,
    totalPageCount: 1,
    showExpand: false
  }
)
const emit = defineEmits<{
  (e: 'fetch'): void
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
  (e: 'update:page', page: number): void
  (e: 'update:per-page', perPage: number): void
}>()
const { mdAndUp, sm } = useDisplay()
const { ineditable } = useEditState()
const records = ref<any[]>(props.items)
const open = ref<boolean>(false)
const selectedIds = ref<string[]>([])
const search = ref<string>('')
watch(props, (_, c) => {
  records.value = c.items
})
const deleteReady = (id = '') => {
  if (!id) return
  open.value = true
  selectedIds.value = [id]
}
const deleteItems = async () => {
  if (!selectedIds.value.length) return
  for (let i = 0, len = selectedIds.value.length; i < len; i++) {
    await emit('delete', selectedIds.value[i])
  }
  records.value = records.value.filter((v) => !selectedIds.value.includes(v.id))
  selectedIds.value = []
  open.value = false
}
</script>
<template>
  <v-card class="pt-2 pb-5">
    <div class="d-flex align-center py-3 px-5" style="gap: 0 8px">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="検索"
        variant="outlined"
        density="compact"
        clearable
        single-line
        hide-details
        :style="{
          '--v-input-padding-top': '4px',
          '--v-input-chips-margin-top': '2px',
          '--v-input-chips-margin-bottom': '1px',
          '--v-field-padding-bottom': '4px'
        }"
        class="border-grey-lighten-1"
      />
      <v-spacer />
      <v-select
        :items="[5, 10, 30, 50, 100, 200]"
        type="number"
        variant="outlined"
        density="compact"
        hide-details
        class="border-grey-lighten-1 rounded-lg max-width-120"
        :style="{
          '--v-input-padding-top': '4px',
          '--v-field-padding-bottom': 0,
          '--v-input-chips-margin-bottom': 0
        }"
        :model-value="perPage"
        @update:model-value="$emit('update:per-page', $event)"
      />
      <atom-button-outlined
        text="再取得"
        :disabled="ineditable"
        icon="mdi-reload"
        @click="$emit('fetch')"
      />
    </div>
    <v-data-table
      v-model="selectedIds"
      :headers="headers"
      :items="records"
      :search="search"
      :loading="ineditable"
      no-data-text="表示できるデータがありません"
      item-title="name"
      item-value="id"
      density="compact"
      multi-sort
      hide-default-footer
      show-select
      :show-expand="showExpand"
      :style="{ '--v-table-row-height': '64px' }"
      class="white-space-nowrap text-subtitle-2 rounded-t-0"
      :page="1"
      :items-per-page="perPage"
      @update:page="$emit('update:page', $event)"
      @update:items-per-page="$emit('update:per-page', $event)"
    >
      <template #top>
        <slot name="top"></slot>
      </template>
      <template
        #headers="{
          columns,
          isSorted,
          getSortIcon,
          toggleSort,
          someSelected,
          allSelected,
          selectAll
        }"
      >
        <tr>
          <template v-for="column in columns" :key="column.key">
            <th
              v-if="column.key === 'data-table-select'"
              class="px-2 bg-grey-lighten-3 border-bottom-solid border-width-1 border-grey-lighten-1"
            >
              <v-checkbox
                :model-value="allSelected"
                true-icon="mdi-checkbox-marked"
                :false-icon="someSelected ? 'mdi-minus-box-outline' : 'mdi-checkbox-blank-outline'"
                hide-details
                :style="{ '--v-input-control-height': '40px' }"
                @click="selectAll(!allSelected)"
              />
            </th>
            <th
              v-else
              class="bg-grey-lighten-3 border-bottom-solid border-width-1 border-grey-lighten-1"
            >
              <atom-text
                comp="span"
                font-size="text-subtitle-2"
                class="mr-2 cursor-pointer"
                @click="toggleSort(column)"
              >
                {{ column.title }}
                <template v-if="isSorted(column)">
                  <v-icon :icon="getSortIcon(column)" size="20" style="margin-bottom: 2px"></v-icon>
                </template>
              </atom-text>
            </th>
          </template>
        </tr>
        <tr>
          <td
            :colspan="columns.length"
            class="px-0 transition-short-ease-out border-width-1 border-grey-lighten-1"
            :class="selectedIds.length > 1 ? 'height-58 border-bottom-solid' : 'height-0'"
          >
            <div
              class="pl-6 d-flex align-center bg-grey-lighten-4 transition-short-ease-out"
              :class="selectedIds.length > 1 ? 'py-3' : 'py-0'"
            >
              <atom-text
                v-if="selectedIds.length > 1"
                :text="`${selectedIds.length}件のアイテムが選択されています。`"
                font-size="text-subtitle-2"
                line-height="line-height-lg"
              />
              <atom-button-outlined
                v-if="selectedIds.length > 1"
                text="選択したアイテムの削除"
                variant="small"
                :disabled="ineditable"
                icon="mdi-delete"
                class="ml-2 bg-white"
                @click="open = true"
              />
            </div>
          </td>
        </tr>
        <slot name="headers"></slot>
      </template>
      <template v-for="c in customColumns" :key="c" #[`item.${c}`]="{ item }">
        <slot :name="c" :item="item" />
      </template>
      <template v-if="headers.find((v) => v.key === 'action')" #item.action="{ item }">
        <slot name="action" :item="item">
          <div class="d-flex flex-nowrap" style="gap: 0 8px">
            <atom-button-outlined
              text="編集"
              variant="small"
              :disabled="ineditable"
              icon="mdi-pencil"
              @click="$emit('edit', item.id)"
            />
            <atom-button-outlined
              text="削除"
              variant="small"
              :disabled="ineditable"
              icon="mdi-delete"
              @click="deleteReady(item.id)"
            />
          </div>
        </slot>
      </template>
      <template #expanded-row="{ columns, item }">
        <slot name="expanded-row" :item="item" :columns="columns"> </slot>
      </template>
      <template #bottom>
        <slot name="bottom">
          <v-pagination
            :length="totalPageCount"
            :total-visible="mdAndUp ? 10 : sm ? 5 : 1"
            :model-value="page"
            density="compact"
            class="overflow-x-auto"
            @update:model-value="$emit('update:page', $event)"
          />
        </slot>
      </template>
    </v-data-table>
    <v-dialog v-model="open" persistent>
      <v-card flat class="rounded-lg py-6 px-10" min-width="370">
        <atom-text
          :text="selectedIds.length + '件のデータを本当に削除しますか？'"
          class="w-100 mt-5 mb-10 text-center"
        />
        <div class="d-flex justify-space-around">
          <atom-button-switch
            text="削除します"
            :loading="ineditable"
            class="rounded-pill width-200"
            @click="deleteItems()"
          />
          <atom-button-switch
            text="キャンセル"
            :loading="ineditable"
            class="rounded-pill width-200"
            @click="open = false"
          />
        </div>
      </v-card>
    </v-dialog>
  </v-card>
</template>
