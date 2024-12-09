'use client'

import { ResponsiveBar } from '@nivo/bar'
import type { Grade } from '~/schema/ascent'

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
  gradeFrequency,
}: {
  gradeFrequency: {
    grade: Grade
    Onsight: number
    OnsightColor: string
    Flash: number
    FlashColor: string
    Redpoint: number
    RedpointColor: string
  }[]
}) {
  return (
    <>
      <p>Pyramid of Ascents</p>
      <div
        style={{
          minInlineSize: '375px',
          blockSize: '375px',
        }}
      >
        <ResponsiveBar
          theme={ascentPyramidTheme}
          data={gradeFrequency}
          keys={['Onsight', 'Flash', 'Redpoint']}
          indexBy="grade"
          margin={{ bottom: 40, left: 40, top: 20 }}
          padding={0.5}
          enableGridY={false}
          // @ts-ignore
          colors={({ id, data }) => data[`${id}Color`]}
          animate={true}
          enableLabel={false}
          motionConfig="slow"
        />
      </div>
    </>
  )
}
