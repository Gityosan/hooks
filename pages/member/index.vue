<script setup lang="ts">
import { ListUsersQuery, User } from '~/assets/API'
import { listUsers } from '~/assets/graphql/queries'
const users = ref<User[]>([])
useHead({ title: 'ユーザー一覧' })
const getUsers = async () => {
  const { data } = await listQuery<ListUsersQuery, User>({
    query: listUsers,
    queryName: 'listUsers'
  })
  if (data.value) users.value = data.value
}
await getUsers()
</script>
<template>
  <atom-text font-size="text-h4" text="Member" class="py-10" />
  <div class="d-flex flex-wrap mb-10" style="gap: 60px 0">
    <module-user-medium
      v-for="item in users"
      :key="item.id"
      :user="item"
      class="pa-5 v-col-12 v-col-sm-6 v-col-md-4"
    />
  </div>
</template>
