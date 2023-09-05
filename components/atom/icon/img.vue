<script setup lang="ts">
import { S3ObjectInput } from '~/assets/API'
const props = withDefaults(
  defineProps<{
    src?: string | null
    file?: S3ObjectInput | null
    width?: string
  }>(),
  {
    width: 'auto'
  }
)
const imageUrl = ref<string>(props.src || '')
onMounted(async () => {
  if (props.file?.key && props.file?.identityId)
    imageUrl.value = await getImage(props.file.key, props.file.identityId)
})
</script>
<template>
  <v-img
    :src="imageUrl"
    :width="width"
    :aspect-ratio="1 / 1"
    cover
    style="aspect-ratio: 1"
    class="rounded-pill"
  />
</template>
