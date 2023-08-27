<script setup lang="ts">
import { Project, UpdateProjectInput, ListProjectsQuery } from '~/assets/API'
import { FileInput } from '~/assets/type'
import { projectInputs } from '~/assets/enum'
import { createProject, deleteProject, updateProject } from '~/assets/graphql/mutations'
import { listProjects } from '~/assets/graphql/queries'
const { $listQuery, $extendMutation } = useNuxtApp()
const { banEdit } = useEditState()
const form = ref<any>()
const projects = ref<Project[]>([])
useHead({ title: 'プロジェクト編集' })
const headers = [
  { title: 'タイトル', key: 'title' },
  { title: '募集・停止', key: 'wanted' },
  { title: '公開・下書き', key: 'published' },
  { title: '開始(予定)日', key: 'start' },
  { title: '終了(予定)日', key: 'end' },
  { title: '参加者', key: 'user' },
  { title: '操作', key: 'action' }
]
const getProjects = async () => {
  projects.value = await $listQuery<ListProjectsQuery, Project>({
    query: listProjects
  })
}
const mutateProject = async () => {
  if (!(await checkValidation(form.value))) return
  const excludeAttr = Object.entries(input.value)
    .filter(([_, v]) => v === null)
    .map(([k, _]) => k)
  await $extendMutation({
    type: input.value.id ? 'update' : 'create',
    key: input.value.file?.key || '',
    query: input.value.id ? updateProject : createProject,
    input: filterAttr({ ...input.value }, input.value.id ? ['id'] : excludeAttr),
    file: input.value.file?.file
  })
  await getProjects()
}
const defaultInput = Object.fromEntries(projectInputs.map((v) => [v.key, v.default]))
const input = ref<FileInput<Partial<UpdateProjectInput>>>(defaultInput)
await getProjects()
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
        @click="mutateProject()"
      />
    </div>
    <v-form ref="form">
      <atom-input
        v-for="item in projectInputs"
        :key="item.key"
        v-model="input[item.key as keyof typeof input]"
        :input="item"
      />
    </v-form>
  </div>
  <module-data-table
    :headers="headers"
    :items="projects"
    :custom-columns="['wanted', 'published', 'user']"
    @fetch="getProjects()"
    @edit="
      (id) => {
        input = filterAttr(
          projects.find((v: any) => v.id === id) || {},
          Object.keys(projects[0]).filter((v) => !Object.keys(defaultInput).includes(v))
        )
      }
    "
    @delete="
      (id) =>
        $extendMutation({
          type: 'delete',
          key: input.file?.key || '',
          query: deleteProject,
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
    <template #user="{ item }">
      {{ item.columns.user.items.map((v: any) => v?.user.name).join(' / ') }}
    </template>
  </module-data-table>
</template>
