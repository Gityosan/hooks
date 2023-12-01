<script setup lang="ts">
import type { Project, ListProjectsQuery } from '~/assets/API'
import { listProjects } from '~/assets/graphql/queries'
const { isSignedIn } = useLoginState()
const projects = ref<Project[]>([])
useHead({ title: 'プロジェクト一覧' })
const getProjects = async () => {
  const { data } = await listQuery<ListProjectsQuery, Project>({
    query: listProjects,
    queryName: 'listProjects',
    filter: { published: { eq: true } }
  })
  if (data.value) projects.value = data.value
}
await getProjects()
</script>
<template>
  <div class="d-flex py-10">
    <atom-text font-size="text-h4" text="Project" />
    <v-spacer />
    <atom-button-outlined v-if="isSignedIn" text="新規作成" @click="navigateTo('/admin/project')" />
  </div>
  <div class="d-flex flex-wrap">
    <module-content-medium
      v-for="item in projects"
      :key="item.id"
      :img-key="item.file?.key"
      :identity-id="item.file?.identityId"
      :created-at="item.createdAt"
      :updated-at="item.updatedAt"
      :title="item.title"
      class="v-col-12 v-col-sm-6 v-col-md-4"
      @click="navigateTo('/project/' + item.id)"
    >
      <atom-text
        font-size="text-subtitle-2"
        :text="item.wanted ? '募集中' : '募集停止'"
        :color="item.wanted ? 'text-white' : 'text-grey-darken-1'"
        class="rounded text-center border-width-1 border-solid pa-1 mx-2"
        :class="[
          item.wanted
            ? 'border-light-blue-darken-4 bg-light-blue-darken-4'
            : 'border-grey-darken-1 bg-transparent'
        ]"
      />
    </module-content-medium>
  </div>
</template>
