<script setup lang="ts">
import { S3Object } from '~~/assets/API'
const { $makeS3Object } = useNuxtApp()
const props = withDefaults(defineProps<{ modelValue: S3Object | null }>(), { modelValue: null })
const emit = defineEmits<{
  (e: 'update:model-value', value: any): void
}>()
const resetFileObject = () => {
  files.value = []
  imageURL.value = ''
  emit('update:model-value', null)
}
const emitImg = async () => {
  if (!files.value.length) return
  const data = await $makeS3Object(files.value[0])
  emit('update:model-value', data)
}
const onImagePicked = async (e: Event) => {
  const images = (e.target as HTMLInputElement)?.files
  if (!images) return
  if (Array.from(images).some((v) => v.size >= 5 * 1024 * 1024)) {
    alert('アップロード可能な画像サイズは5MBまでです')
    return
  }
  if (images) files.value = [...images]
  await emitImg()
}
const onDrop = async (e: DragEvent) => {
  if (!e.dataTransfer?.files) return
  files.value = [...e.dataTransfer.files]
  await emitImg()
  isDropOvering.value = false
}
const onDragOver = (e: DragEvent) => {
  isDropOvering.value = true
}
const onDragLeave = (e: DragEvent) => {
  isDropOvering.value = false
}
const isDropOvering = ref<boolean>(false)
const files = ref<File[]>([])
const imageURL = ref<string>('')
imageURL.value = await typeSafetyImage(props.modelValue)
watch(props, async (_, c) => {
  imageURL.value = await typeSafetyImage(props.modelValue)
})
</script>
<template>
  <div
    class="w-100 height-200 bg-grey-lighten-4 rounded border-width-1 border-dotted border-grey-lighten-1 position-relative"
  >
    <v-img v-if="imageURL" :src="imageURL" :aspect-ratio="16 / 9" class="max-height-198" />
    <v-hover v-slot="{ isHovering, props: hover }">
      <div
        class="w-100 h-100 pa-10 d-flex flex-column justify-center align-center position-absolute top-0 left-0 transition-short-ease-out"
        :class="[
          { 'bg-black': isDropOvering || (imageURL && isHovering) },
          isDropOvering || (imageURL && isHovering)
            ? 'opacity-dot8'
            : imageURL
            ? 'opacity-dot0'
            : 'opacity-dot10'
        ]"
        v-bind="hover"
        @drop.stop.prevent="onDrop($event)"
        @dragover.stop.prevent="onDragOver($event)"
        @dragleave.stop.prevent="onDragLeave($event)"
      >
        <atom-text
          text="ここにドラッグ&ドロップ"
          :color="imageURL ? 'text-white' : 'text-grey-darken-1'"
          line-height="line-height-lg"
          class="mb-4"
        />
        <atom-text
          text="または"
          :color="imageURL ? 'text-white' : 'text-grey-darken-1'"
          line-height="line-height-lg"
          class="mb-4"
        />
        <atom-button
          v-if="imageURL"
          text="リセット"
          icon="mdi-close"
          class="bg-white rounded border-solid border-width-1 border-grey-lighten-1"
          @click="resetFileObject()"
        />
        <label
          v-else
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
    </v-hover>
  </div>
</template>
