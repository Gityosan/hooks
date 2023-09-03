import { AsyncDataOptions } from 'nuxt/app'
import { NitroFetchOptions } from 'nitropack'
import { S3ObjectInput } from '~/assets/API'
export type HandledS3ObjectInput = S3ObjectInput & { file?: File }
export type FileInput<T> = {
  [P in keyof T]: T[P] extends S3ObjectInput | null | undefined ? HandledS3ObjectInput | null : T[P]
}
export type SnackbarTypeList = 'info' | 'warning' | 'alert' | 'success'
export type SnackbarType = {
  id?: number
  icon?: string
  text?: string
  color?: string
  background?: string
  timeout?: number
}
export type InputTypeList =
  | 'textfield'
  | 'textarea'
  | 'richtext'
  | 'switch'
  | 'fileinput'
  | 'select'
export type SchemaTypeList =
  | 'ID'
  | 'String'
  | 'Int'
  | 'Float'
  | 'Boolean'
  | 'AWSDate'
  | 'AWSTime'
  | 'AWSDateTime'
  | 'AWSTimestamp'
  | 'AWSEmail'
  | 'AWSJSON'
  | 'AWSPhone'
  | 'AWSURL'
  | 'AWSIPAddress'
  | 'S3Object'
export type InputComponentsType = {
  [key in InputTypeList]: { comp: string; props?: object }
}
export type InputType = {
  key: string
  title: string
  type: InputTypeList
  rules?: any[]
  schemaType: SchemaTypeList
  isArray: boolean
  default: any
  props?: any
}
export type FetchOptionArgsType<T> = AsyncDataOptions<T> &
  NitroFetchOptions<'GET' | 'POST' | 'PUT' | 'DELETE'>
export type FetchOptionResponseType = NitroFetchOptions<'GET' | 'POST' | 'PUT' | 'DELETE'>
