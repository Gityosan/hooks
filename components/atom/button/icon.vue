<script setup lang="ts">
import { mergeProps } from 'vue'
withDefaults(
  defineProps<{
    title: string
    icon: string
    disabled: boolean
    props?: any
  }>(),
  {
    title: '',
    icon: '',
    disabled: false
  }
)
const isHovering = ref<boolean>(false)
</script>
<template>
  <v-tooltip
    :text="title"
    :disabled="!title"
    location="bottom"
    content-class="bg-main-color text-caption font-weight-bold font-caption py-1 px-2"
  >
    <template #activator="{ props: tooltip }">
      <v-icon
        :icon="icon"
        size="20"
        class="rounded width-28 height-28 transition-short-ease"
        :class="
          disabled
            ? 'text-grey cursor-default'
            : isHovering
            ? 'bg-black cursor-pointer'
            : 'bg-white cursor-pointer'
        "
        v-bind="mergeProps(props, tooltip)"
        @click="$emit('click-func')"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
      />
    </template>
  </v-tooltip>
</template>
