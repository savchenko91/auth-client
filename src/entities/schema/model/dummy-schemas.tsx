/**
  Здесь содержатся супер тупые простые схемы для того чтобы можно было набрасывать
  простые формочки для всякого что требует различые данные, например bindings
*/
import { SchemaType } from '..'
import { Norm, Schema } from './types'

import { ComponentNames } from '@/entities/schema/schema-drawer/model/types'

export const dummySchemas: Norm<Schema> = {
  [ComponentNames.TextField]: {
    id: ComponentNames.TextField,
    title: ComponentNames.TextField,
    componentName: ComponentNames.TextField,
    type: SchemaType.COMP,
    comps: {
      ROOT_ID: {
        name: ComponentNames.TextField,
        id: 'ROOT_ID',
        title: ComponentNames.Stack,
        children: [],
        compSchemaId: ComponentNames.Stack,
      },
    },
  },
  [ComponentNames.Stack]: {
    id: ComponentNames.Stack,
    title: ComponentNames.Stack,
    componentName: ComponentNames.Stack,
    type: SchemaType.COMP,
    comps: {
      ROOT_ID: {
        id: 'ROOT_ID',
        name: ComponentNames.TextField,
        title: ComponentNames.Stack,
        children: [],
        compSchemaId: ComponentNames.Stack,
      },
    },
  },
}
