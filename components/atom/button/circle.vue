<script setup lang="ts">
const isHovering = ref<boolean>(false)
</script>
<template>
  <div
    class="w-100 h-100 transition-medium-ease rounded-circle cursor-pointer"
    :class="[isHovering ? 'elevation-3 background-white' : 'background-grey-lighten-4']"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    @click="$emit('click-func')"
  >
    <slot />
  </div>
</template>
