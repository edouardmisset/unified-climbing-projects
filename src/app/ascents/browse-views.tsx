'use client'

import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { FilteredAscentList } from '~/app/_components/filtered-ascents-list/filtered-ascents-list'
import { TableAndSelect } from './top-ten/_components/table-and-select'
import type { Ascent } from '~/schema/ascent'
import styles from './browse-views.module.css'

const BROWSE_VIEWS = ['all', 'top-ten'] as const

export function BrowseViews({ ascents }: { ascents: Ascent[] }) {
  const [view, setView] = useQueryState(
    'view',
    parseAsStringLiteral(BROWSE_VIEWS).withDefault('all').withOptions({ history: 'push' }),
  )

  return (
    <div className={styles.container}>
      <div aria-label='Ascent view' className={styles.viewSwitch}>
        <button
          aria-pressed={view === 'all'}
          data-selected={view === 'all'}
          onClick={() => {
            void setView('all')
          }}
          type='button'
        >
          All ascents
        </button>
        <button
          aria-pressed={view === 'top-ten'}
          data-selected={view === 'top-ten'}
          onClick={() => {
            void setView('top-ten')
          }}
          type='button'
        >
          Top ten
        </button>
      </div>
      {view === 'all' ? (
        <FilteredAscentList ascents={ascents} />
      ) : (
        <TableAndSelect ascents={ascents} />
      )}
    </div>
  )
}
