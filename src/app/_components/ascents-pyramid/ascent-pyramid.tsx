'use client'

import { ResponsiveBar } from '@nivo/bar'
import type React from 'react'
import { roundToTen } from '~/helpers/tooltips'
import type { Grade } from '~/schema/ascent'

export function AscentPyramid({
  grades,
}: { grades: { grade: Grade; number: number }[] }): React.JSX.Element {
  return (
    <>
      <p>Pyramid of Ascents</p>
      <div
        style={{
          minWidth: '375px',
          height: '375px',
        }}
      >
        <ResponsiveBar
          theme={{
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
          }}
          data={grades}
          keys={['number']}
          indexBy="grade"
          margin={{ right: 20, bottom: 40, left: 40 }}
          padding={0.5}
          layout="horizontal"
          enableGridY={false}
          maxValue={roundToTen(Math.max(...grades.map(grade => grade.number)))}
          colors="var(--blue-8)"
          animate={true}
          enableLabel={false}
          axisLeft={{
            format: (value: string) =>
              value.endsWith('+') ? value : `${value} `,
          }}
          axisBottom={{
            tickRotation: -90,
          }}
        />
      </div>
    </>
  )
}
