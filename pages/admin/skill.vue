<script setup lang="ts">
import { Skill, UpdateSkillInput, ListSkillsQuery } from '~/assets/API'
import { IndexSignature } from '~/assets/type'
import { skillInputs } from '~/assets/enum'
import { createSkill, deleteSkill, updateSkill } from '~/assets/graphql/mutations'
import { listSkills } from '~/assets/graphql/queries'
const { $listQuery, $baseMutation, $filterAttr } = useNuxtApp()
const { setExistError, setErrorMessages } = useErrorState()
const { banEdit } = useEditState()
const form = ref<any>()
const skills = ref<Skill[]>([])
useHead({ title: 'スキル編集' })
const headers = [
  { title: '操作', key: 'action' },
  { title: 'タイトル', key: 'title' }
]
const getSkills = async () => {
  skills.value = await $listQuery<ListSkillsQuery, Skill>({ query: listSkills })
}
const mutateSkill = async () => {
  const validate = await form.value?.validate()
  if (!validate.valid) {
    setExistError(true)
    setErrorMessages(
      form.value?.errors.map((v: any) => v.errorMessages.map((m: string) => `${v.id}：${m}`)).flat()
    )
    return
  }
  await $baseMutation({
    query: input.value.id ? updateSkill : createSkill,
    input: input.value.id
      ? $filterAttr(input.value, skillInputs)
      : $filterAttr(input.value, skillInputs, ['id'])
  })
  await getSkills()
}
const defaultInput = Object.fromEntries(skillInputs.map((v) => [v.key, v.default]))
const input = ref<IndexSignature<Partial<UpdateSkillInput>>>(defaultInput)
await getSkills()
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
        @click="mutateSkill()"
      />
    </div>
    <v-form ref="form">
      <atom-input
        v-for="item in skillInputs"
        :key="item.key"
        v-model="input[item.key]"
        :input="item"
      />
    </v-form>
  </div>
  <module-data-table
    :headers="headers"
    :items="skills"
    @fetch-func="getSkills()"
    @edit-func="
      (id) => {
        input = $filterAttr(
          skills.find((v: any) => v.id === id),
          skillInputs
        )
      }
    "
    @delete-func="(id) => $baseMutation({ query: deleteSkill, input: { id } })"
  >
  </module-data-table>
</template>
