export interface Comp {
  id: string
  compSchemaId: string
  name: string
  path: string
  // дефвалуе вынести в пропс и юзер не должен в пас писать слово пропс для формы элемента
  defaultValue?: string
  props?: Record<string, unknown>
  children?: string[]
  validators?: Norm<CompValidator>
}

export interface Schema {
  componentName: null | string
  id: string
  name: string
  type: FormType
  comps: Record<string, Comp>
}

export enum FormType {
  FORM = 'FORM',
  PRESET = 'PRESET',
  COMP = 'COMP',
}

export interface CompValidator {
  id: string
  name: string
  children: string[]
  input2?: unknown
}

export type Norm<T> = Record<string, T>

export interface History<Data> {
  prev: null | History<Data>
  next: null | History<Data>
  data: Data
}

export interface FindManyParams<T = number> {
  take?: T
  skip?: T
}

export interface SearchQuery {
  searchQuery?: string
}

export interface CreateUser {
  username: string
  password: string
  email: string
  fullname: string
}

export interface UpdateUser extends CreateUser {
  id: string
}
