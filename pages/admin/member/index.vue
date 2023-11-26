<script setup lang="ts">
import { UpdateUserInput, ListUsersQuery } from '~/assets/API'
import { FileInput } from '~/assets/type'
import { userInputs } from '~/assets/enum'
import { createUser, deleteUser } from '~/assets/graphql/mutations'
import { listUsers } from '~/assets/graphql/queries'
const { isAdmin } = useLoginState()
const { banEdit } = useEditState()
const { myUser } = useMyUser()
const users = ref<UpdateUserInput[]>([])
const open = ref<boolean>(false)
const form = ref<any>()
const defaultInput = Object.fromEntries(userInputs.map((v) => [v.key, v.default])) as FileInput<
  Partial<UpdateUserInput>
>
const input = ref<FileInput<Partial<UpdateUserInput>>>(defaultInput)
useHead({ title: 'メンバー一覧' })
const headers = [
  { title: 'アイコン', key: 'file' },
  { title: '名前', key: 'name' },
  { title: 'Eメール', key: 'email' },
  { title: '大学・学校', key: 'university' },
  { title: '学部・学科', key: 'faculty' },
  { title: '就活中', key: 'jobHunting' },
  { title: '加入日', key: 'join' },
  { title: '卒業日', key: 'leave' },
  { title: '操作', key: 'action' }
]
const getItems = async () => {
  const { data } = await listQuery<ListUsersQuery, UpdateUserInput>({
    query: listUsers,
    queryName: 'listUsers',
    filter: isAdmin.value ? {} : { userUserId: { eq: myUser.value.id || null } }
  })
  if (data.value) users.value = data.value
}
const createItem = async () => {
  if (!(await checkValidation(form.value))) return
  const excludeAttr = Object.entries(input.value)
    .filter(([_, v]) => v === null)
    .map(([k, _]) => k)
  await extendMutation({
    type: 'create',
    key: input.value.file?.key || '',
    query: createUser,
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
    <atom-text text="メンバー" line-height="line-height-lg" />
    <v-spacer />
    <atom-button-outlined
      text="アイテムの追加"
      :disabled="banEdit"
      icon="mdi-plus-circle"
      @click="open = true"
    />
  </div>
  <module-data-table
    :headers="headers"
    :items="users"
    :custom-columns="['file', 'jobHunting']"
    class="mb-15"
    @fetch="getItems()"
    @edit="(id) => navigateTo(`/admin/user/${id}`)"
    @delete="
      (id) =>
        extendMutation({
          type: 'delete',
          key: input.file?.key || '',
          query: deleteUser,
          input: { id }
        })
    "
  >
    <template #file="{ item }">
      <atom-icon-img :file="item.columns.file" width="40" class="mx-auto my-1 rounded-circle" />
    </template>
    <template #jobHunting="{ item }">
      {{ item.columns.jobHunting ? '就活中' : '未就活' }}
    </template>
  </module-data-table>
  <v-dialog v-model="open" persistent>
    <v-card class="pa-5">
      <div class="d-flex align-center py-3 bg-white" style="gap: 0 8px">
        <atom-text text="新規作成" line-height="line-height-lg" />
        <v-spacer />
        <atom-button text="キャンセル" :disabled="banEdit" icon="mdi-close" @click="open = false" />
        <atom-button
          text="保存"
          :disabled="banEdit"
          icon="mdi-content-save"
          @click="createItem()"
        />
      </div>
      <v-form ref="form">
        <atom-input
          v-for="i in userInputs"
          :key="i.key"
          v-model="input[i.key as keyof typeof input]"
          :input="i"
        />
      </v-form>
    </v-card>
  </v-dialog>
</template>
