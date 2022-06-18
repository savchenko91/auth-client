import { ROOT_ID } from '@/constants/common'
import { Catalog, EventBinding, EventBindingType } from '@/shared/schema-drawer'

export const defaultCompBindings: Catalog<EventBinding> = {
  [ROOT_ID]: {
    id: ROOT_ID,
    name: 'root',
    type: EventBindingType.ROOT,
    children: [],
  },
}
