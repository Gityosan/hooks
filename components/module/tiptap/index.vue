<script setup lang="ts">
import { Underline } from '@tiptap/extension-underline'
import { Highlight } from '@tiptap/extension-highlight'
import { Link } from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Typography } from '@tiptap/extension-typography'
import { TextAlign } from '@tiptap/extension-text-align'
import { Image } from '@tiptap/extension-image'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/vue-3'
import { StarterKit } from '@tiptap/starter-kit'
// const config = useRuntimeConfig()
// const isProd = config.public.isProd
const textAlignTypeIcon = ref<string>('mdi-format-align-left')
const textTypeIcon = ref<string>('mdi-format-paragraph')
const isLinkEditMode = ref<boolean>(false)
const link = ref<string>('')
const color = ref<string>('')
const props = withDefaults(defineProps<{ modelValue: string }>(), { modelValue: '' })
const emit = defineEmits<{
  (e: 'update:model-value', value: any): void
}>()
const editor = useEditor({
  content: props.modelValue || '<p>Iām running Tiptap with Vue.js. š</p>',
  extensions: [
    StarterKit,
    Underline,
    Color,
    TextStyle,
    Highlight,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-blue-darken-1 cursor-text'
      }
    }),
    Typography,
    TextAlign.configure({
      types: ['heading', 'paragraph']
    }),
    Image
  ],
  onUpdate: () => {
    emit('update:model-value', editor.value?.getHTML())
    const selectedText = Object.assign(
      {},
      editor.value?.getAttributes('heading'),
      editor.value?.getAttributes('paragraph')
    )
    if ('textAlign' in selectedText)
      textAlignTypeIcon.value = `mdi-format-align-${selectedText.textAlign}`
    if ('level' in selectedText) textTypeIcon.value = `mdi-format-header-${selectedText.level}`
  },
  onSelectionUpdate: () => {
    link.value = editor.value?.getAttributes('link').href
    color.value = editor.value?.getAttributes('textStyle').color
    isLinkEditMode.value = !editor.value?.getAttributes('link').href
  }
})
watch(props, (v, c) => {
  if (editor.value?.getHTML() === c.modelValue) return
  editor.value?.commands.setContent(c.modelValue, false)
})
onBeforeUnmount(() => {
  editor.value?.destroy()
})
const setLink = (link = '') => {
  if (!link) editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
  else editor.value?.chain().focus().extendMarkRange('link').setLink({ href: link }).run()
}
const icons = computed(() => [
  {
    title: 'ęå­ćµć¤ćŗ',
    icon: textTypeIcon.value,
    items: [
      {
        icon: 'mdi-format-paragraph',
        func: () => editor.value?.chain().focus().setParagraph().run(),
        disabled: () => editor.value?.isActive('paragraph') || false
      },
      {
        icon: 'mdi-format-header-1',
        func: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run(),
        disabled: () => editor.value?.isActive('heading', { level: 1 }) || false
      },
      {
        icon: 'mdi-format-header-2',
        func: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
        disabled: () => editor.value?.isActive('heading', { level: 2 }) || false
      },
      {
        icon: 'mdi-format-header-3',
        func: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run(),
        disabled: () => editor.value?.isActive('heading', { level: 3 }) || false
      },
      {
        icon: 'mdi-format-header-4',
        func: () => editor.value?.chain().focus().toggleHeading({ level: 4 }).run(),
        disabled: () => editor.value?.isActive('heading', { level: 4 }) || false
      },
      {
        icon: 'mdi-format-header-5',
        func: () => editor.value?.chain().focus().toggleHeading({ level: 5 }).run(),
        disabled: () => editor.value?.isActive('heading', { level: 5 }) || false
      },
      {
        icon: 'mdi-format-header-6',
        func: () => editor.value?.chain().focus().toggleHeading({ level: 6 }).run(),
        disabled: () => editor.value?.isActive('heading', { level: 6 }) || false
      }
    ]
  },
  {
    title: 'čęÆč²',
    icon: 'mdi-texture',
    func: () => editor.value?.chain().focus().toggleHighlight({ color: color.value }).run()
  },
  {
    title: 'ęå­č²',
    icon: 'mdi-format-color-text',
    func: () => editor.value?.chain().focus().setColor(color.value).run()
  },
  {},
  {
    title: 'å¤Ŗå­',
    icon: 'mdi-format-bold',
    func: () => editor.value?.chain().focus().toggleBold().run(),
    disabled: () => editor.value?.isActive('bold') || false
  },
  {
    title: 'ęä½',
    icon: 'mdi-format-italic',
    func: () => editor.value?.chain().focus().toggleItalic().run(),
    disabled: () => editor.value?.isActive('italic') || false
  },
  {
    title: 'äøē·',
    icon: 'mdi-format-underline',
    func: () => editor.value?.chain().focus().toggleUnderline().run(),
    disabled: () => editor.value?.isActive('underline') || false
  },
  {
    title: 'ęć”ę¶ćē·',
    icon: 'mdi-format-strikethrough',
    func: () => editor.value?.chain().focus().toggleStrike().run(),
    disabled: () => editor.value?.isActive('strike') || false
  },
  {
    title: 'ć³ć¼ć',
    icon: 'mdi-code-tags',
    func: () => editor.value?.chain().focus().toggleCode().run(),
    disabled: () => editor.value?.isActive('code') || false
  },
  {},
  {
    title: 'ćŖć¹ć',
    icon: 'mdi-format-list-bulleted',
    func: () => editor.value?.chain().focus().toggleBulletList().run(),
    disabled: () => editor.value?.isActive('bulletList') || false
  },
  {
    title: 'ēŖå·ä»ććŖć¹ć',
    icon: 'mdi-format-list-numbered',
    func: () => editor.value?.chain().focus().toggleOrderedList().run(),
    disabled: () => editor.value?.isActive('orderedList') || false
  },
  {
    title: 'ęØŖä½ē½®',
    icon: textAlignTypeIcon.value,
    func: () => editor.value?.chain().focus().setTextAlign('left').run(),
    items: [
      {
        icon: 'mdi-format-align-left',
        func: () => editor.value?.chain().focus().setTextAlign('left').run(),
        disabled: () => editor.value?.isActive({ textAlign: 'left' }) || false
      },
      {
        icon: 'mdi-format-align-center',
        func: () => editor.value?.chain().focus().setTextAlign('center').run(),
        disabled: () => editor.value?.isActive({ textAlign: 'center' }) || false
      },
      {
        icon: 'mdi-format-align-right',
        func: () => editor.value?.chain().focus().setTextAlign('right').run(),
        disabled: () => editor.value?.isActive({ textAlign: 'right' }) || false
      },
      {
        icon: 'mdi-format-align-justify',
        func: () => editor.value?.chain().focus().setTextAlign('justify').run(),
        disabled: () => editor.value?.isActive({ textAlign: 'justify' }) || false
      }
    ]
  },
  {},
  {
    title: 'å¼ēØ',
    icon: 'mdi-format-quote-close',
    func: () => editor.value?.chain().focus().toggleBlockquote().run(),
    disabled: () => editor.value?.isActive('blockquote') || false
  },
  {
    title: 'ć³ć¼ććć­ććÆ',
    icon: 'mdi-xml',
    func: () => editor.value?.chain().focus().toggleCodeBlock().run(),
    disabled: () => editor.value?.isActive('codeBlock') || false
  },
  {
    title: 'ćŖć³ćÆ',
    icon: 'mdi-link',
    func: () => {
      setLink(link.value)
    }
  },
  {
    title: 'ē»å',
    icon: 'mdi-image',
    func: (file: File | null = null) => {
      if (!file) return
      const url = URL.createObjectURL(file)
      editor.value?.chain().focus().setImage({ src: url }).run()
    }
  },
  {},
  {
    title: 'åŗåćē·',
    icon: 'mdi-minus',
    func: () => editor.value?.chain().focus().setHorizontalRule().run()
  },
  {
    title: 'ę¹č”',
    icon: 'mdi-keyboard-return',
    func: () => editor.value?.chain().focus().setHardBreak().run()
  },
  {
    title: 'äøć¤åć«ę»ć',
    icon: 'mdi-arrow-u-left-top',
    func: () => editor.value?.chain().focus().undo().run(),
    disabled: () => !editor.value?.can().chain().focus().undo().run() || false
  },
  {
    title: 'äøć¤åć«é²ć',
    icon: 'mdi-arrow-u-right-top',
    func: () => editor.value?.chain().focus().redo().run(),
    disabled: () => !editor.value?.can().chain().focus().redo().run() || false
  }
])
</script>
<template>
  <div v-if="editor" class="border-solid border-width-1 border-grey-darken-4 w-100 rounded">
    <div class="d-flex flex-wrap ma-1">
      <module-tiptap-icon
        v-for="item in icons"
        :key="item.icon"
        v-model:link="link"
        v-model:color="color"
        :title="item.title"
        :icon="item.icon"
        :items="item.items"
        :func="item.func"
        :disabled="item.disabled"
      />
    </div>
    <v-divider class="text-grey-darken-4"></v-divider>
    <!-- <bubble-menu
      :editor="editor"
      :tippy-options="{ duration: 0 }"
      :should-show="
        ({ editor, view, state, oldState, from, to }) => {
          // links = String(!!editor.getAttributes('link').href)
          return !!editor.getAttributes('link').href
        }
      "
    >
      <div
        class="bg-white rounded border-solid border-width-1 border-black min-width-300 px-2 py-1"
      >
        <div v-if="isLinkEditMode" class="d-flex">
          <atom-text
            text="ćŖć³ćÆåćå„å:"
            font-size="text-caption"
            line-height="line-height-40"
            class="mr-2"
          />
          <v-text-field
            :model-value="editor.getAttributes('link').href"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="link = $event"
          />
          <atom-text
            text="äæå­"
            font-size="text-subtitle-2"
            color="text-blue-darken-1"
            line-height="line-height-40"
            class="ml-2 cursor-pointer"
            @click="setLink(link)"
          />
        </div>
        <div v-else class="d-flex flex-nowrap">
          <atom-text
            text="ćŖć³ćÆå:"
            font-size="text-caption"
            line-height="line-height-40"
            class="mr-2 white-space-nowrap"
          />
          <nuxt-link :to="editor.getAttributes('link').href" target="_blank" rel="noopener">
            <atom-text
              :text="editor.getAttributes('link').href"
              font-size="text-subtitle-2"
              color="text-blue-darken-1"
              line-height="line-height-40"
              class="mr-4 cursor-pointer line-clamp-1 max-width-130"
              style="flex: 1"
            />
          </nuxt-link>
          <atom-text
            text="ē·Øé"
            font-size="text-subtitle-2"
            color="text-blue-darken-1"
            line-height="line-height-40"
            class="cursor-pointer white-space-nowrap"
            @click="isLinkEditMode = true"
          />
          <v-divider vertical class="my-3 mx-2" />
          <atom-text
            text="åé¤"
            font-size="text-subtitle-2"
            color="text-blue-darken-1"
            line-height="line-height-40"
            class="cursor-pointer white-space-nowrap"
            @click="setLink('')"
          />
        </div>
      </div>
    </bubble-menu> -->
    <editor-content :editor="editor" class="py-5 px-2 rich-text max-height-300 overflow-y-auto" />
  </div>
</template>
