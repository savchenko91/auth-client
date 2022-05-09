import { IContextualMenuItem, Icon } from '@fluentui/react'

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Comp, Norm, Schema } from '@/common/types'
import { ROOT_ID } from '@/constants/common'
import ContextualMenu from '@/shared/contextual-menu/contextual-menu'

interface CompContextualMenuProps {
  remove: (compId: string) => void
  openSchemaInNewTab: (schemaId: string) => void
  schemas: Norm<Schema> | null
  comp: Comp
}

export default function CompContextualMenu(props: CompContextualMenuProps): JSX.Element | null {
  const { t } = useTranslation()

  const items: IContextualMenuItem[] = []

  if (props.comp.id !== ROOT_ID) {
    items.push({
      key: 'remove',
      text: t('buttons.remove'),
      onClick: () => props.remove(props.comp.id),
    })
  }

  if (props.schemas?.[props.comp.id]) {
    items.push({
      key: 'editThisForm',
      text: t('formConstructorPage.editThisForm'),
      onClick: () => props.openSchemaInNewTab(props.comp.compSchemaId),
    })
  }

  return (
    <ContextualMenu items={items}>
      <Icon iconName="More" />
    </ContextualMenu>
  )
}