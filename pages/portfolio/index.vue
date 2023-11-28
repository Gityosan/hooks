<script setup lang="ts">
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
    <module-content-medium
      v-for="item in portfolios"
      :key="item.id"
      :img-key="item.file?.key"
      :identity-id="item.file?.identityId"
      :created-at="item.createdAt"
      :updated-at="item.updatedAt"
      :title="item.title"
      class="v-col-12 v-col-sm-6 v-col-md-4"
      @click="navigateTo(item.url, { external: true })"
    >
    </module-content-medium>
  </div>
</template>
