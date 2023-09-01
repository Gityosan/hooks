<script setup lang="ts">
import { UpdateEventInput, ListEventsQuery } from '~/assets/API'
import { FileInput } from '~/assets/type'
import { eventInputs } from '~/assets/enum'
import { createEvent, deleteEvent } from '~/assets/graphql/mutations'
import { listEvents } from '~/assets/graphql/queries'
const { $extendMutation } = useNuxtApp()
const { isAdmin } = useLoginState()
const { banEdit } = useEditState()
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
  { title: '募集・停止', key: 'wanted' },
  { title: '公開・下書き', key: 'published' },
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
  await $extendMutation({
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
    <atom-button
      text="アイテムの追加"
      :disabled="banEdit"
      @click="open = true"
      icon="mdi-plus-circle"
    />
  </div>
  <module-data-table
    :headers="headers"
    :items="events"
    :custom-columns="['wanted', 'published', 'date', 'user']"
    class="mb-15"
    @fetch="getItems()"
    @edit="(id) => navigateTo(`/admin/event/${id}`)"
    @delete="
      (id) =>
        $extendMutation({
          type: 'delete',
          key: input.file?.key || '',
          query: deleteEvent,
          input: { id }
        })
    "
  >
    <template #wanted="{ item }">
      {{ item.columns.wanted ? '募集中' : '募集停止' }}
    </template>
    <template #published="{ item }">
      {{ item.columns.published ? '公開済み' : '下書き' }}
    </template>
    <template #date="{ item }">
      {{ item.columns.date.join(' / ') }}
    </template>
    <template #user="{ item }">
      {{ item.columns.user.items.map((v: any) => v?.user.name).join(' / ') }}
    </template>
  </module-data-table>
  <v-dialog v-model="open" persistent>
    <v-card class="pa-5">
      <div class="d-flex align-center py-3 bg-white" style="gap: 0 8px">
        <atom-text text="新規作成" line-height="line-height-lg" />
        <v-spacer />
        <atom-button text="キャンセル" :disabled="banEdit" @click="open = false" icon="mdi-close" />
        <atom-button
          text="保存"
          :disabled="banEdit"
          @click="createItem()"
          icon="mdi-content-save"
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
