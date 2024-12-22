'use client'

import { ResponsiveBar } from '@nivo/bar'
import { getGradeFrequency } from '~/helpers/get-grade-frequency'
import { ASCENT_STYLE, type Ascent } from '~/schema/ascent'
import styles from './ascent-pyramid.module.css'

const ascentPyramidTheme = {
  background: 'var(--surface-1)',
  text: {
    fill: 'var(--text-1)',
  },
  tooltip: {
    container: {
      background: 'var(--surface-2)',
    },
  },
  axis: {
    ticks: {
      text: {
        fill: 'var(--text-2)',
        fontFamily: 'monospace',
        fontStyle: 'normal',
        fontSize: 'var(--size-fluid-1)',
      },
    },
  },
}

export function AscentPyramid({
  ascents,
}: {
  ascents: Ascent[]
}) {
  const gradeFrequency = getGradeFrequency(ascents)

  return (
    <div className={styles.container}>
      <ResponsiveBar
        theme={ascentPyramidTheme}
        data={gradeFrequency}
        keys={ASCENT_STYLE}
        indexBy="grade"
        margin={{ bottom: 40, left: 40, top: 20 }}
        padding={0.5}
        enableGridY={false}
        // @ts-ignore
        colors={({ id, data }) => data[`${id}Color`]}
        enableLabel={false}
        motionConfig="slow"
      />
      <legend className="super-center">Pyramid of Ascents</legend>
    </div>
  )
}
