<script setup lang="ts">
type TiptapButtonType = {
  title?: string
  icon?: string
  disabled: () => boolean
  func?: any
  items?: TiptapButtonType[]
  link?: string
  color?: string
}
const props = withDefaults(defineProps<TiptapButtonType>(), {
  title: '',
  icon: '',
  disabled: () => false,
  items: () => [],
  link: '',
  color: '#000000'
})
watch(props, (v, c) => {
  isLinkEditMode.value = !c.link
})
const file = ref<any>()
const open = ref<boolean>(false)
const isLinkEditMode = ref<boolean>(!props.link)
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
        <atom-button
          text="保存"
          text-class="text-caption"
          class="my-2 w-100"
          @click-func="
            () => {
              open = false
              func && func()
            }
          "
        />
      </div>
    </v-menu>
    <v-menu v-else-if="icon === 'mdi-link'" v-model="open" :close-on-content-click="false">
      <template #activator="{ props: menu }">
        <atom-button-icon :title="title" :icon="icon" :disabled="disabled()" :props="menu" />
      </template>
      <div
        class="bg-white rounded border-solid border-width-1 border-black min-width-300 px-2 py-1"
      >
        <div v-if="isLinkEditMode" class="d-flex">
          <atom-text
            text="リンク先を入力:"
            font-size="text-caption"
            line-height="line-height-40"
            class="mr-2"
          />
          <v-text-field
            :model-value="link"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="$emit('update:link', $event)"
          />
          <atom-text
            text="保存"
            font-size="text-subtitle-2"
            color="text-blue-darken-1"
            line-height="line-height-40"
            class="ml-2 cursor-pointer"
            @click="
              () => {
                open = false
                func && func()
              }
            "
          />
        </div>
        <div v-else class="d-flex flex-nowrap">
          <atom-text
            text="リンク先:"
            font-size="text-caption"
            line-height="line-height-40"
            class="mr-2 white-space-nowrap"
          />
          <nuxt-link :to="link" target="_blank" rel="noopener">
            <atom-text
              :text="link"
              font-size="text-subtitle-2"
              color="text-blue-darken-1"
              line-height="line-height-40"
              class="mr-4 cursor-pointer line-clamp-1 max-width-130"
              style="flex: 1"
            />
          </nuxt-link>
          <atom-text
            text="編集"
            font-size="text-subtitle-2"
            color="text-blue-darken-1"
            line-height="line-height-40"
            class="cursor-pointer white-space-nowrap"
            @click="isLinkEditMode = true"
          />
          <v-divider vertical class="my-3 mx-2" />
          <atom-text
            text="削除"
            font-size="text-subtitle-2"
            color="text-blue-darken-1"
            line-height="line-height-40"
            class="cursor-pointer white-space-nowrap"
            @click="
              () => {
                open = false
                func && func()
              }
            "
          />
        </div>
      </div>
    </v-menu>
    <v-menu v-else-if="icon === 'mdi-image'">
      <template #activator="{ props: menu }">
        <atom-button-icon :title="title" :icon="icon" :disabled="disabled()" :props="menu" />
      </template>
      <div class="bg-white rounded border-solid border-width-1 border-black width-300 pa-2">
        <div class="d-flex">
          <atom-text text="画像をアップロード" line-height="line-height-40" />
          <v-spacer />
          <atom-button text="挿入" @click-func="func && func(file.file)" />
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
