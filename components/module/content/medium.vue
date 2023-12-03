<script setup lang="ts">
const isHovering = ref<boolean>(false)
const imageUrl = ref<string>('/no_image.png')
const props = withDefaults(
  defineProps<{
    createdAt?: string
    userName?: string | null
    title?: string | null
    imgKey?: string
    identityId?: string
  }>(),
  {
    createdAt: '',
    userName: '',
    title: '',
    imgKey: '',
    identityId: ''
  }
)
imageUrl.value = await getImage(props.imgKey, props.identityId)
</script>
<template>
  <div>
    <slot name="upper" :is-hovering="isHovering" />
    <v-img
      :src="imageUrl"
      :aspect-ratio="16 / 9"
      cover
      class="rounded-lg elevation-1 transition-short-ease-out"
      :style="{ transform: isHovering ? 'scale(1.05)' : 'scale(1.0)' }"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
    />
    <slot name="underImage" :is-hovering="isHovering" />
    <div class="d-flex flex-wrap align-center my-3 ml-1" style="gap: 0 10px">
      <atom-text
        v-if="createdAt"
        comp="span"
        color="text-grey-darken-2"
        font-size="text-caption"
        font-weight="font-weight-regular"
        line-height="line-height-xs"
      >
        <v-icon icon="mdi-clock-time-three-outline" size="14" class="mr-1 align-text-bottom" />
        <span>{{ getYMD(createdAt) }}</span>
      </atom-text>
      <atom-text
        v-if="userName"
        comp="span"
        color="text-grey-darken-2"
        font-size="text-caption"
        font-weight="font-weight-regular"
        line-height="line-height-xs"
      >
        <v-icon icon="mdi-account-outline" size="14" class="mr-1 align-text-bottom" />
        <span>{{ userName }}</span>
      </atom-text>
      <slot name="meta" :is-hovering="isHovering" />
    </div>
    <slot />
    <atom-text
      :text="title"
      line-height="line-height-lg"
      class="my-2 mx-1 line-clamp-3 min-height-72"
    />
    <slot name="lower" :is-hovering="isHovering" />
  </div>
</template>
