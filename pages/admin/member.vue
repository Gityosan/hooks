<script setup lang="ts">
import { User, UpdateUserInput, ListUsersQuery } from '~/assets/API'
import { FileInput } from '~/assets/type'
import { memberInputs } from '~/assets/enum'
import { updateUser } from '~/assets/graphql/mutations'
import { listUsers } from '~/assets/graphql/queries'
const { $listQuery, $extendMutation, $filterAttr } = useNuxtApp()
const { myUser, setMyUser } = useMyUser()
const { banEdit } = useEditState()
const { setExistError, setErrorMessages } = useErrorState()
const users = ref<User[]>([])
const form = ref<any>()
useHead({ title: 'メンバー編集' })
const headers = [
  { title: 'アイコン', key: 'file' },
  { title: '名前', key: 'name' },
  { title: 'Eメール', key: 'email' },
  { title: '大学・学校', key: 'university' },
  { title: '学部・学科', key: 'faculty' },
  { title: '就活中', key: 'jobHunting' },
  { title: '加入日', key: 'join' },
  { title: '卒業日', key: 'leave' }
]
const getUsers = async () => {
  users.value = await $listQuery<ListUsersQuery, User>({ query: listUsers })
}
const updateMyUser = async () => {
  const validate = await form.value?.validate()
  if (!validate.valid) {
    setExistError(true)
    setErrorMessages(
      form.value?.errors.map((v: any) => v.errorMessages.map((m: string) => `${v.id}：${m}`)).flat()
    )
    return
  }
  const res = await $extendMutation({
    type: 'update',
    key: input.value.file?.key || '',
    query: updateUser,
    input: $filterAttr(input.value, memberInputs),
    file: input.value.file?.file
  })
  await setMyUser($filterAttr(res as User, memberInputs))
  await getUsers()
}
const input = ref<FileInput<UpdateUserInput>>(JSON.parse(JSON.stringify(myUser.value)))
await getUsers()
</script>
<template>
  <div>
    <div class="d-flex my-2">
      <atom-text text="プロフィール変更" font-size="text-h6" class="my-2" />
      <v-spacer />
      <atom-button :loading="banEdit" text="更新" class="mr-4" @click="updateMyUser()" />
    </div>
    <v-form ref="form">
      <atom-input
        v-for="item in memberInputs"
        :key="item.key"
        v-model="input[item.key]"
        :input="item"
      />
    </v-form>
  </div>
  <module-data-table
    :headers="headers"
    :items="users"
    :custom-columns="['file', 'jobHunting']"
    @fetch-func="getUsers()"
  >
    <template #file="{ item }">
      <atom-icon-img :file="item.columns.file" width="48" class="mx-auto" />
    </template>
    <template #jobHunting="{ item }">
      {{ item.columns.jobHunting ? '就活中' : '未就活' }}
    </template>
  </module-data-table>
</template>
