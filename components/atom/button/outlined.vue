<script setup lang="ts">
const props = withDefaults(
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
</script>
<template>
  <atom-button v-bind="props" class="border-width-1 border-solid border-grey-lighten-1 rounded">
  </atom-button>
</template>
