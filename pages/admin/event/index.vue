<script setup lang="ts">
import type { UpdateEventInput, ListEventsQuery } from '~/assets/API'
import type { FileInput } from '~/assets/type'
import { eventInputs } from '~/assets/enum'
import { createEvent, deleteEvent } from '~/assets/graphql/mutations'
import { listEvents } from '~/assets/graphql/queries'
const { isAdmin } = useLoginState()
const { ineditable } = useEditState()
const { myUser } = useMyUser()
const events = ref<UpdateEventInput[]>([])
const open = ref<boolean>(false)
const form = ref<any>()
const defaultInput = Object.fromEntries(eventInputs.map((v) => [v.key, v.default])) as FileInput<
  Partial<UpdateEventInput>
>
const input = ref<FileInput<Partial<UpdateEventInput>>>(defaultInput)
useHead({ title: 'イベント一覧' })
const headers = [
  { title: 'タイトル', key: 'title' },
  { title: '募集状態', key: 'wanted' },
  { title: '公開状態', key: 'published' },
  { title: '日付', key: 'date' },
  { title: '参加者', key: 'user' },
  { title: '操作', key: 'action' }
]
const getItems = async () => {
  const { data } = await listQuery<ListEventsQuery, UpdateEventInput>({
    query: listEvents,
    queryName: 'listEvents',
    filter: isAdmin.value ? {} : { userEventId: { eq: myUser.value.id || null } }
  })
  if (data.value) events.value = data.value
}
const createItem = async () => {
  if (!(await checkValidation(form.value))) return
  const excludeAttr = Object.entries(input.value)
    .filter(([_, v]) => v === null)
    .map(([k, _]) => k)
  await extendMutation({
    type: 'create',
    key: input.value.file?.key || '',
    query: createEvent,
    input: filterAttr({ ...input.value }, excludeAttr),
    file: input.value.file?.file
  })
  input.value = defaultInput
  await getItems()
  open.value = false
}
await getItems()
</script>
<template>
  <div class="d-flex align-center py-3">
    <atom-text text="イベント" line-height="line-height-lg" />
    <v-spacer />
    <atom-button-outlined
      text="アイテムの追加"
      :disabled="ineditable"
      icon="mdi-plus-circle"
      @click="open = true"
    />
  </div>
  <module-data-table
    :headers="headers"
    :items="events"
    :custom-columns="['wanted', 'published', 'date', 'user']"
    class="mb-15"
    @fetch="getItems"
    @edit="(id) => navigateTo(`/admin/event/${id}`)"
    @delete="
      (id) =>
        extendMutation({
          type: 'delete',
          key: input.file?.key || '',
          query: deleteEvent,
          input: { id }
        })
    "
  >
    <template #wanted="{ item }">
      <v-chip
        :text="item.wanted ? '募集中' : '募集停止'"
        :color="item.wanted ? 'success' : 'grey'"
        density="comfortable"
        class="font-weight-bold"
      >
        <template #prepend>
          <v-icon
            :icon="item.wanted ? 'mdi-check' : 'mdi-pause-octagon-outline'"
            size="16"
            class="mr-1 my-1"
          />
        </template>
      </v-chip>
    </template>
    <template #published="{ item }">
      <v-chip
        :text="item.published ? '公開中' : '非公開'"
        :color="item.published ? 'orange' : 'grey'"
        density="comfortable"
        class="font-weight-bold"
      >
        <template #prepend>
          <v-icon
            :icon="item.published ? 'mdi-circle-medium' : 'mdi-eye-off-outline'"
            size="16"
            class="mr-1 my-1"
          />
        </template>
      </v-chip>
    </template>
    <template #date="{ item }">
      {{ item.date.join(' / ') }}
    </template>
    <template #user="{ item }">
      <v-chip
        v-for="v in item.user.items.slice(0, 3)"
        :text="v.user.name"
        density="comfortable"
        variant="outlined"
        size="small"
        class="mr-1"
      />
      <v-chip
        v-if="item.user.items.length > 3"
        :text="`+${item.user.items.length - 3}`"
        variant="outlined"
        size="x-small"
      />
    </template>
  </module-data-table>
  <v-dialog v-model="open" persistent>
    <v-card class="pa-5">
      <div class="d-flex align-center py-3 bg-white" style="gap: 0 8px">
        <atom-text text="新規作成" line-height="line-height-lg" />
        <v-spacer />
        <atom-button
          text="キャンセル"
          :disabled="ineditable"
          icon="mdi-close"
          @click="open = false"
        />
        <atom-button
          text="保存"
          :disabled="ineditable"
          icon="mdi-content-save"
          @click="createItem()"
        />
      </div>
      <v-form ref="form">
        <atom-input
          v-for="i in eventInputs"
          :key="i.key"
          v-model="input[i.key as keyof typeof input]"
          :input="i"
        />
      </v-form>
    </v-card>
  </v-dialog>
</template>
