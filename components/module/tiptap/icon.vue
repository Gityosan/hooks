<script setup lang="ts">
type TiptapButtonType = {
  title?: string
  icon?: string
  disabled: () => boolean
  func?: any
  items?: TiptapButtonType[]
  editor?: any
}
withDefaults(defineProps<TiptapButtonType>(), {
  title: '',
  icon: '',
  disabled: () => false,
  items: () => []
})
const link = ref<string>('')
const file = ref<any>()
</script>
<template>
  <template v-if="icon">
    <v-menu v-if="items.length">
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
    <v-menu v-else-if="icon === 'mdi-link'" :close-on-content-click="false">
      <template #activator="{ props: menu }">
        <atom-button-icon :title="title" :icon="icon" :disabled="disabled()" :props="menu" />
      </template>
      <div
        class="bg-white rounded border-solid border-width-1 border-black min-width-300 px-2 py-1"
      >
        <div class="d-flex">
          <atom-text
            text="リンク先を入力:"
            font-size="text-caption"
            line-height="line-height-40"
            class="mr-2"
          />
          <v-text-field v-model="link" variant="outlined" density="compact" hide-details />
          <atom-text
            text="保存"
            font-size="text-subtitle-2"
            color="text-blue"
            line-height="line-height-40"
            class="ml-2 cursor-pointer"
            @click="func && func(link)"
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
