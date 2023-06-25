<script setup lang="ts">
import { Underline } from '@tiptap/extension-underline'
import { Highlight } from '@tiptap/extension-highlight'
import { Link } from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Typography } from '@tiptap/extension-typography'
import { TextAlign } from '@tiptap/extension-text-align'
import { Image } from '@tiptap/extension-image'
import { TaskItem } from '@tiptap/extension-task-item'
import { TaskList } from '@tiptap/extension-task-list'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/vue-3'
import { StarterKit } from '@tiptap/starter-kit'
// const config = useRuntimeConfig()
// const isProd = config.public.isProd
const textAlignTypeIcon = ref<string>('mdi-align-horizontal-left')
const textTypeIcon = ref<string>('mdi-format-paragraph')
const isLinkEditMode = ref<boolean>(false)
const link = ref<string>('')
const color = ref<string>('')
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
    TextStyle,
    Highlight.configure({ multicolor: true }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-blue-darken-1 cursor-text'
      }
    }),
    Typography,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Image,
    TaskList,
    TaskItem.configure({ nested: true })
  ],
  editorProps: {
    handleKeyDown: (view, event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'c') {
        const { state } = view
        const { from, to, $anchor, $head } = state.selection
        const { parent } = $head
        const t = parent.content.child($head.index($head.depth))
        const dom = parent.type.spec.parseDOM
        // console.log(parent.type.spec?.parseDOM?.[0].tag)
        console.log($head, view, t, parent.nodeAt($head.start($head.depth)))
        console.log(from, to)
        // console.log($head.start($head.depth), $head.end($head.depth))
        // console.log($head.node($head.depth))
        console.log(dom)
        console.log(editor.value?.getJSON())
        // console.log(parent.content.findIndex($head.pos))
        if (parent.type.spec?.toDOM) {
          // console.log(parent.type.spec.toDOM(parent.content.child($head.index($head.depth))))
          // console.log(parent.type.spec.toDOM($head.node($head.depth)))
          console.log(parent.type.spec.toDOM(t))
        }

        // console.log(parent.content.child($head.index($head.depth)))
        //     const lineRange = state.doc.lineAt(from);
        //     const slice = state.doc.slice(from, to)
        //     const text = state.doc.textBetween(from, to, '\n')
        //     const clipboardData = new DataTransfer()
        //     const type = "text/html";
        // const blob = new Blob([text], { type });
        // const data = [new ClipboardItem({ [type]: blob })];
        //     console.log(event)
        //     if (text) {
        //       event.preventDefault()
        //       event.stopPropagation()

        //       // clipboardData.setData('text/html', html)
        //       clipboardData.setData('text/plain', text)
        //       event.clipboardData = clipboardData
        //     }
        return true
      }
      if (event.shiftKey && event.key === 'Enter') {
        event.preventDefault()
        const { state, dispatch } = view
        const { tr, selection } = state
        if (!selection.empty) return true
        const br = state.schema.nodes.hardBreak.create()
        console.log(selection)
        const transaction = tr.insert(selection.anchor, br)
        dispatch(transaction)
        return true
      }
      return false
    }
  },
  onUpdate: () => {
    emit('update:model-value', editor.value?.getHTML())
    const selectedText = Object.assign(
      {},
      editor.value?.getAttributes('heading'),
      editor.value?.getAttributes('paragraph')
    )
    if ('textAlign' in selectedText)
      textAlignTypeIcon.value = `mdi-align-horizontal-${selectedText.textAlign}`
    if ('level' in selectedText) textTypeIcon.value = `mdi-format-header-${selectedText.level}`
    else textTypeIcon.value = 'mdi-format-paragraph'
  },
  onSelectionUpdate: () => {
    const selectedText = Object.assign(
      {},
      editor.value?.getAttributes('heading'),
      editor.value?.getAttributes('paragraph')
    )
    if ('textAlign' in selectedText)
      textAlignTypeIcon.value = `mdi-align-horizontal-${selectedText.textAlign}`
    if ('level' in selectedText) textTypeIcon.value = `mdi-format-header-${selectedText.level}`
    else textTypeIcon.value = 'mdi-format-paragraph'
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
    title: '文字サイズ',
    icon: textTypeIcon.value,
    items: [
      {
        icon: 'mdi-format-paragraph',
        func: () => editor.value?.chain().focus().setParagraph().run(),
        disabled: () => !!editor.value?.isActive('paragraph')
      },
      {
        icon: 'mdi-format-header-1',
        func: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run(),
        disabled: () => !!editor.value?.isActive('heading', { level: 1 })
      },
      {
        icon: 'mdi-format-header-2',
        func: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
        disabled: () => !!editor.value?.isActive('heading', { level: 2 })
      },
      {
        icon: 'mdi-format-header-3',
        func: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run(),
        disabled: () => !!editor.value?.isActive('heading', { level: 3 })
      },
      {
        icon: 'mdi-format-header-4',
        func: () => editor.value?.chain().focus().toggleHeading({ level: 4 }).run(),
        disabled: () => !!editor.value?.isActive('heading', { level: 4 })
      },
      {
        icon: 'mdi-format-header-5',
        func: () => editor.value?.chain().focus().toggleHeading({ level: 5 }).run(),
        disabled: () => !!editor.value?.isActive('heading', { level: 5 })
      },
      {
        icon: 'mdi-format-header-6',
        func: () => editor.value?.chain().focus().toggleHeading({ level: 6 }).run(),
        disabled: () => !!editor.value?.isActive('heading', { level: 6 })
      }
    ]
  },
  {
    title: '背景色',
    icon: 'mdi-texture',
    func: () => editor.value?.chain().focus().toggleHighlight({ color: color.value }).run()
  },
  {
    title: '文字色',
    icon: 'mdi-format-color-text',
    func: () => editor.value?.chain().focus().setColor(color.value).run()
  },
  {},
  {
    title: '太字',
    icon: 'mdi-format-bold',
    func: () => editor.value?.chain().focus().toggleBold().run(),
    disabled: () => !!editor.value?.isActive('bold')
  },
  {
    title: '斜体',
    icon: 'mdi-format-italic',
    func: () => editor.value?.chain().focus().toggleItalic().run(),
    disabled: () => !!editor.value?.isActive('italic')
  },
  {
    title: '下線',
    icon: 'mdi-format-underline',
    func: () => editor.value?.chain().focus().toggleUnderline().run(),
    disabled: () => !!editor.value?.isActive('underline')
  },
  {
    title: '打ち消し線',
    icon: 'mdi-format-strikethrough',
    func: () => editor.value?.chain().focus().toggleStrike().run(),
    disabled: () => !!editor.value?.isActive('strike')
  },
  {
    title: 'コード',
    icon: 'mdi-code-tags',
    func: () => editor.value?.chain().focus().toggleCode().run(),
    disabled: () => !!editor.value?.isActive('code')
  },
  {
    title: '横位置',
    icon: textAlignTypeIcon.value,
    func: () => editor.value?.chain().focus().setTextAlign('left').run(),
    items: [
      {
        icon: 'mdi-align-horizontal-left',
        func: () => editor.value?.chain().focus().setTextAlign('left').run(),
        disabled: () => !!editor.value?.isActive({ textAlign: 'left' })
      },
      {
        icon: 'mdi-align-horizontal-center',
        func: () => editor.value?.chain().focus().setTextAlign('center').run(),
        disabled: () => !!editor.value?.isActive({ textAlign: 'center' })
      },
      {
        icon: 'mdi-align-horizontal-right',
        func: () => editor.value?.chain().focus().setTextAlign('right').run(),
        disabled: () => !!editor.value?.isActive({ textAlign: 'right' })
      }
    ]
  },

  {},
  {
    title: '区切り線',
    icon: 'mdi-minus',
    func: () => editor.value?.chain().focus().setHorizontalRule().run()
  },
  {
    title: '引用',
    icon: 'mdi-format-quote-close',
    func: () => editor.value?.chain().focus().toggleBlockquote().run(),
    disabled: () => !!editor.value?.isActive('blockquote')
  },
  {
    title: 'コードブロック',
    icon: 'mdi-xml',
    func: () => editor.value?.chain().focus().toggleCodeBlock().run(),
    disabled: () => !!editor.value?.isActive('codeBlock')
  },
  {},
  {
    title: 'リスト',
    icon: 'mdi-format-list-bulleted',
    func: () => editor.value?.chain().focus().toggleBulletList().run(),
    disabled: () => !!editor.value?.isActive('bulletList')
  },
  {
    title: '番号付きリスト',
    icon: 'mdi-format-list-numbered',
    func: () => editor.value?.chain().focus().toggleOrderedList().run(),
    disabled: () => !!editor.value?.isActive('orderedList')
  },
  {
    title: 'タスクリスト',
    icon: 'mdi-format-list-checks',
    func: () => editor.value?.chain().focus().toggleTaskList().run(),
    disabled: () => !!editor.value?.isActive('taskList')
  },
  {},
  {
    title: 'リンク',
    icon: 'mdi-link',
    func: () => {
      setLink(link.value)
    }
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
    title: '改行',
    icon: 'mdi-keyboard-return',
    func: () => editor.value?.chain().focus().setHardBreak().run()
  },
  {
    title: '一つ前に戻る',
    icon: 'mdi-undo',
    func: () => editor.value?.chain().focus().undo().run(),
    disabled: () => !editor.value?.can().chain().focus().undo().run()
  },
  {
    title: '一つ先に進む',
    icon: 'mdi-redo',
    func: () => editor.value?.chain().focus().redo().run(),
    disabled: () => !editor.value?.can().chain().focus().redo().run()
  },
  {
    title: '書式のクリア',
    icon: 'mdi-format-clear',
    func: () => editor.value?.chain().focus().clearNodes().unsetAllMarks().run()
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
            text="リンク先を入力:"
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
            text="保存"
            font-size="text-subtitle-2"
            color="text-blue-darken-1"
            line-height="line-height-40"
            class="ml-2 cursor-pointer"
            @click="setLink(link)"
          />
        </div>
        <div v-else class="d-flex flex-nowrap">
          <atom-text
            text="リンク先:"
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
            @click="setLink('')"
          />
        </div>
      </div>
    </bubble-menu> -->
    <editor-content :editor="editor" class="pa-10 pt-6 min-height-200 overflow-y-auto" />
  </div>
</template>
