<script setup lang="ts">
withDefaults(
  defineProps<{
    text: string
    color: string
    bgColor: string
    borderStyle: string
    textClass: string
    loading: boolean
  }>(),
  {
    text: '',
    color: 'main-color',
    bgColor: 'white',
    borderStyle: '',
    textClass: '',
    loading: false
  }
)
const isHovering = ref<boolean>(false)
</script>
<template>
  <v-btn
    class="height-40 px-4 py-2 transition-short-ease"
    :class="[isHovering ? `bg-${color}` : `bg-${bgColor}`, `border-${color}`, borderStyle]"
    :loading="loading"
    :ripple="false"
    variant="outlined"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <slot />
    <atom-text
      :text="text"
      line-height="line-height-lg"
      :color="isHovering ? `text-${bgColor}` : `text-${color}`"
      :class="[textClass]"
    />
  </v-btn>
</template>
