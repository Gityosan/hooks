<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text: string
    icon: string
    color: string
    size: string | number
    loading: boolean
    class: string
    style: object
  }>(),
  {
    text: '',
    icon: '',
    color: 'text-black',
    size: '24',
    loading: false,
    class: 'ma-2',
    style: () => ({})
  }
)
</script>
<template>
  <v-tooltip :text="text">
    <template #activator="{ props: tooltip }">
      <v-btn icon :ripple="false" variant="text" :loading="loading">
        <v-icon
          v-bind="tooltip"
          :icon="icon"
          :size="size"
          :class="[color, props.class]"
          :style="style"
          @click="$emit('click')"
        />
      </v-btn>
    </template>
  </v-tooltip>
</template>
