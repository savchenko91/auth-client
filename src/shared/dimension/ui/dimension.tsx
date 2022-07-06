import { ActionButton, IconButton, Panel, PanelType, Text } from '@fluentui/react'
import { assertNotUndefined, isString } from '@savchenko91/schema-validator'

import './dimension.css'

import React, { useEffect, useState } from 'react'
import useCollapse from 'react-collapsed'

import { findParents } from '@/lib/entity-actions'
import { TreeCheckbox } from '@/shared/checkbox'
import { CompSchema, FieldComponentContext, LinkedComp, assertLinkedComp } from '@/shared/schema-drawer'
import Stack from '@/shared/stack'

interface DimensionProps {
  value: Record<string, string[]> | string | undefined
  children: string[]
  context: FieldComponentContext
  onChange: (value: Record<string, string[]>) => void
}

Dimension.defaultValues = {
  schemas: {},
}

export default function Dimension(props: DimensionProps): JSX.Element {
  const [isOpen, setOpen] = useState(false)
  const [value, setValue] = useState(isString(props.value) ? undefined : props.value)

  const { getCollapseProps, getToggleProps, isExpanded, setExpanded } = useCollapse({
    defaultExpanded: true,
  })

  useEffect(() => setValue(value), [props.value])

  const compsAndSchemas = props.context.comp.children?.reduce<[LinkedComp, CompSchema][]>((acc, id) => {
    const comp = props.context.comps[id]
    assertLinkedComp(comp)

    const schema = props.context.schemas[comp.linkedSchemaId]

    if (schema) {
      acc.push([comp, schema])
    }

    return acc
  }, [])

  function onChange(name: string, data: string[]) {
    setValue((value) => {
      const newValue = {
        ...value,
        [name]: data,
      }
      props.onChange(newValue)
      return newValue
    })
  }

  return (
    <div className="Dimension">
      <Stack horizontal verticalAlign="center">
        <ActionButton
          {...getToggleProps()}
          styles={{
            root: {
              paddingLeft: '0',
            },
            icon: {
              marginLeft: '0',
            },
            label: {
              color: 'var(--themePrimary)',
            },
          }}
          iconProps={{ iconName: isExpanded ? 'ChevronDown' : 'ChevronRight' }}
          onClick={() => setExpanded((prevExpanded) => !prevExpanded)}
        >
          Классификаторы
        </ActionButton>
        <IconButton onClick={() => setOpen(true)} iconProps={{ iconName: 'Edit' }} />
      </Stack>
      <div {...getCollapseProps()}>
        <table>
          {compsAndSchemas?.map(([comp, schema]) => {
            return (
              <tr key={schema.id}>
                <Text as="td" key={schema.id} className="column titleColumn">
                  {comp?.title}:
                </Text>
                <td className="column dimensionColumn">
                  {value?.[schema?.title]?.map((id) => {
                    const entity = schema.data[id] as LinkedComp
                    assertNotUndefined(entity)
                    const parents = (findParents(id, schema.data) || []) as LinkedComp[]
                    return <div key={id}>{[...parents, entity]?.map(({ title }) => title).join('> ')}</div>
                  })}
                </td>
              </tr>
            )
          })}
        </table>
      </div>
      <Panel
        type={PanelType.customNear}
        customWidth={'720px'}
        className="DimensionModal"
        isOpen={isOpen}
        onDismiss={() => setOpen(false)}
      >
        <div className="rootContainer">
          {compsAndSchemas?.map(([comp, schema]) => {
            return (
              <TreeCheckbox
                key={schema.id}
                name={schema.title}
                value={value?.[schema.title] || []}
                schema={schema}
                onChange={(data: string[]) => onChange(schema.title, data)}
                multiselect={comp.props?.multiselect}
              />
            )
          })}
        </div>
      </Panel>
    </div>
  )
}
