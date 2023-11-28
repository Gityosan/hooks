<script setup lang="ts">
import type { User } from '~/assets/API'
import { Greetings } from '~/assets/enum'
const { myUser, cognitoUser } = useMyUser()
const randomIndex = Math.floor(Math.random() * Greetings().length)
useHead({ title: 'Admin Top' })
console.debug(cognitoUser.value)
console.debug(myUser.value)
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
