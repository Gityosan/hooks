<script setup lang="ts">
type TiptapButtonType = {
  title?: string
  icon?: string
  disabled: () => boolean
  func?: any
  items?: TiptapButtonType[]
  link?: string
  linkText?: string
  linkTarget?: boolean
  isLink?: boolean
  color?: string
}
const props = withDefaults(defineProps<TiptapButtonType>(), {
  title: '',
  icon: '',
  disabled: () => false,
  items: () => [],
  link: '',
  linkText: '',
  linkTarget: false,
  isLink: false,
  color: '#000000'
})
const emit = defineEmits<{
  (e: 'update:link', value: string): void
}>()
const file = ref<any>()
const open = ref<boolean>(false)
const saveItem = () => {
  open.value = false
  props.func && props.func()
}
const unsetLink = () => {
  emit('update:link', '')
  saveItem()
}
</script>
<template>
  <template v-if="icon">
    <v-menu v-if="items.length" v-model="open">
      <template #activator="{ props: menu }">
        <atom-button-icon :title="title" :icon="icon" :disabled="disabled()" :props="menu" />
      </template>
      <div class="bg-white rounded border-solid border-width-1 border-black">
        <atom-button-icon
          v-for="(item, index) in items"
          :key="index"
          :title="item.title"
          :icon="item.icon"
          :disabled="item.disabled()"
          @click-func="item.func && item.func()"
        />
      </div>
    </v-menu>
    <v-menu
      v-else-if="icon === 'mdi-format-color-text' || icon === 'mdi-texture'"
      v-model="open"
      :close-on-content-click="false"
    >
      <template #activator="{ props: menu }">
        <atom-button-icon :title="title" :icon="icon" :disabled="disabled()" :props="menu" />
      </template>
      <div class="bg-white rounded border-solid border-width-1 border-black px-4 py-1">
        <v-color-picker
          :modes="['rgb', 'hex', 'hexa']"
          elevation="0"
          hide-canvas
          show-swatches
          :model-value="color"
          @update:model-value="$emit('update:color', $event)"
        />
        <atom-button text="保存" text-class="text-caption" class="my-2 w-100" @click="saveItem()" />
      </div>
    </v-menu>
    <v-menu v-else-if="icon === 'mdi-link'" v-model="open" :close-on-content-click="false">
      <template #activator="{ props: menu }">
        <atom-button-icon :title="title" :icon="icon" :disabled="disabled()" :props="menu" />
      </template>
      <div class="bg-white rounded border-solid border-width-1 border-black min-width-300 pa-4">
        <atom-text text="テキスト" line-height="line-height-lg" class="mb-2" />
        <v-text-field
          :model-value="linkText"
          variant="outlined"
          density="compact"
          hide-details
          class="mb-2"
          @update:model-value="$emit('update:link-text', $event)"
        />
        <atom-text text="リンク" line-height="line-height-lg" class="mb-2" />
        <v-text-field
          :model-value="link"
          variant="outlined"
          density="compact"
          hide-details
          class="mb-2"
          @update:model-value="$emit('update:link', $event)"
        />
        <div class="d-flex justify-start align-center mb-2">
          <v-switch
            :model-value="linkTarget"
            density="compact"
            inset
            hide-details
            class="flex-grow-0 text-main-color"
            @update:model-value="$emit('update:link-target', $event)"
          />
          <atom-text text="別タブで開く" font-size="text-caption" class="ml-2" />
        </div>
        <div class="d-flex">
          <v-btn
            class="height-40 px-4 py-2 transition-short-ease text-main-color mr-3"
            :ripple="false"
            variant="outlined"
            @click="saveItem()"
          >
            <atom-text
              :text="isLink ? '更新' : '保存'"
              color="text-main-color"
              line-height="line-height-lg"
            />
          </v-btn>
          <v-btn
            v-if="isLink"
            class="height-40 px-4 py-2 transition-short-ease text-red"
            :ripple="false"
            variant="outlined"
            @click="unsetLink()"
          >
            <atom-text text="リンクを解除" color="text-red" line-height="line-height-lg" />
          </v-btn>
        </div>
      </div>
    </v-menu>
    <v-menu v-else-if="icon === 'mdi-image'">
      <template #activator="{ props: menu }">
        <atom-button-icon :title="title" :icon="icon" :disabled="disabled()" :props="menu" />
      </template>
      <div class="bg-white rounded border-solid border-width-1 border-black width-300 pa-4">
        <div class="d-flex">
          <atom-text text="画像をアップロード" line-height="line-height-40" />
          <v-spacer />
          <atom-button text="挿入" @click="func && func(file.file)" />
        </div>
        <atom-input-file v-model="file" />
      </div>
    </v-menu>
    <atom-button-icon
      v-else
      :title="title"
      :icon="icon"
      :disabled="disabled()"
      @click-func="func && func()"
    />
  </template>
  <v-divider v-else vertical class="my-1 mx-2" />
</template>
