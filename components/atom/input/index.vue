<script setup lang="ts">
import type { InputType } from '~/assets/type'
import { InputComponents } from '~/assets/enum'
const props = withDefaults(
  defineProps<{
    input: InputType
    modelValue: any
  }>(),
  { modelValue: () => ({}) }
)
const emit = defineEmits<{
  (e: 'update:model-value', value: any): void
}>()
const onChange = ({ index = 0, event }: { index?: number; event?: Event | File[] }) => {
  let res = props.modelValue
  const data: any = event
  if (Array.isArray(props.modelValue)) res[index] = data
  else res = data
  emit('update:model-value', res)
}
</script>
<template>
  <div class="d-flex">
    <atom-text :text="input.title" line-height="line-height-lg" class="pb-2 pl-1" />
    <v-icon
      v-if="input.rules?.some((v) => v.name === 'required')"
      icon="mdi-asterisk"
      size="12"
      class="text-red-darken-4 height-24 ml-1"
    />
  </div>
  <template v-if="input.isArray">
    <component
      :is="resolveComponent(InputComponents()[input.type].comp)"
      v-for="(v, i) in modelValue"
      v-bind="{ ...InputComponents(input.key, v)[input.type].props, ...input.props }"
      :id="input.title + '-' + i"
      class="mb-10"
      :rules="input.rules"
      prepend-icon="mdi-plus"
      append-icon="mdi-minus"
      :model-value="v"
      @update:model-value="onChange({ index: i, event: $event })"
      @click:prepend="$emit('update:model-value', [...modelValue, null])"
      @click:append="
        $emit('update:model-value', [...modelValue.slice(0, i), ...modelValue.slice(i + 1)])
      "
    />
  </template>
  <template v-else>
    <component
      :is="resolveComponent(InputComponents()[input.type].comp)"
      v-bind="{ ...InputComponents(input.key, modelValue)[input.type].props, ...input.props }"
      :id="input.title"
      class="mb-10"
      :rules="input.rules"
      :model-value="modelValue"
      @update:model-value="onChange({ event: $event })"
    />
  </template>
</template>
