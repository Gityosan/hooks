<script setup lang="ts">
import { Underline } from '@tiptap/extension-underline'
import { Highlight } from '@tiptap/extension-highlight'
import { Link } from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import { Typography } from '@tiptap/extension-typography'
import { TextAlign } from '@tiptap/extension-text-align'
import { Image } from '@tiptap/extension-image'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { StarterKit } from '@tiptap/starter-kit'
// const config = useRuntimeConfig()
// const isProd = config.public.isProd
const textAlignTypeIcon = ref<string>('mdi-format-align-left')
const textTypeIcon = ref<string>('mdi-format-paragraph')
const props = withDefaults(defineProps<{ modelValue: string }>(), { modelValue: '' })
const emit = defineEmits<{
  (e: 'update:model-value', value: any): void
}>()
const editor = useEditor({
  content: props.modelValue || '<p>I’m running Tiptap with Vue.js. 🎉</p>',
  extensions: [
    StarterKit,
    Underline,
    Color,
    Highlight,
    Link,
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
  }
})
watch(props, (v, c) => {
  if (editor.value?.getHTML() === c.modelValue) return
  editor.value?.commands.setContent(c.modelValue, false)
})
onBeforeUnmount(() => {
  editor.value?.destroy()
})
const icons = computed(() => [
  {
    title: '文字サイズ',
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
    title: '背景色',
    icon: 'mdi-texture',
    func: () => editor.value?.chain().focus().toggleCode().run(),
    disabled: () => editor.value?.isActive('code') || false
  },
  {
    title: '文字色',
    icon: 'mdi-format-color-text',
    func: () => editor.value?.chain().focus().toggleCode().run(),
    disabled: () => editor.value?.isActive('code') || false
  },
  {},
  {
    title: '太字',
    icon: 'mdi-format-bold',
    func: () => editor.value?.chain().focus().toggleBold().run(),
    disabled: () => editor.value?.isActive('bold') || false
  },
  {
    title: '斜体',
    icon: 'mdi-format-italic',
    func: () => editor.value?.chain().focus().toggleItalic().run(),
    disabled: () => editor.value?.isActive('italic') || false
  },
  {
    title: '下線',
    icon: 'mdi-format-underline',
    func: () => editor.value?.chain().focus().toggleUnderline().run(),
    disabled: () => editor.value?.isActive('underline') || false
  },
  {
    title: '打ち消し線',
    icon: 'mdi-format-strikethrough',
    func: () => editor.value?.chain().focus().toggleStrike().run(),
    disabled: () => editor.value?.isActive('strike') || false
  },
  {
    title: 'コード',
    icon: 'mdi-code-tags',
    func: () => editor.value?.chain().focus().toggleCode().run(),
    disabled: () => editor.value?.isActive('code') || false
  },
  {},
  {
    title: 'リスト',
    icon: 'mdi-format-list-bulleted',
    func: () => editor.value?.chain().focus().toggleBulletList().run(),
    disabled: () => editor.value?.isActive('bulletList') || false
  },
  {
    title: '番号付きリスト',
    icon: 'mdi-format-list-numbered',
    func: () => editor.value?.chain().focus().toggleOrderedList().run(),
    disabled: () => editor.value?.isActive('orderedList') || false
  },
  {
    title: '横位置',
    icon: textAlignTypeIcon.value,
    func: () => editor.value?.chain().focus().setTextAlign('left').run(),
    disabled: () => editor.value?.isActive({ textAlign: 'left' }) || false,
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
    title: '引用',
    icon: 'mdi-format-quote-close',
    func: () => editor.value?.chain().focus().toggleBlockquote().run(),
    disabled: () => editor.value?.isActive('blockquote') || false
  },
  {
    title: 'コードブロック',
    icon: 'mdi-xml',
    func: () => editor.value?.chain().focus().toggleCodeBlock().run(),
    disabled: () => editor.value?.isActive('codeBlock') || false
  },
  {
    title: 'リンク',
    icon: 'mdi-link',
    func: (url = '') => {
      if (!url) editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
      else editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    },
    disabled: () => editor.value?.isActive('link') || false
  },
  {
    title: '画像',
    icon: 'mdi-image',
    func: (file: File | null = null) => {
      if (!file) return
      const url = URL.createObjectURL(file)
      editor.value?.chain().focus().setImage({ src: url }).run()
    }
  },
  {},
  {
    title: '区切り線',
    icon: 'mdi-minus',
    func: () => editor.value?.chain().focus().setHorizontalRule().run()
  },
  {
    title: '改行',
    icon: 'mdi-keyboard-return',
    func: () => editor.value?.chain().focus().setHardBreak().run()
  },
  {
    title: '一つ前に戻る',
    icon: 'mdi-arrow-u-left-top',
    func: () => editor.value?.chain().focus().undo().run(),
    disabled: () => !editor.value?.can().chain().focus().undo().run() || false
  },
  {
    title: '一つ先に進む',
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
        :title="item.title"
        :icon="item.icon"
        :items="item.items"
        :func="item.func"
        :disabled="item.disabled"
      />
    </div>
    <v-divider class="text-grey-darken-4"></v-divider>
    <editor-content :editor="editor" class="py-5 px-2 rich-text" />
  </div>
</template>
