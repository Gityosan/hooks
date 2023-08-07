<script setup lang="ts">
withDefaults(
  defineProps<{
    comp?: string
    text?: string | null
    fontSize?: string
    fontWeight?: string
    color?: string
    lineHeight?: string
  }>(),
  {
    comp: 'p',
    fontSize: 'text-subtitle-1',
    fontWeight: 'font-weight-bold',
    color: 'text-black',
    lineHeight: 'line-height-sm'
  }
)
</script>
<template>
  <component :is="comp" :class="[fontSize, fontWeight, color, lineHeight]">
    {{ text }}
    <slot />
  </component>
</template>
