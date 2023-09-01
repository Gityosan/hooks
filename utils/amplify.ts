import { API, Auth, Storage, I18n } from 'aws-amplify'
import { StorageAccessLevel } from '@aws-amplify/storage'
import { GraphQLQuery, GraphQLResult } from '@aws-amplify/api'
import { v4 as uuidv4 } from 'uuid'

export const getQuery = async <S, T>({
  query,
  queryName,
  variables = {}
}: {
  query: string
  queryName: string
  variables?: object
}) => {
  const { isSignedIn } = useLoginState()
  const { setBanEdit } = useEditState()
  const { setExistError, addErrorMessages } = useErrorState()
  setBanEdit(true)
  const result = await useAsyncData<T | null>(
    queryName,
    async (): Promise<T | null> => {
      const res = await API.graphql<GraphQLQuery<S>>({
        query,
        variables,
        authMode: isSignedIn.value ? 'AMAZON_COGNITO_USER_POOLS' : 'AWS_IAM'
      })
      if (!res.data) return null
      const rawData = Object.getOwnPropertyDescriptor(res.data, queryName)?.value
      return rawData || null
    },
    { lazy: false, watch: [] }
  )
  if (result.error.value) {
    clearError()
    setExistError(true)
    addErrorMessages(`${result.error.value?.message}`)
  }
  console.debug('data.value', result.data.value)
  setBanEdit(false)
  return result
}
export const listQuery = async <S, T>({
  query,
  queryName,
  filter = {}
}: {
  query: string
  queryName: string
  filter?: object
}) => {
  const config = useRuntimeConfig()
  const { isSignedIn } = useLoginState()
  const { setBanEdit } = useEditState()
  const { setExistError, addErrorMessages } = useErrorState()
  setBanEdit(true)
  const result = await useAsyncData<T[] | null>(
    queryName,
    async (): Promise<T[]> => {
      const items: T[] = []
      const variables = {
        limit: config.public.limit,
        nextToken: null,
        filter
      }
      const callbackQuery = async () => {
        // NOTE: DynamoDBのscanの1MB制限に達するとnextTokenが返される
        const res = await API.graphql<GraphQLQuery<S>>({
          query,
          variables,
          authMode: isSignedIn.value ? 'AMAZON_COGNITO_USER_POOLS' : 'AWS_IAM'
        })
        const rawData = Object.getOwnPropertyDescriptor(res.data, queryName)?.value
        if (Array.isArray(rawData?.items)) items.push(...rawData.items)
        if (rawData.nextToken) {
          variables.nextToken = rawData.nextToken
          await callbackQuery()
        }
      }
      await callbackQuery()
      return items
    },
    { lazy: false, watch: [] }
  )
  if (result.error.value) {
    clearError()
    setExistError(true)
    addErrorMessages(`${result.error.value?.message}`)
  }
  console.debug('data.value', result.data.value)
  setBanEdit(false)
  return result
}
