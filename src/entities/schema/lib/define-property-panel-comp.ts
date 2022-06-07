import { assertNotUndefined } from '@savchenko91/schema-validator'

import { Schema } from '@/shared/schema-drawer'

export default function defineSelectedComp(currentSchema: Schema | null, selectedCompIds: string[]) {
  if (selectedCompIds.length > 1) {
    return null
  }

  if (selectedCompIds.length !== 0 && currentSchema) {
    const selectedComp = currentSchema.comps[selectedCompIds[0] || '']

    assertNotUndefined(selectedComp)

    return selectedComp
  }

  return null
}
