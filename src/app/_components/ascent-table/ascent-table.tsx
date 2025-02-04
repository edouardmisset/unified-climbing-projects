'use client'

import { useMemo } from 'react'
import type { Ascent } from '~/schema/ascent'
import styles from './ascent-table.module.css'

import { HotTable } from '@handsontable/react-wrapper'
import { registerAllModules } from 'handsontable/registry'
import { formatDateTime } from '~/helpers/date'

import 'handsontable/styles/handsontable.min.css'
import 'handsontable/styles/ht-theme-main.min.css'

registerAllModules()

export function AscentTable({ ascents }: { ascents: Ascent[] }) {
  const schema = {
    routeName: 'Route Name',
    topoGrade: 'Topo Grade',
    tries: '# Tries',
    style: 'Style',
    // height: 'Height',
    // profile: 'Profile',
    // holds: 'Holds',
    // rating: 'Rating',
    climbingDiscipline: 'Discipline',
    crag: 'Crag',
    date: 'Date',
    // comments: 'Ascent Comments',
  }

  const formattedAscents = useMemo(
    () =>
      ascents.map(ascent => ({
        ...ascent,
        date: formatDateTime(new Date(ascent.date), 'shortDate'),
      })),
    [ascents],
  )

  return (
    <div className={styles.container}>
      <div className="ht-theme-main-dark-auto">
        <HotTable
          data={formattedAscents}
          dataSchema={schema}
          colHeaders={Object.keys(schema).map(
            key => schema[key as keyof typeof schema],
          )}
          columnSorting={true}
          columns={Object.keys(schema).map(key => ({ data: key }))}
          height="auto"
          licenseKey="non-commercial-and-evaluation" // for non-commercial use only
        />
      </div>
    </div>
  )
}
