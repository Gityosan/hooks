<script setup lang="ts">
import { Hub } from 'aws-amplify'
import { HubCapsule } from '@aws-amplify/core'
import { Regexp } from '~/assets/enum'
useHead({ titleTemplate: (title) => `${title} | Hooks` })
const { path } = useRoute()
const { setSignedIn } = useLoginState()
const { addSnackbar } = useSnackbar()
const listener = (data: HubCapsule) => {
  if (data.payload.event === 'signOut') {
    addSnackbar({ type: 'info', text: 'ログアウトしました' })
    setSignedIn(false)
    if (!Regexp.public.test(path)) return navigateTo('/login')
  }
  if (data.payload.event === 'signIn') {
    addSnackbar({ text: 'ログインしました' })
    setSignedIn(true)
    navigateTo('/admin')
  }
}
const hubListenerCancel = Hub.listen('auth', listener)
onUnmounted(() => {
  hubListenerCancel()
})
</script>
<template>
  <atom-snackbar-list />
  <atom-modal-error />
  <NuxtLayout :name="$route.path.includes('admin') ? 'admin' : 'default'" />
</template>
