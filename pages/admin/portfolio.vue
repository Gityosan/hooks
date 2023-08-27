<script setup lang="ts">
import { Portfolio, UpdatePortfolioInput, ListPortfoliosQuery } from '~/assets/API'
import { FileInput } from '~/assets/type'
import { portfolioInputs } from '~/assets/enum'
import { createPortfolio, deletePortfolio, updatePortfolio } from '~/assets/graphql/mutations'
import { listPortfolios } from '~/assets/graphql/queries'
const { $listQuery, $extendMutation } = useNuxtApp()
const { banEdit } = useEditState()
const portfolios = ref<Portfolio[]>([])
const form = ref<any>()
useHead({ title: 'ポートフォリオ編集' })
const headers = [
  { title: 'タイトル', key: 'title' },
  { title: '公開・下書き', key: 'published' },
  { title: '作者', key: 'user' },
  { title: '操作', key: 'action' }
]
const getPortfolios = async () => {
  portfolios.value = await $listQuery<ListPortfoliosQuery, Portfolio>({
    query: listPortfolios
  })
}
const mutatePortfolio = async () => {
  if (!(await checkValidation(form.value))) return
  const excludeAttr = Object.entries(input.value)
    .filter(([_, v]) => v === null)
    .map(([k, _]) => k)
  await $extendMutation({
    type: input.value.id ? 'update' : 'create',
    key: input.value.file?.key || '',
    query: input.value.id ? updatePortfolio : createPortfolio,
    input: filterAttr({ ...input.value }, input.value.id ? ['id'] : excludeAttr),
    file: input.value.file?.file
  })
  await getPortfolios()
}
const defaultInput = Object.fromEntries(portfolioInputs.map((v) => [v.key, v.default]))
const input = ref<FileInput<Partial<UpdatePortfolioInput>>>(defaultInput)
await getPortfolios()
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
        @click="mutatePortfolio()"
      />
    </div>
    <v-form ref="form">
      <atom-input
        v-for="item in portfolioInputs"
        :key="item.key"
        v-model="input[item.key as keyof typeof input]"
        :input="item"
      />
    </v-form>
  </div>
  <module-data-table
    :headers="headers"
    :items="portfolios"
    :custom-columns="['title', 'published', 'user']"
    @fetch="getPortfolios()"
    @edit="
      (id) => {
        input = filterAttr(
          portfolios.find((v: any) => v.id === id) || {},
          Object.keys(portfolios[0]).filter((v) => !Object.keys(defaultInput).includes(v))
        )
      }
    "
    @delete="
      (id) =>
        $extendMutation({
          type: 'delete',
          key: input.file?.key || '',
          query: deletePortfolio,
          input: { id }
        })
    "
  >
    <template #title="{ item }">
      <nuxt-link :href="item.columns.url" target="_blank">{{ item.columns.title }}</nuxt-link>
    </template>
    <template #published="{ item }">
      {{ item.columns.published ? '公開済み' : '下書き' }}
    </template>
    <template #user="{ item }"> {{ item.columns.user.name }}</template>
  </module-data-table>
</template>
