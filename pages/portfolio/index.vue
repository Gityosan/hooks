<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { Portfolio, ListPortfoliosQuery } from '~/assets/API'
import { listPortfolios } from '~/assets/graphql/queries'
const portfolios = ref<Portfolio[]>([])
useHead({ title: 'ポートフォリオ一覧' })
const getPortfolios = async () => {
  const { data } = await listQuery<ListPortfoliosQuery, Portfolio>({
    query: listPortfolios,
    queryName: 'listPortfolios',
    filter: { published: { eq: true } }
  })
  if (data.value) portfolios.value = data.value
}
await getPortfolios()
</script>
<template>
  <atom-text font-size="text-h4" text="Portfolio" class="py-10" />
  <div class="d-flex flex-wrap">
    <nuxt-link
      v-for="item in portfolios"
      :key="item.id"
      :to="item.url ? `${item.url}` : '/'"
      target="_blank"
      class="text-decoration-none v-col-12 v-col-sm-6 v-col-md-4 pa-4"
    >
      <module-content-medium
        :created-at="item.createdAt"
        :title="item.title"
        :img-key="item.file?.key"
        :identity-id="item.file?.identityId"
      >
      </module-content-medium>
    </nuxt-link>
  </div>
</template>
