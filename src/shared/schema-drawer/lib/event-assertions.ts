import { EventAssertionMeta } from '../model/types'

interface AssertUndefinedProps {
  name: string
  isInit: boolean
}

export function assertUndefined(v: unknown, assertionProps: AssertUndefinedProps, meta: EventAssertionMeta) {
  const { context } = meta.payload
  const fieldState = context.formProps.form.getFieldState(assertionProps.name)
  const targetValue = fieldState?.[assertionProps.isInit ? 'initial' : 'value']

  if (targetValue !== undefined) {
    throw new Error('Target init value is not undefined')
  }
}

//

interface AssertVisitedProps {
  name: string
}

export function assertVisited(v: unknown, assertionProps: AssertVisitedProps, meta: EventAssertionMeta) {
  const { context } = meta?.payload
  const visited = context.formProps.form.getFieldState(assertionProps.name)?.visited

  if (visited) {
    throw new Error('Field was not visited')
  }
}

interface AssertMatchPatternProps {
  pattern: string
  name: string
}

export function assertMatchPattern(v: unknown, assertionProps: AssertMatchPatternProps, meta: EventAssertionMeta) {
  const { context } = meta?.payload
  const targetValue = context.formProps.form.getFieldState(assertionProps.name)?.value

  const isMatch = new RegExp(assertionProps.pattern).test(targetValue?.toString())

  if (!isMatch) {
    throw new Error('Does not match the pattern')
  }
}