<script setup lang="ts">
import type { UpdateProjectInput, ListProjectsQuery } from '~/assets/API'
import type { FileInput } from '~/assets/type'
import { projectInputs } from '~/assets/enum'
import { createProject, deleteProject } from '~/assets/graphql/mutations'
import { listProjects } from '~/assets/graphql/queries'
const { isAdmin } = useLoginState()
const { ineditable } = useEditState()
const { myUser } = useMyUser()
const projects = ref<UpdateProjectInput[]>([])
const open = ref<boolean>(false)
const form = ref<any>()
const defaultInput = Object.fromEntries(projectInputs.map((v) => [v.key, v.default])) as FileInput<
  Partial<UpdateProjectInput>
>
const input = ref<FileInput<Partial<UpdateProjectInput>>>(defaultInput)
useHead({ title: 'プロジェクト一覧' })
const headers = [
  { title: 'タイトル', key: 'title' },
  { title: '募集・停止', key: 'wanted' },
  { title: '公開・下書き', key: 'published' },
  { title: '開始(予定)日', key: 'start' },
  { title: '終了(予定)日', key: 'end' },
  { title: '参加者', key: 'user' },
  { title: '操作', key: 'action' }
]
const getItems = async () => {
  const { data } = await listQuery<ListProjectsQuery, UpdateProjectInput>({
    query: listProjects,
    queryName: 'listProjects',
    filter: isAdmin.value ? {} : { userProjectId: { eq: myUser.value.id || null } }
  })
  if (data.value) projects.value = data.value
}
const createItem = async () => {
  if (!(await checkValidation(form.value))) return
  const excludeAttr = Object.entries(input.value)
    .filter(([_, v]) => v === null)
    .map(([k, _]) => k)
  await extendMutation({
    type: 'create',
    key: input.value.file?.key || '',
    query: createProject,
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
    <atom-text text="プロジェクト" line-height="line-height-lg" />
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
    :items="projects"
    :custom-columns="['wanted', 'published', 'user']"
    class="mb-15"
    @fetch="getItems"
    @edit="(id) => navigateTo(`/admin/project/${id}`)"
    @delete="
      (id) =>
        extendMutation({
          type: 'delete',
          key: input.file?.key || '',
          query: deleteProject,
          input: { id }
        })
    "
  >
    <template #wanted="{ item }">
      {{ item.wanted ? '募集中' : '募集停止' }}
    </template>
    <template #published="{ item }">
      {{ item.published ? '公開済み' : '下書き' }}
    </template>
    <template #user="{ item }">
      {{ item.user.items.map((v: any) => v?.user.name).join(' / ') }}
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
          v-for="i in projectInputs"
          :key="i.key"
          v-model="input[i.key as keyof typeof input]"
          :input="i"
        />
      </v-form>
    </v-card>
  </v-dialog>
</template>
