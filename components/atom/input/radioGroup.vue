<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: any
    items: {
      label: string
      value: any
      disabled?: boolean
    }[]
  }>(),
  {
    items: () => []
  }
)
defineEmits<{
  (e: 'update:model-value', value: any): void
}>()
const isSelected = (value: any): boolean => {
  if (Array.isArray(props.modelValue)) return props.modelValue.includes(value)
  else return props.modelValue === value
}
</script>
<template>
  <v-radio-group
    :model-value="modelValue"
    inline
    @update:model-value="$emit('update:model-value', $event)"
  >
    <v-radio
      v-for="(item, index) in items"
      :key="item.label"
      v-bind="item"
      density="compact"
      class="text-main-color"
      :class="{ 'mr-5': index !== items.length - 1 }"
    >
      <template #label="{ label }">
        <atom-text
          :text="label"
          class="ml-1"
          :class="{ 'opacity-dot5': !isSelected(item.value) }"
        />
      </template>
    </v-radio>
  </v-radio-group>
</template>
