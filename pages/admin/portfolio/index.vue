<script setup lang="ts">
import type { UpdatePortfolioInput, ListPortfoliosQuery } from '~/assets/API'
import type { FileInput } from '~/assets/type'
import { portfolioInputs } from '~/assets/enum'
import { createPortfolio, deletePortfolio } from '~/assets/graphql/mutations'
import { listPortfolios } from '~/assets/graphql/queries'
const { isAdmin } = useLoginState()
const { ineditable } = useEditState()
const { myUser } = useMyUser()
const portfolios = ref<UpdatePortfolioInput[]>([])
const open = ref<boolean>(false)
const form = ref<any>()
const defaultInput = Object.fromEntries(
  portfolioInputs.map((v) => [v.key, v.default])
) as FileInput<Partial<UpdatePortfolioInput>>
const input = ref<FileInput<Partial<UpdatePortfolioInput>>>(defaultInput)
useHead({ title: 'ポートフォリオ一覧' })
const headers = [
  { title: 'タイトル', key: 'title' },
  { title: '公開・下書き', key: 'published' },
  { title: '作者', key: 'user' },
  { title: '操作', key: 'action' }
]
const getItems = async () => {
  const { data } = await listQuery<ListPortfoliosQuery, UpdatePortfolioInput>({
    query: listPortfolios,
    queryName: 'listPortfolios',
    filter: isAdmin.value ? {} : { userPortfolioId: { eq: myUser.value.id || null } }
  })
  if (data.value) portfolios.value = data.value
}
const createItem = async () => {
  if (!(await checkValidation(form.value))) return
  const excludeAttr = Object.entries(input.value)
    .filter(([_, v]) => v === null)
    .map(([k, _]) => k)
  await extendMutation({
    type: 'create',
    key: input.value.file?.key || '',
    query: createPortfolio,
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
    <atom-text text="ポートフォリオ" line-height="line-height-lg" />
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
    :items="portfolios"
    :custom-columns="['title', 'published', 'user']"
    class="mb-15"
    @fetch="getItems"
    @edit="(id) => navigateTo(`/admin/portfolio/${id}`)"
    @delete="
      (id) =>
        extendMutation({
          type: 'delete',
          key: input.file?.key || '',
          query: deletePortfolio,
          input: { id }
        })
    "
  >
    <template #title="{ item }">
      <nuxt-link :href="item.url" target="_blank">{{ item.title }}</nuxt-link>
    </template>
    <template #published="{ item }">
      {{ item.published ? '公開済み' : '下書き' }}
    </template>
    <template #user="{ item }"> {{ item.user.name }}</template>
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
          v-for="i in portfolioInputs"
          :key="i.key"
          v-model="input[i.key as keyof typeof input]"
          :input="i"
        />
      </v-form>
    </v-card>
  </v-dialog>
</template>
