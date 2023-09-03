<script setup lang="ts">
import { Article, GetArticleQuery } from '~/assets/API'
import { getArticle } from '~/assets/graphql/queries'
const { params } = useRoute()
const article = ref<Article>({} as Article)
const fetchArticle = async () => {
  const { data } = await getQuery<GetArticleQuery, Article>({
    query: getArticle,
    queryName: 'getArticle',
    variables: { id: params.id }
  })
  if (data.value) {
    article.value = data.value
    useHead({ title: article.value.title })
  }
}
await fetchArticle()
</script>
<template>
  <atom-breadcrumbs
    class="my-5"
    :items="[
      { title: 'article', to: '/article', disabled: false },
      { title: article.title, to: '/article', disabled: true }
    ]"
  />
  <div class="mx-5">
    <atom-text font-size="text-h4" :text="article.title" class="mt-16" />
    <div class="d-flex flex-nowrap justify-start bg-transparent mt-2 mb-2" style="gap: 0 10px">
      <atom-text font-size="text-caption" font-weight="font-weight-regular">
        <v-icon icon="mdi-cloud-upload-outline" size="14" class="mr-1 align-text-bottom" />
        <span>{{ getYMD(article.createdAt) }}</span>
      </atom-text>
      <atom-text font-size="text-caption" font-weight="font-weight-regular">
        <v-icon icon="mdi-autorenew" size="14" class="mr-1 align-text-bottom" />
        <span>{{ getYMD(article.updatedAt) }}</span>
      </atom-text>
      <atom-text font-size="text-caption" font-weight="font-weight-regular" text="|" />
      <atom-text
        font-size="text-caption"
        font-weight="font-weight-regular"
        :text="article.user?.name"
        class="cursor-pointer text-decoration-underline"
        @click="navigateTo('/member/' + article.user.id)"
      />
    </div>
    <v-chip-group v-if="article.skill?.items.length" :style="{ gap: '4px 8px' }">
      <v-hover v-for="item in article.skill?.items" v-slot="{ isHovering, props }">
        <v-chip
          :ripple="false"
          class="px-3 transition-short-ease-out rounded-pill text-caption"
          :class="[isHovering ? 'text-white bg-main-color' : 'bg-white text-grey-darken-4']"
          variant="outlined"
          :style="{ '--v-chip-height': '24px' }"
          v-bind="props"
          link
          :to="item?.skill.id ? '/skill/' + item?.skill.id : '/'"
        >
          {{ item?.skill.title }}
        </v-chip>
      </v-hover>
    </v-chip-group>
    <div class="my-10 ProseMirror" v-html="reverseSanitize(article.body)"></div>
  </div>
</template>
