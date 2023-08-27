<script setup lang="ts">
import { Event, UpdateEventInput, ListEventsQuery } from '~/assets/API'
import { FileInput } from '~/assets/type'
import { eventInputs } from '~/assets/enum'
import { createEvent, deleteEvent, updateEvent } from '~/assets/graphql/mutations'
import { listEvents } from '~/assets/graphql/queries'
const { $listQuery, $extendMutation } = useNuxtApp()
const { banEdit } = useEditState()
const events = ref<Event[]>([])
const form = ref<any>()
useHead({ title: 'イベント編集' })
const headers = [
  { title: 'タイトル', key: 'title' },
  { title: '募集・停止', key: 'wanted' },
  { title: '公開・下書き', key: 'published' },
  { title: '日付', key: 'date' },
  { title: '参加者', key: 'user' },
  { title: '操作', key: 'action' }
]
const getEvents = async () => {
  events.value = await $listQuery<ListEventsQuery, Event>({ query: listEvents })
}
const mutateEvent = async () => {
  if (!(await checkValidation(form.value))) return
  const excludeAttr = Object.entries(input.value)
    .filter(([_, v]) => v === null)
    .map(([k, _]) => k)
  await $extendMutation({
    type: input.value.id ? 'update' : 'create',
    key: input.value.file?.key || '',
    query: input.value.id ? updateEvent : createEvent,
    input: filterAttr({ ...input.value }, input.value.id ? ['id'] : excludeAttr),
    file: input.value.file?.file
  })
  await getEvents()
}
const defaultInput = Object.fromEntries(eventInputs.map((v) => [v.key, v.default]))
const input = ref<FileInput<Partial<UpdateEventInput>>>(defaultInput)
await getEvents()
</script>
<template>
  <div>
    <div class="d-flex my-2">
      <atom-text
        :text="input.id ? input.id + 'の更新' : '新規作成'"
        font-size="text-h6"
        class="my-2"
      />
      <v-spacer />
      <atom-button :loading="banEdit" text="リセット" class="mr-3" @click="input = defaultInput" />
      <atom-button
        :loading="banEdit"
        :text="input.id ? '更新' : '新規作成'"
        class="mr-4"
        @click="mutateEvent()"
      />
    </div>
    <v-form ref="form">
      <atom-input
        v-for="item in eventInputs"
        :key="item.key"
        v-model="input[item.key as keyof typeof input]"
        :input="item"
      />
    </v-form>
  </div>
  <module-data-table
    :headers="headers"
    :items="events"
    :custom-columns="['wanted', 'published', 'date', 'user']"
    @fetch="getEvents()"
    @edit="
      (id) => {
        input = filterAttr(
          { ...events.find((v: any) => v.id === id) },
          Object.keys(events[0]).filter((v) => !Object.keys(defaultInput).includes(v))
        )
      }
    "
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
</template>
