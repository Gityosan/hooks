<script setup lang="ts">
import { UpdateProjectInput, GetProjectQuery } from '~/assets/API'
import { FileInput } from '~/assets/type'
import { projectInputs } from '~/assets/enum'
import { deleteProject, updateProject } from '~/assets/graphql/mutations'
import { getProject } from '~/assets/graphql/queries'
const { params } = useRoute()
const { banEdit } = useEditState()
const defaultInput = Object.fromEntries(projectInputs.map((v) => [v.key, v.default]))
const input = ref<FileInput<Partial<UpdateProjectInput>>>(
  defaultInput as FileInput<Partial<UpdateProjectInput>>
)
const form = ref<any>()
const open = ref<boolean>(false)
useHead({ title: 'プロジェクト編集' })
const getItem = async () => {
  const { data } = await getQuery<GetProjectQuery, UpdateProjectInput>({
    query: getProject,
    queryName: 'getProject',
    variables: { id: params.id }
  })
  if (data.value) input.value = data.value
  console.debug(input.value)
}
const updateItem = async () => {
  if (!(await checkValidation(form.value))) return
  const excludeAttr = Object.keys(input.value).filter(
    (v) => v !== 'id' && !Object.keys(defaultInput).includes(v)
  )
  await extendMutation({
    type: 'update',
    key: input.value.file?.key || '',
    query: updateProject,
    input: filterAttr({ ...input.value }, excludeAttr),
    file: input.value.file?.file
  })
  await getItem()
}
const deleteItem = async () => {
  await extendMutation({
    type: 'delete',
    key: input.value.file?.key || '',
    query: deleteProject,
    input: { id: input.value.id }
  })
  navigateTo('/admin/project')
}
await getItem()
</script>
<template>
  <div class="position-relative">
    <div class="d-flex py-5 position-sticky top-0 right-0 bg-white z-index-3">
      <atom-text text="編集" font-size="text-h6" class="my-2 line-clamp-1" />
      <v-spacer />
      <atom-button-outlined
        :loading="banEdit"
        text="保存する"
        class="mr-4 flex-0"
        icon="mdi-content-save"
        @click="updateItem()"
      />
      <atom-button-outlined
        :loading="banEdit"
        text="削除する"
        class="mr-4 flex-0"
        icon="mdi-delete"
        @click="open = true"
      />
    </div>
    <v-form ref="form">
      <atom-input
        v-for="item in projectInputs"
        :key="item.key"
        v-model="input[item.key as keyof typeof input]"
        :input="item"
      />
    </v-form>
    <v-dialog v-model="open" persistent>
      <v-card flat class="rounded-lg py-6 px-10" min-width="370">
        <atom-text text="このデータを本当に削除しますか？" class="w-100 mt-5 mb-10 text-center" />
        <div class="d-flex justify-space-around">
          <atom-button-switch
            text="削除します"
            :loading="banEdit"
            class="rounded-pill width-200"
            @click="deleteItem()"
          />
          <atom-button-switch
            text="キャンセル"
            :loading="banEdit"
            class="rounded-pill width-200"
            @click="open = false"
          />
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
