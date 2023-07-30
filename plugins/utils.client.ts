import { S3Object } from '~~/assets/API'
import { InputType, FetchOptionArgsType, FetchOptionResponseType } from '~/assets/type'
// import { InputAttr } from '~~/assets/enum'
export default defineNuxtPlugin((nuxtApp: any) => {
  const { addSnackbar } = useSnackbar()
  const { setBanEdit } = useEditState()
  const { setExistError, addErrorMessages, setErrorMessages } = useErrorState()
  const setFillHeight = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  // 画面のサイズ変動があった時に高さを再計算する
  window.addEventListener('resize', setFillHeight)

  // 初期化
  setFillHeight()

  return {
    provide: {
      options: <T>({
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
      },
      baseFetch: async <T>(path: string, options: () => FetchOptionArgsType<T> = () => ({})) => {
        const { lazy, watch } = { lazy: false, watch: [], ...options() }
        return await useAsyncData(path, () => $fetch<T>(path, nuxtApp.$options(options())), {
          lazy,
          watch
        })
      },
      checkValidation: async (form: any): Promise<boolean> => {
        if (!form?.validate) return false
        const validate = await form?.validate()
        if (!validate.valid) {
          setExistError(true)
          setErrorMessages(
            validate.errors
              .map((v: any) => v.errorMessages.map((m: string) => `${v.id}：${m}`))
              .flat()
          )
        }
        return validate.valid
      },
      typeSafetyImage: async (file: S3Object | string | File | null): Promise<string> => {
        if (!file) return ''
        else if (typeof file === 'string') return file
        else if (file instanceof File) return URL.createObjectURL(file)
        else return await nuxtApp.$getImage(file.key, file.identityId)
      },
      itemsSort: (items: any[], prop: string, order: 'asc' | 'desc' = 'asc'): any[] => {
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
      },
      getYMD: (string: string | null = '', separator = '/') => {
        if (!string) return ''
        const date = new Date(string)
        return (
          date.getFullYear() +
          separator +
          ('0' + (date.getMonth() + 1)).slice(-2) +
          separator +
          ('0' + date.getDate()).slice(-2)
        )
      },
      filterAttr: (
        object?: { [key: string]: any },
        inputs: InputType[] = [],
        excludeAttr: string[] = []
      ): any => {
        if (!object) return {}
        const attr = inputs.map((v) => v.key).filter((v) => !excludeAttr.includes(v))
        const fileAttr = inputs.filter((v) => v.type === 'fileinput').map((v) => v.key)
        return attr.reduce((v: object, c) => {
          if (fileAttr.includes(c) && nuxtApp.$isObject(object[c])) {
            return {
              ...v,
              [c]: nuxtApp.$filterAttr(
                object[c],
                ['key', 'name', 'size', 'type', 'identityId'].map((key) => {
                  return { key }
                }),
                ['file']
              )
            }
          } else
            return {
              ...v,
              [c]: object[c]
            }
        }, {})
      },
      isObject: (v: unknown): v is object => v !== null && typeof v === 'object',
      isFile: (v: unknown): v is File => v instanceof File,
      isEmptyObject: (v: any) =>
        nuxtApp.$isObject(v) && !nuxtApp.$isFile(v) && !Object.keys(v).length,
      sanitize: (str?: string | null): string => {
        if (!str) return ''
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
      },
      reverseSanitize: (str?: string | null): string => {
        if (!str) return ''
        return String(str)
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
      }
    }
  }
})
