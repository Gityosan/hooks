<script setup lang="ts">
import { S3Object } from '~~/assets/API'
const { $getImage, $makeS3Object } = useNuxtApp()
const imageURL = ref<string>('')
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
const onImagePicked = async (f: File[]) => {
  console.log('c.modelValue')
  // const t = e.target as HTMLInputElement
  // if (!t.files?.length) return
  if (!f.length) return
  const v = props.modelValue
  if (v && 'key' in v && 'identityId' in v) {
    imageURL.value = await $getImage(v.key, v.identityId)
  } else imageURL.value = URL.createObjectURL(f[0])
  const data = await $makeS3Object(f[0])
  emit('update:model-value', data)
}
watch(props, (_, c) => {
  console.log(c.modelValue)
})
const resetImage = () => {
  emit('update:model-value', null)
  imageURL.value = ''
}
const makeValue = (v: S3Object | null) => {
  if (!v || !('name' in v)) return []
  const file = new File([], v.name, { type: v.type || '' })
  return [file]
}
</script>
<template>
  <v-file-input
    density="compact"
    clearable
    class="text-main-color"
    variant="underlined"
    accept="image/*"
    :model-value="makeValue(modelValue)"
    @update:model-value="onImagePicked($event)"
    @click:clear="resetImage()"
    @change="onImagePicked($event)"
  ></v-file-input>
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
