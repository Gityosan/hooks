<script setup lang="ts">
import { Skill, UpdateSkillInput, ListSkillsQuery } from '~/assets/API'
import { skillInputs } from '~/assets/enum'
import { createSkill, deleteSkill, updateSkill } from '~/assets/graphql/mutations'
import { listSkills } from '~/assets/graphql/queries'
const { $listQuery, $baseMutation } = useNuxtApp()
const { banEdit } = useEditState()
const form = ref<any>()
const skills = ref<Skill[]>([])
useHead({ title: 'スキル編集' })
const headers = [
  { title: 'タイトル', key: 'title' },
  { title: '操作', key: 'action' }
]
const getSkills = async () => {
  skills.value = await $listQuery<ListSkillsQuery, Skill>({ query: listSkills })
}
const mutateSkill = async () => {
  if (!(await checkValidation(form.value))) return
  const excludeAttr = Object.entries(input.value)
    .filter(([_, v]) => v === null)
    .map(([k, _]) => k)
  await $baseMutation({
    query: input.value.id ? updateSkill : createSkill,
    input: filterAttr(input.value, input.value.id ? ['id'] : excludeAttr)
  })
  await getSkills()
}
const defaultInput = Object.fromEntries(skillInputs.map((v) => [v.key, v.default]))
const input = ref<UpdateSkillInput>(defaultInput as UpdateSkillInput)
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
        class="mr-4"
        @click="mutateSkill()"
      />
    </div>
    <v-form ref="form">
      <atom-input
        v-for="item in skillInputs"
        :key="item.key"
        v-model="input[item.key as keyof typeof input]"
        :input="item"
      />
    </v-form>
  </div>
  <module-data-table
    :headers="headers"
    :items="skills"
    @fetch="getSkills()"
    @edit="
      (id) => {
        input = filterAttr(
          skills.find((v: any) => v.id === id),
          skillInputs
        )
      }
    "
    @delete="(id) => $baseMutation({ query: deleteSkill, input: { id } })"
  >
  </module-data-table>
</template>
