<script setup lang="ts">
import type { UpdateArticleInput, ListArticlesQuery } from '~/assets/API'
import type { FileInput } from '~/assets/type'
import { articleInputs } from '~/assets/enum'
import { createArticle, deleteArticle } from '~/assets/graphql/mutations'
import { listArticles } from '~/assets/graphql/queries'
const { isAdmin } = useLoginState()
const { ineditable } = useEditState()
const { myUser } = useMyUser()
const articles = ref<UpdateArticleInput[]>([])
const open = ref<boolean>(false)
const form = ref<any>()
const defaultInput = Object.fromEntries(articleInputs.map((v) => [v.key, v.default])) as FileInput<
  Partial<UpdateArticleInput>
>
const input = ref<FileInput<Partial<UpdateArticleInput>>>(defaultInput)
useHead({ title: '記事一覧' })
const headers = [
  { title: 'タイトル', key: 'title' },
  { title: '公開状態', key: 'published' },
  { title: '筆者', key: 'user' },
  { title: '操作', key: 'action' }
]
const getItems = async () => {
  const { data } = await listQuery<ListArticlesQuery, UpdateArticleInput>({
    query: listArticles,
    queryName: 'listArticles',
    filter: isAdmin.value ? {} : { userArticleId: { eq: myUser.value.id || null } }
  })
  if (data.value) articles.value = data.value
}
const createItem = async () => {
  if (!(await checkValidation(form.value))) return
  const excludeAttr = Object.entries(input.value)
    .filter(([_, v]) => v === null)
    .map(([k, _]) => k)
  await extendMutation({
    type: 'create',
    key: input.value.file?.key || '',
    query: createArticle,
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
    <atom-text text="記事" line-height="line-height-lg" />
    <v-spacer />
    <atom-button-outlined
      text="アイテムの追加"
      icon="mdi-plus-circle"
      :disabled="ineditable"
      @click="open = true"
    />
  </div>
  <module-data-table
    :headers="headers"
    :items="articles"
    :custom-columns="['published', 'user']"
    class="mb-15"
    @fetch="getItems"
    @edit="(id) => navigateTo(`/admin/article/${id}`)"
    @delete="
      (id) =>
        extendMutation({
          type: 'delete',
          key: input.file?.key || '',
          query: deleteArticle,
          input: { id }
        })
    "
  >
    <template #published="{ item }">
      {{ item.published ? '公開済み' : '非公開' }}
    </template>
    <template #user="{ item }">{{ item.user.name }}</template>
  </module-data-table>
  <v-dialog v-model="open" persistent>
    <v-card class="pa-5">
      <div class="d-flex align-center py-3 bg-white" style="gap: 0 8px">
        <atom-text text="新規作成" line-height="line-height-lg" />
        <v-spacer />
        <atom-button-outlined
          text="キャンセル"
          icon="mdi-close"
          :disabled="ineditable"
          @click="open = false"
        />
        <atom-button-outlined
          text="保存"
          icon="mdi-content-save"
          :disabled="ineditable"
          @click="createItem()"
        />
      </div>
      <v-form ref="form">
        <atom-input
          v-for="i in articleInputs"
          :key="i.key"
          v-model="input[i.key as keyof typeof input]"
          :input="i"
        />
      </v-form>
    </v-card>
  </v-dialog>
</template>
