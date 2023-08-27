<script setup lang="ts">
import { User, GetUserQuery } from '~/assets/API'
import { Greetings } from '~/assets/enum'
import { getUser } from '~/assets/graphql/queries'
const { $getQuery } = useNuxtApp()
const { myUser, cognitoUser } = useMyUser()
const user = ref<User>({} as User)
const randomIndex = Math.floor(Math.random() * Greetings().length)
useHead({ title: 'Admin Top' })
const fetchUser = async () => {
  if (!myUser.value.id) return
  user.value = await $getQuery<GetUserQuery, User>({
    query: getUser,
    variables: { id: myUser.value.id }
  })
}
console.log(myUser.value)
await fetchUser()
console.log(cognitoUser.value)
</script>
<template>
  <div class="d-flex">
    <v-img src="mushimegane_man.png" class="width-42 height-64 mx-3 flex-grow-0" />
    <div class="ma-2 pa-3 rounded-lg bg-grey-darken-3">
      <atom-text
        :text="Greetings(myUser?.name || '')[randomIndex]"
        color="text-white"
        line-height="line-height-lg"
      />
    </div>
    <v-spacer />
  </div>
  <module-user-large :user="myUser as User" class="ma-5" />
</template>
