import Tree, {
  RenderItemParams,
  TreeData,
  TreeDestinationPosition,
  TreeItem,
  TreeSourcePosition,
  moveItemOnTree,
  mutateTree,
} from '@atlaskit/tree'
import { ActionButton, IconButton, Modal, PrimaryButton, Stack } from '@fluentui/react'

import React, { FC, useState } from 'react'
import { useRecoilState } from 'recoil'

import { ROOT_COMP_ID } from '@/constants/common'
import { addCompToParent, buildNewComp, findParentId, moveComps as moveComp } from '@/helpers/form-schema-state'
import { FSchemaState, pickedFCompIdState } from '@/recoil/form-schema'
import { Norm } from '@/types/entities'
import { Comp } from '@/types/form-constructor'
import useBoolean from '@/utils/use-boolean'

const PADDING_PER_LEVEL = 20

const buttonStyles = {
  root: { color: 'var(--themeDark)' },
  rootDisabled: { color: 'var(--themeTertiary)' },
}

const TreePanel: FC = (): JSX.Element => {
  const [pickedFCompId, setPickedCompId] = useRecoilState(pickedFCompIdState)
  const [FSchema, setFSchema] = useRecoilState(FSchemaState)

  const [tree, setTree] = useState(() => buildTree(FSchema.comps))

  const [isPalleteModalOpen, openPalleteModal, closePalleteModal] = useBoolean(false)

  function pickComp(key: string) {
    return () => setPickedCompId(key)
  }

  function onExpand(itemId: string | number) {
    return () => setTree(mutateTree(tree, itemId, { isExpanded: true }))
  }

  function onCollapse(itemId: string | number) {
    return () => setTree(mutateTree(tree, itemId, { isExpanded: false }))
  }

  function buildRootItem(comps: Norm<Comp>): TreeData['items'] {
    return Object.values(comps)?.reduce<Record<string, TreeItem>>((acc, comp) => {
      acc[comp.id] = {
        id: comp.id,
        isExpanded: true,
        data: comp,
        children: comp.childCompIds || [],
        hasChildren: comp.childCompIds !== undefined,
      }

      return acc
    }, {})
  }

  function buildTree(comps: Norm<Comp>): TreeData {
    const rootId = {
      id: 'rootId',
      isExpanded: true,
      data: 'test',
      children: [ROOT_COMP_ID],
    }

    return {
      rootId: rootId.id,
      items: {
        rootId,
        ...buildRootItem(comps),
      },
    }
  }

  function onDragEnd(from: TreeSourcePosition, to?: TreeDestinationPosition) {
    if (!to) {
      return
    }

    const newTree = moveItemOnTree(tree, from, to)
    setTree(newTree)

    const newFormSchema = moveComp(FSchema.comps, from, to)
    setFSchema({ ...FSchema, comps: newFormSchema })
  }

  function ExpandIcon(props: { item: RenderItemParams['item'] }) {
    if (!props.item.hasChildren) {
      return null
    }

    return props.item.isExpanded ? (
      <IconButton iconProps={{ iconName: 'ChevronDown' }} onClick={onCollapse(props.item.id)} />
    ) : (
      <IconButton iconProps={{ iconName: 'ChevronRight' }} onClick={onExpand(props.item.id)} />
    )
  }

  const renderItem = ({ item, provided }: RenderItemParams) => {
    const isSelected = item.data?.id === pickedFCompId

    return (
      <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
        <Stack horizontal>
          <Stack className="leafIcons">
            <ExpandIcon item={item} />
          </Stack>
          <ActionButton onClick={pickComp(item.data.id)} styles={!isSelected ? undefined : buttonStyles}>
            {item.data.name || ''}
          </ActionButton>
        </Stack>
      </div>
    )
  }

  return (
    <div className="TreePanel">
      <div className="addCompButton">
        <IconButton iconProps={{ iconName: 'Add' }} onClick={openPalleteModal} />
      </div>
      <Modal titleAriaId={'Add comp'} isOpen={isPalleteModalOpen} onDismiss={closePalleteModal} isBlocking={false}>
        <PrimaryButton
          onClick={() => {
            const newFormSchema = addCompToParent(
              pickedFCompId ? findParentId(pickedFCompId, FSchema.comps) : 'stackRootId',
              0,
              buildNewComp('TextInput'),
              FSchema.comps
            )

            setFSchema({ ...FSchema, comps: newFormSchema })

            closePalleteModal()
          }}
        >
          TextInput
        </PrimaryButton>
      </Modal>
      <Tree
        tree={tree}
        renderItem={renderItem}
        // onExpand={() => {}}
        // onCollapse={() => {}}
        onDragEnd={onDragEnd}
        offsetPerLevel={PADDING_PER_LEVEL}
        isDragEnabled
        isNestingEnabled
      />
    </div>
  )
}

export default TreePanel
