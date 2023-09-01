<script setup lang="ts">
withDefaults(
  defineProps<{
    text: string
    icon: string
    src: string
    disabled: boolean
    variant: 'small' | 'medium' | 'large'
  }>(),
  {
    text: '',
    icon: '',
    src: '',
    disabled: false,
    variant: 'medium'
  }
)
const isHovering = ref<boolean>(false)
</script>
<template>
  <button
    type="button"
    :disabled="disabled"
    class="pl-3 pr-4 py-2 d-flex align-center"
    :class="[disabled ? 'opacity-dot3 cursor-not-allowed' : { 'opacity-dot7': isHovering }]"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <slot name="prepend">
      <v-icon
        v-if="icon"
        :icon="icon"
        :class="[
          variant === 'large' ? 'height-16' : variant === 'medium' ? 'height-14' : 'height-12',
          { 'mr-2': text }
        ]"
      />
      <v-img
        v-if="src"
        :src="src"
        class="mr-2 flex-0"
        :class="
          variant === 'large'
            ? 'width-16 height-16'
            : variant === 'medium'
            ? 'width-14 height-14'
            : 'width-12  height-12'
        "
      />
    </slot>
    <slot name="center">
      <span
        :class="[
          variant === 'large'
            ? 'text-subtitle-1'
            : variant === 'medium'
            ? 'text-subtitle-2'
            : 'text-caption',
          'line-height-lg font-weight-bold'
        ]"
      >
        {{ text }}
      </span>
    </slot>
    <slot name="append" />
    <slot />
  </button>
</template>
