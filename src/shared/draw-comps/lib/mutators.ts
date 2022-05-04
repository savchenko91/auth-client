import { TreeSourcePosition } from '@atlaskit/tree'
import { assertNotUndefined, isEmpty, isString } from '@savchenko91/schema-validator'

import uuid from 'uuid-random'

import { Comp, Norm } from '@/common/types'
import { ROOT_COMP_ID } from '@/constants/common'
import { remove, replace, replaceById } from '@/utils/change-unmutable'

// TODO в будущем будет убирать еще и байндинги
export function copyComp(comp: Comp): Comp {
  return { ...comp, id: uuid() }
}

export function copyComps(comps: Norm<Comp>): Norm<Comp> {
  return Object.values(comps).reduce<Norm<Comp>>((acc, comp) => {
    const newComp = copyComp(comp)
    acc[newComp.id] = newComp
    return acc
  }, {})
}

export function findParent(id: string, comps: Norm<Comp>): Comp {
  const comp = Object.values(comps).find(({ childCompIds }) => childCompIds?.includes(id))

  assertNotUndefined(comp)

  return comp
}

export function getCompPosition(compId: string, comps: Norm<Comp>): TreeSourcePosition {
  if (compId === ROOT_COMP_ID) {
    throw new Error('Do not pass ROOT_COMP_ID')
  }

  const parentComp = findParent(compId, comps)
  const index = parentComp.childCompIds?.indexOf(compId)

  assertNotUndefined(index)

  return {
    index,
    parentId: parentComp.id,
  }
}

export function getComp(id: string, comps: Norm<Comp>): Comp {
  const comp = comps[id]
  assertNotUndefined(comp)
  return comp
}
export function getComps(ids: string[], comps: Norm<Comp>): Norm<Comp> {
  return ids.reduce<Norm<Comp>>((acc, id) => {
    acc[id] = getComp(id, comps)
    return acc
  }, {})
}

/**
 * Returns parent comp
 */
export function removeChildId(comp: Comp, childIdOrIndex: string | number): Comp {
  assertNotUndefined(comp.childCompIds)

  const index = isString(childIdOrIndex) ? comp.childCompIds.indexOf(childIdOrIndex) : childIdOrIndex

  if (index === -1) {
    throw new Error('child does not exist in comp')
  }

  const newChildCompIds = remove(comp.childCompIds, index)

  // Поле childCompIds не должно существовать если дети отсутствуют
  if (isEmpty(newChildCompIds.length)) {
    return remove(comp, 'childCompIds')
  }

  return replace(comp, 'childCompIds', newChildCompIds)
}

export function removeComp(compId: string, comps: Norm<Comp>): Norm<Comp> {
  const parentComp = findParent(compId, comps)
  // Remove from comps
  const changedComps = remove(comps, compId)
  // Remove from parent
  const changedParentComp = removeChildId(parentComp, compId)

  return replaceById(changedParentComp, changedComps)
}