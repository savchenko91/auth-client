import { ROOT_ID } from '@/constants/common'
import { BindingItem, BindingItemType, Norm } from '@/entities/schema'

export const defaultCompValidators: Norm<BindingItem> = {
  [ROOT_ID]: {
    id: ROOT_ID,
    name: 'and',
    type: BindingItemType.OPERATOR,
    children: [],
  },
}