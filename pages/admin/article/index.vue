<script setup lang="ts">
import { Article, UpdateArticleInput, ListArticlesQuery } from '~/assets/API'
import { FileInput } from '~/assets/type'
import { articleInputs } from '~/assets/enum'
import { createArticle, deleteArticle } from '~/assets/graphql/mutations'
import { listArticles } from '~/assets/graphql/queries'
const { $listQuery, $extendMutation, $checkValidation, $filterAttr } = useNuxtApp()
const { isAdmin } = useLoginState()
const { banEdit } = useEditState()
const { myUser } = useMyUser()
const articles = ref<Article[]>([])
const form = ref<any>()
const defaultInput = Object.fromEntries(articleInputs.map((v) => [v.key, v.default]))
const input = ref<FileInput<UpdateArticleInput>>(defaultInput as UpdateArticleInput)

useHead({ title: '記事一覧' })
const headers = [
  { title: '操作', key: 'action' },
  { title: 'タイトル', key: 'title' },
  { title: '公開・下書き', key: 'published' },
  { title: '筆者', key: 'user' }
]
const getItems = async () => {
  articles.value = await $listQuery<ListArticlesQuery, Article>({
    query: listArticles,
    filter: isAdmin.value ? {} : { userArticleId: { eq: myUser.value.id || null } }
  })
}
const createItem = async () => {
  if (!(await $checkValidation(form.value))) return
  await $extendMutation({
    type: 'create',
    key: input.value.file?.key || '',
    query: createArticle,
    input: $filterAttr(input.value, articleInputs),
    file: input.value.file?.file
  })
  await getItems()
}

await getItems()
</script>
<template>
  <atom-text text="記事一覧" class="pt-5 pb-2" />
  <module-data-table
    :headers="headers"
    :items="articles"
    :custom-columns="['published', 'user']"
    @fetch-func="getItems()"
    @edit-func="(id) => navigateTo(`/admin/article/${id}`)"
    @delete-func="
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
  <div class="d-flex align-center pt-5 pb-3">
    <atom-text text="新規作成" />
    <v-spacer />
    <atom-icon-tooltip
      text="保存"
      icon="mdi-content-save"
      color="text-green"
      :loading="banEdit"
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
</template>
