import { NormSchemaItem, SchemaItem } from '@/types/entities'

export function normalizeSchema(schemas: SchemaItem[]): NormSchemaItem[] | undefined {
  if (typeof schemas?.[0] === 'string') {
    return undefined
  }

  const childrenArr = schemas.reduce<NormSchemaItem[]>((acc, schemaItem) => {
    if (schemaItem.children) {
      const normSchema = normalizeSchema(schemaItem.children as NormSchemaItem[])
      if (normSchema) {
        return [...acc, ...normSchema]
      }
    }
    return acc
  }, [])

  return [...schemas, ...childrenArr] as NormSchemaItem[]
}

export function normalizeToHashSchema(schema: SchemaItem[]): Record<string, NormSchemaItem> {
  const res = normalizeSchema(schema)?.reduce<Record<string, NormSchemaItem>>((acc, schemaItem) => {
    acc[schemaItem.id] = schemaItem
    return acc
  }, {})

  return res || {}
}
