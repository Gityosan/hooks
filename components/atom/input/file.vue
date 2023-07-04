<script setup lang="ts">
import { S3Object } from '~~/assets/API'
const { $makeS3Object, $typeSafetyImage } = useNuxtApp()
const props = withDefaults(
  defineProps<{
    modelValue: S3Object | null
  }>(),
  {
    modelValue: null
  }
)
const emit = defineEmits<{
  (e: 'update:model-value', value: any): void
}>()
const setFileObject = async (v: S3Object | null) => {
  if (!v || !('name' in v)) return []
  files.value = [new File([], v.name, { type: v.type || '' })]
}
const resetFileObject = () => {
  files.value = []
  imageURL.value = ''
}
const onImagePicked = async () => {
  if (!files.value.length) return
  const data = await $makeS3Object(files.value[0])
  emit('update:model-value', data)
}
const files = ref<File[]>([])
const imageURL = ref<string>('')
imageURL.value = await $typeSafetyImage(props.modelValue)
await setFileObject(props.modelValue)
watch(props, async (_, c) => {
  imageURL.value = await $typeSafetyImage(c.modelValue)
  await setFileObject(c.modelValue)
})
</script>
<template>
  <v-file-input
    v-model="files"
    density="compact"
    clearable
    class="text-main-color"
    variant="underlined"
    accept="image/*"
    @click:clear="resetFileObject()"
    @change="onImagePicked()"
  />
  <div class="w-100 height-200 rounded-lg border-width-1 border-solid border-main-color">
    <v-img v-if="imageURL" :src="imageURL" :aspect-ratio="16 / 9" class="max-height-198" />
    <atom-text
      v-else
      text="ここに画像が表示されます"
      line-height="line-height-72"
      class="w-100 text-center my-16"
    />
  </div>
</template>
