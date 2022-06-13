import { IPivotProps, PivotItem, Pivot as PivotUI } from '@fluentui/react'

import React from 'react'

import { Catalog, Comp } from '@/shared/schema-drawer'

type PivotProps = IPivotProps & { label: string; children: React.ReactNode[] }

export default function Pivot(props: PivotProps): JSX.Element {
  return (
    // ставим paddingLeft хардкодом потому что так надо :)
    <PivotUI {...props} styles={{ root: { paddingLeft: '16px' } }}>
      {props.children?.map((child) => {
        // @ts-expect-error because
        const { compId, comps } = child.props as { compId: string; comps: Catalog<Comp> }
        const comp = comps[compId] as Comp

        return (
          <PivotItem key={comp.id} {...comp.props}>
            {child}
          </PivotItem>
        )
      })}
    </PivotUI>
  )
}
