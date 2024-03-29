<script setup lang="ts">
import type { InputType } from '~/assets/type'
const { ineditable } = useEditState()
const items = ref<any>([])
const tabs = ['新規作成・編集', '一覧']
const tab = ref<string>('')
const form = ref<any>(null)
const props = withDefaults(
  defineProps<{
    inputs: InputType[]
    title: string
    query: string
    createMutation: string
    updateMutation: string
    deleteMutation: string
  }>(),
  {
    inputs: () => [],
    title: '中間テーブル',
    query: '',
    createMutation: '',
    updateMutation: '',
    deleteMutation: ''
  }
)
const getRelation = async () => {
  items.value = await listQuery({ query: props.query })
}
const mutateRelation = async () => {
  if (!(await checkValidation(form.value))) return
  await baseMutation({
    query: input.value.id ? props.updateMutation : props.createMutation,
    input: input.value.id
      ? filterAttr(input.value, props.inputs)
      : filterAttr(input.value, props.inputs, ['id'])
  })
  await getRelation()
}
const defaultInput = Object.fromEntries(props.inputs.map((v) => [v.key, v.default]))
const input = ref<any>(defaultInput)
await getRelation()
</script>
<template>
  <v-card class="rounded-lg mb-16">
    <v-tabs v-model="tab" class="bg-main-color">
      <v-tab v-for="t in tabs" :key="t" :title="t" :value="t" class="text-white" />
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="tabs[0]">
        <div class="d-flex my-2 px-5">
          <atom-text
            :text="title + (input.id ? 'の更新' : 'の新規作成')"
            font-size="text-h6"
            class="my-2 line-clamp-1"
          />
          <v-spacer />
          <atom-button-outlined
            :loading="ineditable"
            text="リセット"
            class="mr-3"
            @click="input = defaultInput"
          />
          <atom-button-outlined
            :loading="ineditable"
            :text="input.id ? '更新' : '新規作成'"
            @click="mutateRelation()"
          />
        </div>
        <v-form ref="form" class="px-5">
          <atom-input
            v-for="item in inputs"
            :key="item.key"
            v-model="input[item.key]"
            :input="item"
          />
        </v-form>
      </v-window-item>
      <v-window-item :value="tabs[1]">
        <module-data-table
          :headers="
            ['action', ...Object.keys(defaultInput)].map((v) => {
              return { title: v, key: v }
            })
          "
          :items="items"
          @fetch="getRelation"
          @edit="
            (id) => {
              input = filterAttr(
                items.find((v: any) => v.id === id),
                inputs
              )
            }
          "
          @delete="(id) => baseMutation({ query: deleteMutation, input: { id } })"
        />
      </v-window-item>
    </v-window>
  </v-card>
</template>
