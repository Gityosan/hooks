<script setup lang="ts">
withDefaults(
  defineProps<{
    text: string
    color: string
    disabled: boolean
    variant: 'small' | 'medium' | 'large'
  }>(),
  {
    text: '',
    color: 'black',
    disabled: false,
    variant: 'medium'
  }
)
const isHovering = ref<boolean>(false)
</script>
<template>
  <button
    class="transition-short-ease bg-white border-solid border-width-1 border-grey-lighten-1 rounded d-flex align-center py-2"
    :class="[
      variant === 'medium' ? 'px-4 height-37' : 'px-2 height-34',
      {
        'opacity-dot5': disabled,
        'opacity-dot7': !disabled && isHovering,
        'cursor-not-allowed': disabled
      }
    ]"
    :disabled="disabled"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <slot />
    <atom-text
      v-if="text"
      :text="text"
      :font-size="variant === 'medium' ? 'text-subtitle-2' : 'text-caption'"
      line-height="line-height-lg"
      :color="`text-${color}`"
    />
  </button>
</template>
