import { API, Auth, Storage } from 'aws-amplify'
import type { StorageAccessLevel } from '@aws-amplify/storage'
import type { GraphQLQuery } from '@aws-amplify/api'
import { v4 as uuidv4 } from 'uuid'
import type { AsyncDataOptions } from 'nuxt/app'

export const getQuery = async <S, T>({
  query,
  queryName,
  variables = {},
  options = {}
}: {
  query: string
  queryName: string
  variables?: object
  options?: AsyncDataOptions<T | null>
}) => {
  const { isSignedIn } = useLoginState()
  const { setIneditable } = useEditState()
  const { setExistError, addErrorMessages } = useErrorState()
  setIneditable(true)
  const asyncDataOptions = { lazy: false, watch: [], ...(options || {}) }
  const queryParams = isEmptyObject(variables) ? '' : JSON.stringify(sortObjectKeys(variables))
  const result = await useAsyncData<T | null>(
    `${queryName}${queryParams}`,
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
    asyncDataOptions
  )
  if (result.error.value) {
    clearError()
    setExistError(true)
    addErrorMessages(`${result.error.value?.message}`)
  }
  console.debug(`${queryName}${queryParams}`, result.data.value)
  setIneditable(false)
  return result
}
export const listQuery = async <S, T>({
  query,
  queryName,
  filter = {},
  options = {}
}: {
  query: string
  queryName: string
  filter?: object
  options?: AsyncDataOptions<T[] | null>
}) => {
  const config = useRuntimeConfig()
  const { isSignedIn } = useLoginState()
  const { setIneditable } = useEditState()
  const { setExistError, addErrorMessages } = useErrorState()
  setIneditable(true)
  const asyncDataOptions = { lazy: false, watch: [], ...(options || {}) }
  const queryParams = isEmptyObject(filter) ? '' : JSON.stringify(sortObjectKeys(filter))
  const result = await useAsyncData<T[] | null>(
    `${queryName}${queryParams}`,
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
    asyncDataOptions
  )
  if (result.error.value) {
    clearError()
    setExistError(true)
    addErrorMessages(`${result.error.value?.message}`)
  }
  console.debug('data.value', result.data.value)
  setIneditable(false)
  return result
}
export const baseMutation = async <T, S>({
  query,
  input = {}
}: {
  query: string
  input?: object
}): Promise<S> => {
  const { isSignedIn } = useLoginState()
  const { addSnackbar } = useSnackbar()
  const { setIneditable } = useEditState()
  setIneditable(true)
  return await API.graphql<GraphQLQuery<T>>({
    query,
    variables: { input: Object.fromEntries(Object.entries(input).filter((v) => !!v[1])) },
    authMode: isSignedIn.value ? 'AMAZON_COGNITO_USER_POOLS' : 'AWS_IAM'
  })
    .then((res: any) => {
      const name = Object.keys(res.data).length && Object.keys(res.data)[0]
      if (!name) return
      console.debug(res.data[name])
      addSnackbar({ text: '保存が完了しました' })
      return res.data[name]
    })
    .catch((e) => {
      console.debug(e)
      addSnackbar({ type: 'alert', text: '保存に失敗しました' })
      clearError()
    })
    .finally(() => {
      setIneditable(false)
    })
}
export const extendMutation = async <T, S>({
  type = 'create',
  key,
  query,
  input = {},
  file
}: {
  type: 'create' | 'update' | 'delete'
  key: string
  query: string
  input?: object
  file?: File
}): Promise<S | null> => {
  const { isSignedIn } = useLoginState()
  const { addSnackbar } = useSnackbar()
  const { setIneditable } = useEditState()
  try {
    setIneditable(true)
    const { data }: any = await API.graphql<GraphQLQuery<T>>({
      query,
      variables: { input },
      authMode: isSignedIn.value ? 'AMAZON_COGNITO_USER_POOLS' : 'AWS_IAM'
    })
    const name = Object.keys(data).length && Object.keys(data)[0]
    if (type === 'delete' || type === 'update') await removeImage(key)
    if (type === 'create' || type === 'update') await putImage(key, file)
    addSnackbar({ text: '保存が完了しました' })
    setIneditable(false)
    if (name) return data[name]
    else return null
  } catch (e) {
    addSnackbar({ type: 'alert', text: '保存に失敗しました' })
    clearError()
    setIneditable(false)
    return null
  }
}
export const makeS3Object = async (file: File) => {
  if (!file) return
  const { name, type, size } = file
  const extension = type.split('/')[1]
  const { identityId } = await Auth.currentCredentials()
  const key = uuidv4() + (extension && '.') + extension
  return {
    key,
    name,
    size,
    type,
    identityId,
    file
  }
}
export const getImage = async (
  key = '',
  identityId = '',
  level: StorageAccessLevel = 'protected'
): Promise<string> => {
  // NOTE: keyは{random uuid}.{extension}の形式
  // NOTE: 返り値はデフォルト15分の有効期限付き署名付きURL(String)
  if (!key) return '/no_image.png'
  return await Storage.get(key, { level, identityId })
}
export const putImage = async (
  key?: string,
  file?: File,
  level: StorageAccessLevel = 'protected'
) => {
  if (!file || !key) return
  return await Storage.put(key, file, {
    level,
    contentType: file.type
  }).catch((e) => {
    console.debug('createImage', e)
  })
}
export const removeImage = async (key?: string, level: StorageAccessLevel = 'protected') => {
  if (!key) return
  return await Storage.remove(key, { level }).catch((e) => {
    console.debug('deleteImage', e)
  })
}
export const signUp = async (username: string, password: string) => {
  await Auth.signUp({
    username,
    password
  })
    .then((e) => {
      alert('アカウントを仮作成して、確認コードをメールアドレス宛に送信しました。\nご確認下さい。')
    })
    .catch((e) => {
      switch (e.code) {
        case 'UsernameExistsException':
          // ユーザープール内に既に同じ username が存在する場合に起こる。
          alert('既に同じメールアドレスのアカウントが存在します')
          return
        case 'InvalidPasswordException':
          // ユーザープールのポリシーで設定したパスワードの強度を満たさない場合に起こる。
          alert('設定したパスワードが必要な条件を満たしていません')
          return
        case 'InvalidParameterException':
          // 必要な属性が足りない場合や、入力された各項目が Cognito 側で正しくパースできない場合（バリデーションエラー）に起こる。
          // password が6文字未満の場合はバリデーションエラーでこちらのエラーコードが返ってくる。
          alert('必要な項目が足りないか、正しく認識することができませんでした')
          return
        default:
          // その他のエラー
          alert('ステータス：' + e.code + '\nメッセージ：' + e.message)
      }
    })
}
export const confirmSignUp = async (username: string, passcode: string) => {
  await Auth.confirmSignUp(username, passcode)
    .then((e) => {
      alert('認証できました。')
    })
    .catch((e) => {
      switch (e.code) {
        case 'CodeMismatchException':
          // 無効なコードが入力された場合に起こる。
          alert('無効なコードが入力されました')
          throw new Error('error')
        case 'LimitExceededException':
          // コードを間違え続けた場合に起こる。
          alert('規定回数以上コードを間違えて入力されました')
          throw new Error('error')
        case 'ExpiredCodeException':
          // コードが期限切れ（24時間をオーバー）した場合に起こる。
          // 注) username が存在しない・無効化されている場合にも起こる。
          alert('コードの期限が切れているか、登録いただいたメールアドレスが存在しません')
          throw new Error('error')
        case 'NotAuthorizedException':
          // 既にステータスが CONFIRMED になっている場合に起こる。
          alert('既に確認済みです')
          throw new Error('error')
        case 'CodeDeliveryFailureException':
          // 確認コードの送信に失敗した場合に起こる。
          alert('認証コードの送信に失敗しました')
          throw new Error('error')
        default:
          // その他のエラー
          alert('ステータス：' + e.code + '\nメッセージ：' + e.message)
          throw new Error('error') // 必要
      }
    })
}
export const signIn = async (username: string, password: string) => {
  await Auth.signIn(username, password)
    .then((user) => {
      console.debug(user)
    })
    .catch((e) => {
      alert('ログインに失敗しました。')
      // alert('ステータス：' + e.code + '\nメッセージ：' + e.message)
    })
}
export const resendSignUp = async (username: string) => {
  await Auth.resendSignUp(username)
    .then(() => {
      alert('確認コードを再送信しました。')
    })
    .catch((e) => {
      switch (e.code) {
        case 'CodeDeliveryFailureException':
          // 確認コードの送信に失敗した場合に起こる。
          alert('確認コードの送信に失敗しました。')
          return
        default:
          // その他のエラー
          alert('ステータス：' + e.code + '\nメッセージ：' + e.message)
      }
    })
}
export const signOut = async () => {
  await Auth.signOut().catch((e) => {
    alert('ステータス：' + e.code + ' \nメッセージ：' + e.message)
  })
}
export const updateUserAttributes = async (email: string) => {
  const user = await Auth.currentAuthenticatedUser()
  await Auth.updateUserAttributes(user, {
    email
  })
    .then(() => {
      alert(
        'メールアドレスを変更しました。\n再度。確認コードをメールアドレス宛に送信しました。\nご確認下さい。'
      )
    })
    .catch((e) => {
      alert('ステータス：' + e.code + '\nメッセージ：' + e.message)
    })
}
export const verifyUserAttributes = async (code: string) => {
  await Auth.verifyCurrentUserAttributeSubmit('email', code)
    .then(() => {
      alert('再認証できました。')
    })
    .catch((e) => {
      alert('ステータス：' + e.code + '\nメッセージ：' + e.message)
    })
}
export const changePassword = async (oldPassword: string, newPassword: string) => {
  await Auth.currentAuthenticatedUser()
    .then((user) => {
      return Auth.changePassword(user, oldPassword, newPassword)
    })
    .then(() => {
      alert('パスワードを変更しました。')
    })
    .catch((e) => {
      alert('ステータス：' + e.code + ' \nメッセージ：' + e.message)
    })
}
