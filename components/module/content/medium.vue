<script setup lang="ts">
const isHovering = ref<boolean>(false)
const imageUrl = ref<string>('/no_image.png')
const Props = withDefaults(
  defineProps<{
    createdAt: string
    updatedAt: string
    title: string | null
    imgKey: string
    identityId: string
  }>(),
  {
    createdAt: '',
    updatedAt: '',
    title: '',
    imgKey: '',
    identityId: ''
  }
)
imageUrl.value = await getImage(Props.imgKey, Props.identityId)
</script>
<template>
  <div
    class="bg-white elevation-1 pa-4 rounded-lg transition-short-ease-out"
    :style="{ transform: isHovering ? 'scale(1.05)' : 'scale(1.0)' }"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <v-img :src="imageUrl" :aspect-ratio="16 / 9" cover />
    <div class="d-flex flex-nowrap my-3 ml-1" style="gap: 0 10px">
      <atom-text font-size="text-caption" font-weight="font-weight-regular">
        <v-icon icon="mdi-cloud-upload-outline" size="14" class="mr-1 align-text-bottom" />
        <span>{{ getYMD(createdAt) }}</span>
      </atom-text>
      <atom-text font-size="text-caption" font-weight="font-weight-regular">
        <v-icon icon="mdi-autorenew" size="14" class="mr-1 align-text-bottom" />
        <span>{{ getYMD(updatedAt) }}</span>
      </atom-text>
    </div>
    <atom-text
      :text="title"
      line-height="line-height-lg"
      class="my-2 mx-1 line-clamp-3 height-72"
      @click="$emit('click-func')"
    />
    <slot :is-hovering="isHovering" />
  </div>
</template>
