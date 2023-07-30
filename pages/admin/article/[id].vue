<script setup lang="ts">
import { Article, UpdateArticleInput, GetArticleQuery } from '~/assets/API'
import { FileInput } from '~/assets/type'
import { articleInputs } from '~/assets/enum'
import { createArticle, deleteArticle, updateArticle } from '~/assets/graphql/mutations'
import { listArticles } from '~/assets/graphql/queries'
const { $getQuery, $extendMutation, $filterAttr } = useNuxtApp()
const { params } = useRoute()
const { banEdit } = useEditState()
const { setExistError, setErrorMessages } = useErrorState()
const article = ref<Article>()
const form = ref<any>()
useHead({ title: '記事編集' })
const getArticle = async () => {
  article.value = await $getQuery<GetArticleQuery, Article>({
    query: listArticles,
    variables: { id: params.id }
  })
}
const mutateArticle = async () => {
  const validate = await form.value?.validate()
  if (!validate.valid) {
    setExistError(true)
    setErrorMessages(
      form.value?.errors.map((v: any) => v.errorMessages.map((m: string) => `${v.id}：${m}`)).flat()
    )
    return
  }
  await $extendMutation({
    type: input.value.id ? 'update' : 'create',
    key: input.value.file?.key || '',
    query: input.value.id ? updateArticle : createArticle,
    input: input.value.id
      ? $filterAttr(input.value, articleInputs)
      : $filterAttr(input.value, articleInputs, ['id']),
    file: input.value.file?.file
  })
  await getArticle()
}
const defaultInput = Object.fromEntries(articleInputs.map((v) => [v.key, v.default]))
const input = ref<FileInput<Partial<UpdateArticleInput>>>(defaultInput)
await getArticle()
</script>
<template>
  <div class="position-relative">
    <div class="d-flex py-5 position-sticky top-0 right-0 bg-white z-index-2">
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
        @click="mutateArticle()"
      />
    </div>
    <v-form ref="form">
      <atom-input
        v-for="item in articleInputs"
        :key="item.key"
        v-model="input[item.key]"
        :input="item"
      />
    </v-form>
  </div>
</template>
