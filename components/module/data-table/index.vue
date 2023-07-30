<script setup lang="ts">
import { useDisplay } from 'vuetify'
const { mdAndUp, sm } = useDisplay()
const { banEdit } = useEditState()
const open = ref<boolean>(false)
const selectedIds = ref<string[]>([])
const search = ref<string>('')
withDefaults(
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
    perPage: 10,
    totalPageCount: 1,
    showExpand: false
  }
)
const emit = defineEmits<{
  (e: 'fetch-func'): void
  (e: 'edit-func', id: string): void
  (e: 'delete-func', id: string): void
}>()
const deleteReady = (id = '') => {
  if (!id) return
  open.value = true
  selectedIds.value = [id]
}
const deleteItems = async () => {
  if (selectedIds.value.length) {
    for (let i = 0, len = selectedIds.value.length; i < len; i++) {
      await emit('delete-func', selectedIds.value[i])
    }
  }
  await emit('fetch-func')
  open.value = false
}
</script>
<template>
  <div class="d-flex align-center mb-5">
    <v-text-field
      v-model="search"
      prepend-inner-icon="mdi-magnify"
      label="Search"
      variant="underlined"
      clearable
      single-line
      hide-details
      :style="{ '--v-input-padding-top': '9px' }"
    />
    <v-spacer />
    <v-select
      :items="[5, 10, 30, 50, 100, 200]"
      type="number"
      variant="outlined"
      density="compact"
      hide-details
      class="mr-5 rounded-lg max-width-120"
      :style="{
        '--v-field-padding-bottom': 0,
        '--v-input-chips-margin-bottom': 0
      }"
      :model-value="perPage"
      @update:model-value="$emit('update:per-page', $event)"
    />
    <atom-button
      v-if="selectedIds.length > 1"
      :loading="banEdit"
      text="選択したアイテムの削除"
      color="red-darken-3"
      class="mr-5"
      @click="open = true"
    />
    <atom-icon-tooltip
      text="再取得"
      icon="mdi-reload"
      color="text-blue"
      :loading="banEdit"
      @click="$emit('fetch-func')"
    />
  </div>
  <v-data-table
    v-model="selectedIds"
    :headers="headers"
    :items="items"
    :search="search"
    no-data-text="ローディング中..."
    item-title="name"
    item-value="id"
    density="compact"
    multi-sort
    hide-default-footer
    show-select
    :show-expand="showExpand"
    :style="{ '--v-table-row-height': '64px' }"
    class="white-space-nowrap my-5 py-5"
    :page="1"
    :items-per-page="perPage"
    @update:page="$emit('update:page', $event)"
    @update:items-per-page="$emit('update:per-page', $event)"
  >
    <template #top>
      <slot name="top"></slot>
    </template>
    <template v-for="c in customColumns" :key="c" #[`item.${c}`]="{ item }">
      <slot :name="c" :item="item" />
    </template>
    <template #item.action="{ item }">
      <slot name="action" :item="item">
        <div class="d-flex flex-nowrap">
          <v-icon
            icon="mdi-pencil"
            size="24"
            class="ma-2 text-green"
            @click="$emit('edit-func', item.value)"
          />
          <v-icon
            icon="mdi-delete"
            size="24"
            class="ma-2 text-red-darken-3"
            @click="deleteReady(item.value)"
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
        <atom-button
          text="削除します"
          :loading="banEdit"
          class="rounded-pill width-200"
          @click="deleteItems()"
        />
        <atom-button
          text="キャンセル"
          :loading="banEdit"
          class="rounded-pill width-200"
          @click="open = false"
        />
      </div>
    </v-card>
  </v-dialog>
</template>
