<script setup lang="ts">
import { UpdateSkillInput, ListSkillsQuery } from '~/assets/API'
import { FileInput } from '~/assets/type'
import { skillInputs } from '~/assets/enum'
import { createSkill, deleteSkill } from '~/assets/graphql/mutations'
import { listSkills } from '~/assets/graphql/queries'
const { $baseMutation } = useNuxtApp()
const { isAdmin } = useLoginState()
const { banEdit } = useEditState()
const { myUser } = useMyUser()
const skills = ref<UpdateSkillInput[]>([])
const open = ref<boolean>(false)
const form = ref<any>()
const defaultInput = Object.fromEntries(skillInputs.map((v) => [v.key, v.default])) as FileInput<
  Partial<UpdateSkillInput>
>
const input = ref<FileInput<Partial<UpdateSkillInput>>>(defaultInput)
useHead({ title: 'スキルタグ一覧' })
const headers = [
  { title: 'タイトル', key: 'title' },
  { title: '操作', key: 'action' }
]
const getItems = async () => {
  const { data } = await listQuery<ListSkillsQuery, UpdateSkillInput>({
    query: listSkills,
    queryName: 'listSkills',
    filter: isAdmin.value ? {} : { userSkillId: { eq: myUser.value.id || null } }
  })
  if (data.value) skills.value = data.value
}
const createItem = async () => {
  if (!(await checkValidation(form.value))) return
  const excludeAttr = Object.entries(input.value)
    .filter(([_, v]) => v === null)
    .map(([k, _]) => k)
  await $baseMutation({
    query: createSkill,
    input: filterAttr({ ...input.value }, excludeAttr)
  })
  input.value = defaultInput
  await getItems()
  open.value = false
}
await getItems()
</script>
<template>
  <div class="d-flex align-center py-3">
    <atom-text text="スキルタグ" line-height="line-height-lg" />
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
    :items="skills"
    class="mb-15"
    @fetch="getItems()"
    @edit="(id) => navigateTo(`/admin/skill/${id}`)"
    @delete="(id) => $baseMutation({ query: deleteSkill, input: { id } })"
  >
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
          v-for="i in skillInputs"
          :key="i.key"
          v-model="input[i.key as keyof typeof input]"
          :input="i"
        />
      </v-form>
    </v-card>
  </v-dialog>
</template>
