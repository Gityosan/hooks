<script setup lang="ts">
import type { Skill, GetSkillQuery } from '~/assets/API'
import { getSkill } from '~/assets/graphql/queries'
const { params } = useRoute()
const skill = ref<Skill>({} as Skill)
const fetchSkill = async () => {
  const { data } = await getQuery<GetSkillQuery, Skill>({
    query: getSkill,
    queryName: 'getSkill',
    variables: { id: params.id }
  })
  if (data.value) {
    skill.value = data.value
    useHead({ title: skill.value.title })
  }
}
await fetchSkill()
</script>
<template>
  <atom-breadcrumbs
    class="my-5"
    :items="[
      { title: 'skill', to: '/skill', disabled: false },
      { title: skill.title, to: '/skill', disabled: true }
    ]"
  />
  <div class="mx-5">
    <atom-text font-size="text-h4" :text="skill.title" class="mt-16" />
  </div>
  <atom-text font-size="text-h5" text="このタグを登録中のメンバー" class="mt-16 mx-5" />
  <div
    v-if="skill?.user?.items"
    class="d-flex flex-nowrap ma-5 pa-2 overflow-x-auto"
    style="gap: 60px 4%"
  >
    <module-user-small
      v-for="item in skill.user.items"
      :key="item?.user.id"
      :user="item?.user"
      style="flex: 0 1 22%"
    />
  </div>
  <atom-text font-size="text-h5" text="このタグに関連する記事" class="mt-16 mx-5" />
  <div v-if="skill?.user?.items" class="d-flex flex-nowrap pa-2 overflow-x-auto">
    <module-content-medium
      v-for="item in skill.article?.items"
      :key="item?.article.id"
      :created-at="item?.article.createdAt"
      :updated-at="item?.article.updatedAt"
      :title="item?.article.title"
      :img-key="item?.article.file?.key"
      :identity-id="item?.article.file?.identityId"
      class="v-col-12 v-col-sm-6 v-col-md-4"
      @click="navigateTo('/article/' + item?.article.id)"
    />
  </div>
</template>
