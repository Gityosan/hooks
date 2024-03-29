<script setup lang="ts">
import { validation } from '~/assets/validation'
import type { User, GetUserQuery } from '~/assets/API'
import { getUser } from '~/assets/graphql/queries'
const config = useRuntimeConfig()
const { ineditable } = useEditState()
const { params } = useRoute()
const tab = ref<string>('')
const name = ref<string>('')
const body = ref<string>('')
const user = ref<User>({} as User)
const form = ref<any>(null)
const fetchUser = async () => {
  const { data } = await getQuery<GetUserQuery, User>({
    query: getUser,
    queryName: 'getUser',
    variables: { id: params.id }
  })
  if (data.value) {
    user.value = data.value
    useHead({ title: user.value.name })
  }
}
const submit = async () => {
  if (!(await checkValidation(form.value))) return
  const content =
    'TO: <@' +
    user.value.discordId +
    '>\n「' +
    name.value +
    '」さんからお問い合わせがありました！\n\nお問い合わせ内容\n' +
    body.value
  if (!config.public.discordWebhook) return
  await baseFetch(config.public.discordWebhook, () => ({
    method: 'POST',
    body: JSON.stringify({
      username: 'Hooksからのお問い合わせ',
      content
    }),
    headers: { 'Content-Type': 'application/json' }
  }))
}
const tabs = [
  '就活プロフィール',
  '経歴',
  'ポートフォリオ',
  '書いた記事',
  '参加したプロジェクト',
  '参加したイベント'
]
await fetchUser()
</script>
<template>
  <atom-breadcrumbs
    class="my-5"
    :items="[
      { title: 'member', to: '/member', disabled: false },
      {
        title: user?.name || 'you',
        to: '/member/' + user?.id,
        disabled: true
      }
    ]"
  />
  <module-user-large :user="user" class="my-8" />
  <v-card class="rounded-lg mb-16">
    <v-tabs v-model="tab" :items="tabs">
      <!-- <v-tab v-for="t in tabs" :key="t" :value="t" /> -->
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="tabs[0]">
        <div class="ma-5">{{ user.forRecruitment }}</div>
      </v-window-item>
      <v-window-item :value="tabs[1]">
        <div class="pa-5">{{ user.history }}</div>
      </v-window-item>
      <v-window-item :value="tabs[2]">
        <div class="d-flex flex-wrap">
          <module-content-medium
            v-for="item in user?.portfolio?.items"
            :key="item?.id"
            :created-at="item?.createdAt"
            :updated-at="item?.updatedAt"
            :title="item?.title"
            :img-key="item?.file?.key"
            :identity-id="item?.file?.identityId"
            class="v-col-12 v-col-sm-6 v-col-md-4"
            @click="navigateTo('/portfolio/' + item?.id)"
          />
        </div>
      </v-window-item>
      <v-window-item :value="tabs[3]">
        <div class="d-flex flex-wrap">
          <module-content-medium
            v-for="item in user?.article?.items"
            :key="item?.id"
            :created-at="item?.createdAt"
            :updated-at="item?.updatedAt"
            :title="item?.title"
            :img-key="item?.file?.key"
            :identity-id="item?.file?.identityId"
            class="v-col-12 v-col-sm-6 v-col-md-4"
            @click="navigateTo('/article/' + item?.id)"
          />
        </div>
      </v-window-item>
      <v-window-item :value="tabs[4]">
        <div class="d-flex flex-wrap">
          <module-content-medium
            v-for="item in user?.project?.items"
            :key="item?.project.id"
            :created-at="item?.project.createdAt"
            :updated-at="item?.project.updatedAt"
            :title="item?.project.title"
            :img-key="item?.project.file?.key"
            :identity-id="item?.project.file?.identityId"
            class="v-col-12 v-col-sm-6 v-col-md-4"
            @click="navigateTo('/project/' + item?.project.id)"
          />
        </div>
      </v-window-item>
      <v-window-item :value="tabs[5]">
        <div class="d-flex flex-wrap">
          <module-content-medium
            v-for="item in user?.event?.items"
            :key="item?.event.id"
            :created-at="item?.event.createdAt"
            :updated-at="item?.event.updatedAt"
            :title="item?.event.title"
            :img-key="item?.event.file?.key"
            :identity-id="item?.event.file?.identityId"
            class="v-col-12 v-col-sm-6 v-col-md-4"
            @click="navigateTo('/event/' + item?.event.id)"
          />
        </div>
      </v-window-item>
    </v-window>
  </v-card>
  <v-form ref="form" class="rounded-lg bg-white pa-5 elevation-3 mb-10">
    <atom-text
      :text="(user.name || 'このメンバー') + 'にメッセージを送る'"
      font-size="text-h6"
      class="pb-5"
    />
    <atom-text text="お名前" class="mb-2" />
    <v-text-field
      id="お名前"
      v-model="name"
      variant="outlined"
      density="compact"
      clearable
      :rules="[validation.required, validation.maxString(30)]"
      counter="30"
      class="mb-5"
    />
    <atom-text text="ご用件" class="mb-2" />
    <v-textarea
      id="ご用件"
      v-model="body"
      variant="outlined"
      density="compact"
      clearable
      :rules="[validation.required, validation.maxString(500)]"
      counter="500"
      class="mb-5"
    />
    <atom-button-outlined text="送信" class="w-100" :loading="ineditable" @click="submit()" />
  </v-form>
</template>
