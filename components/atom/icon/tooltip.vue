<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text: string
    icon: string
    color: string
    size: string | number
    class: string
    style: object
  }>(),
  {
    text: '',
    icon: '',
    color: 'text-black',
    size: '24',
    class: 'ma-2',
    style: () => ({})
  }
)
</script>
<template>
  <v-tooltip :text="text">
    <template #activator="{ props: tooltip }">
      <v-icon
        v-bind="tooltip"
        :icon="icon"
        :size="size"
        :class="[color, props.class]"
        :style="style"
        @click="$emit('click')"
      />
    </template>
  </v-tooltip>
</template>
