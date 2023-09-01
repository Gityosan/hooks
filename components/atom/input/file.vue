<script setup lang="ts">
import { S3Object } from '~~/assets/API'
const { $makeS3Object } = useNuxtApp()
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
const resetFileObject = () => {
  files.value = []
  imageURL.value = ''
}
const emitImg = async () => {
  if (!files.value.length) return
  const data = await $makeS3Object(files.value[0])
  emit('update:model-value', data)
}
const onImagePicked = async (e: Event) => {
  const images = (e.target as HTMLInputElement)?.files
  if (images) files.value = Array.from(images)
  await emitImg()
}
const onDrop = async (e: DragEvent) => {
  if (!e.dataTransfer) return
  files.value = Array.from(e.dataTransfer.files)
  await emitImg()
}
const files = ref<File[]>([])
const imageURL = ref<string>('')
imageURL.value = await typeSafetyImage(props.modelValue)
watch(files, (_, c) => {
  imageURL.value = URL.createObjectURL(files.value[0])
})
</script>
<template>
  <div
    class="w-100 height-200 bg-grey-lighten-4 rounded border-width-1 border-dotted border-grey-lighten-1"
  >
    <v-img v-if="imageURL" :src="imageURL" :aspect-ratio="16 / 9" class="max-height-198" />
    <div
      v-else
      class="pa-10 d-flex flex-column justify-center align-center"
      @drop.stop="onDrop($event)"
    >
      <atom-text
        text="ここにドラッグ&ドロップ"
        color="text-grey-darken-1"
        line-height="line-height-lg"
        class="mb-4"
      />
      <atom-text
        text="または"
        color="text-grey-darken-1"
        line-height="line-height-lg"
        class="mb-4"
      />
      <label
        class="px-4 py-2 d-flex align-center bg-white rounded border-solid border-width-1 border-grey-lighten-1 cursor-pointer"
      >
        <v-icon icon="mdi-folder-open" class="mr-2" />
        <atom-text text="ファイルを選択" />
        <input
          type="file"
          accept="image/png, image/jpeg, image/gif"
          class="d-none"
          @input="onImagePicked($event)"
        />
      </label>
    </div>
  </div>
</template>
