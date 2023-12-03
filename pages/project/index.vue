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
    <nuxt-link v-if="isSignedIn" to="/admin/project">
      <atom-button text="編集する" />
    </nuxt-link>
  </div>
  <div class="d-flex flex-wrap">
    <nuxt-link
      v-for="item in projects"
      :key="item.id"
      :to="`/project/${item.id}`"
      class="text-decoration-none v-col-12 v-col-sm-6 v-col-md-4 pa-4"
    >
      <module-content-medium
        :created-at="item.createdAt"
        :title="item.title"
        :img-key="item.file?.key"
        :identity-id="item.file?.identityId"
      >
        <template #meta>
          <v-chip
            :text="item.wanted ? '募集中' : '募集停止'"
            :color="item.wanted ? 'success' : 'grey'"
            density="compact"
            class="font-weight-bold line-height-20"
          >
            <template #prepend>
              <v-icon
                :icon="item.wanted ? 'mdi-check' : 'mdi-pause-octagon-outline'"
                size="20"
                class="mr-1"
              />
            </template>
          </v-chip>
        </template>
      </module-content-medium>
    </nuxt-link>
  </div>
</template>
