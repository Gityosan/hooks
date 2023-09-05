import { HandledS3ObjectInput, FetchOptionArgsType, FetchOptionResponseType } from '~/assets/type'
export const options = <T>({
  query = {},
  method = 'GET',
  headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  },
  body,
  onResponse,
  onResponseError,
  ...args
}: FetchOptionArgsType<T> = {}): FetchOptionResponseType => {
  const { setExistError, addErrorMessages } = useErrorState()
  body = body ? { body } : {}
  query = Object.keys(query).length ? { query } : {}
  return {
    ...body,
    ...query,
    method,
    headers,
    async onResponse(v) {
      onResponse && (await onResponse(v))
    },
    async onResponseError(v) {
      const s = v.response.status
      if (s > 400 && s < 500) showError({ statusCode: s })
      else {
        clearError()
        setExistError(true)
        addErrorMessages(`${v.response.status}:${v.response.statusText}`)
      }
      onResponseError && (await onResponseError(v))
    },
    ...args
  }
}
export const baseFetch = async <T>(
  path: string,
  option: () => FetchOptionArgsType<T> = () => ({})
) => {
  const { lazy, watch } = { lazy: false, watch: [], ...option() }
  return await useAsyncData(path, () => $fetch<T>(path, options(option())), {
    lazy,
    watch
  })
}
export const checkValidation = async (form: any): Promise<boolean> => {
  const { setExistError, setErrorMessages } = useErrorState()
  if (!form?.validate) return false
  const validate = await form?.validate()
  if (!validate.valid) {
    setExistError(true)
    setErrorMessages(
      validate.errors.map((v: any) => v.errorMessages.map((m: string) => `${v.id}：${m}`)).flat()
    )
  }
  return validate.valid
}
export const typeSafetyImage = async (
  file: HandledS3ObjectInput | string | File | null
): Promise<string> => {
  if (!file) return ''
  else if (typeof file === 'string') return file
  else if (file instanceof File) return URL.createObjectURL(file)
  else if (file.file instanceof File) return URL.createObjectURL(file.file)
  else return await getImage(file.key, file.identityId)
}
export const itemsSort = (items: any[], prop: string, order: 'asc' | 'desc' = 'asc'): any[] => {
  const extract = items.map((v, i) => {
    return { i, v: v[prop] }
  })
  if (order === 'asc') {
    extract.sort((a, b) => {
      return b.v > a.v ? -1 : b.v < a.v ? 1 : 0
    })
  } else if (order === 'desc') {
    extract.sort((a, b) => {
      return b.v < a.v ? -1 : b.v > a.v ? 1 : 0
    })
  }
  return extract.map((v) => items[v.i])
}
export const getYMD = (string: string | null = '', separator = '/') => {
  if (!string) return ''
  const date = new Date(string)
  return (
    date.getFullYear() +
    separator +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    separator +
    ('0' + date.getDate()).slice(-2)
  )
}
export const isObject = (v: unknown) => v !== null && typeof v === 'object'
export const isFile = (v: unknown): v is File => v instanceof File
export const isDate = (v: unknown): v is File => v instanceof Date
export const isEmptyObject = (v: any): v is object =>
  isObject(v) && !isFile(v) && !isDate(v) && !Object.keys(v).length
export const filterAttr = <T>(object: T, excludeAttr: string[] = []): T => {
  if (!object || !isObject(object)) return object
  for (const k in object) {
    if (excludeAttr.includes(k) || isFile(object[k])) delete object[k]
  }
  return object
}
export const sanitize = (str?: string | null): string => {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
export const reverseSanitize = (str?: string | null): string => {
  if (!str) return ''
  return String(str)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}
