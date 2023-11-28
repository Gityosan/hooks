<script setup lang="ts">
import type { Article, ListArticlesQuery } from '~/assets/API'
import { listArticles } from '~/assets/graphql/queries'
const { isSignedIn } = useLoginState()
const articles = ref<Article[]>([])
useHead({ title: '記事一覧' })
const getArticles = async () => {
  const { data } = await listQuery<ListArticlesQuery, Article>({
    query: listArticles,
    queryName: 'listArticles',
    filter: { published: { eq: true } }
  })
  if (data.value) articles.value = data.value
}
await getArticles()
</script>
<template>
  <div class="d-flex align-center py-10">
    <atom-text text="Article" font-size="text-h5" line-height="line-height-lg" />
    <v-spacer />
    <nuxt-link v-if="isSignedIn" to="/admin/article">
      <atom-button text="新規作成" />
    </nuxt-link>
  </div>
  <div class="d-flex flex-wrap">
    <nuxt-link
      v-for="item in articles"
      :key="item?.id"
      :to="`/article/${item?.id}`"
      class="text-decoration-none v-col-12 v-col-sm-6 v-col-md-4"
    >
      <module-content-medium
        :created-at="item?.createdAt"
        :updated-at="item?.updatedAt"
        :title="item?.title"
        :img-key="item?.file?.key"
        :identity-id="item?.file?.identityId"
      >
        <atom-text
          :text="item.user?.name"
          font-size="text-caption"
          font-weight="font-weight-regular"
          class="text-right"
        />
      </module-content-medium>
    </nuxt-link>
  </div>
</template>
