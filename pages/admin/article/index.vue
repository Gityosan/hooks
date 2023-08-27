<script setup lang="ts">
import { Article, UpdateArticleInput, ListArticlesQuery } from '~/assets/API'
import { FileInput } from '~/assets/type'
import { articleInputs } from '~/assets/enum'
import { createArticle, deleteArticle } from '~/assets/graphql/mutations'
import { listArticles } from '~/assets/graphql/queries'
const { $listQuery, $extendMutation } = useNuxtApp()
const { isAdmin } = useLoginState()
const { banEdit } = useEditState()
const { myUser } = useMyUser()
const articles = ref<Article[]>([])
const open = ref<boolean>(false)
const form = ref<any>()
const defaultInput = Object.fromEntries(
  articleInputs.map((v) => [v.key, v.default])
) as UpdateArticleInput
const input = ref<FileInput<UpdateArticleInput>>(defaultInput)
useHead({ title: '記事一覧' })
const headers = [
  { title: 'タイトル', key: 'title' },
  { title: '公開・下書き', key: 'published' },
  { title: '筆者', key: 'user' },
  { title: '操作', key: 'action' }
]
const getItems = async () => {
  articles.value = await $listQuery<ListArticlesQuery, Article>({
    query: listArticles,
    filter: isAdmin.value ? {} : { userArticleId: { eq: myUser.value.id || null } }
  })
}
const createItem = async () => {
  if (!(await checkValidation(form.value))) return
  const excludeAttr = Object.entries(input.value)
    .filter(([_, v]) => v === null)
    .map(([k, _]) => k)
  const res = await $extendMutation({
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
    <atom-button text="アイテムの追加" :disabled="banEdit" @click="open = true">
      <v-icon icon="mdi-plus-circle" size="18" class="mr-1" style="margin-bottom: 2px" />
    </atom-button>
  </div>
  <module-data-table
    :headers="headers"
    :items="articles"
    :custom-columns="['published', 'user']"
    class="mb-15"
    @fetch="getItems()"
    @edit="(id) => navigateTo(`/admin/article/${id}`)"
    @delete="
      (id) =>
        $extendMutation({
          type: 'delete',
          key: input.file?.key || '',
          query: deleteArticle,
          input: { id }
        })
    "
  >
    <template #published="{ item }">
      {{ item.columns.published ? '公開済み' : '下書き' }}
    </template>
    <template #user="{ item }">{{ item.columns.user.name }}</template>
  </module-data-table>
  <v-dialog v-model="open" persistent>
    <v-card class="pa-5">
      <div class="d-flex align-center py-3 bg-white" style="gap: 0 8px">
        <atom-text text="新規作成" line-height="line-height-lg" />
        <v-spacer />
        <atom-button text="キャンセル" :disabled="banEdit" @click="open = false">
          <v-icon icon="mdi-close" size="18" class="mr-1" />
        </atom-button>
        <atom-button text="保存" :disabled="banEdit" @click="createItem()">
          <v-icon icon="mdi-content-save" size="18" class="mr-1" />
        </atom-button>
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
