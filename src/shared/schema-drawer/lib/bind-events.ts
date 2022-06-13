import { assertNotUndefined } from '@savchenko91/schema-validator'

import { actionList } from '../constants/action-list'
import { eventAssertionBindingMetaCatalog } from '../constants/event-assertion-list'
import { eventList } from '../constants/event-list'
import { ActionProps, Catalog, EventBinding, EventProps, EventType, FieldComponentContext } from '../model/types'
import bindAssertions from './bind-assertions'

import { ROOT_ID } from '@/constants/common'
import { insert, replace } from '@/lib/change-unmutable'
import { findEntities, findEntity } from '@/lib/entity-actions'

const operatorId = 'operatorId'

export default function bindEvents(context: FieldComponentContext) {
  const { eventBindingSchema } = context.comp

  if (!eventBindingSchema) {
    return
  }

  const rootBinding = eventBindingSchema.catalog[ROOT_ID]
  assertNotUndefined(rootBinding?.children)

  const eventBindingCatalog = findEntities(rootBinding.children, eventBindingSchema.catalog)

  Object.values(eventBindingCatalog).forEach((eventBinding) => {
    const eventBindingMeta = eventList[eventBinding.name]
    assertNotUndefined(eventBindingMeta)

    const actionBindingCatalog = findEntities(eventBinding.children || [], eventBindingSchema.catalog)

    const eventProps: EventProps = {
      eventBindingSchema,
      eventBindingCatalog,
      eventBinding,
      eventBindingMeta,
      actionBindingCatalog,
      context,
      emitActions,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function emitActions(value: any) {
      Object.values(actionBindingCatalog).forEach((actionBinding) => {
        const actionBindingMeta = actionList[actionBinding.name]
        assertNotUndefined(actionBindingMeta)
        const actionProps = { ...eventProps, actionBinding, actionBindingMeta }

        if (isPassedAssertions(actionProps, value)) {
          actionBindingMeta?.function({ ...eventProps, actionBinding, actionBindingMeta }, value)
        }
      })
    }

    const createdEvent = eventBindingMeta.function(eventProps)

    context.observer.addEvent(eventBinding.name, createdEvent)
  })
}

// Private

function addRootOperator(eventBindingCatalog: Catalog<EventBinding>, actionId: string) {
  const actionUnit = findEntity(actionId, eventBindingCatalog)
  const newActionUnit = { ...actionUnit, children: [operatorId] }
  const newBindings = replace(eventBindingCatalog, newActionUnit.id, newActionUnit)
  const orOperator: EventBinding = {
    id: operatorId,
    name: 'and',
    type: EventType.OPERATOR,
    children: actionUnit.children,
  }
  const newBindings2 = insert(newBindings, operatorId, orOperator)

  return newBindings2
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPassedAssertions(actionProps: ActionProps, value: any) {
  const { actionBinding, eventBindingSchema } = actionProps
  const newBindings = addRootOperator(eventBindingSchema.catalog, actionBinding.id)

  const validate = bindAssertions(eventAssertionBindingMetaCatalog, newBindings, operatorId)

  const errors = validate?.(value, { payload: actionProps, path: '' })

  return !errors
}
