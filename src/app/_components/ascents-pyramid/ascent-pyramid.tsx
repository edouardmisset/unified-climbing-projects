'use client'

import { ResponsiveBar } from '@nivo/bar'
import { roundToTen } from '~/helpers/tooltips'
import type { Grade } from '~/schema/ascent'

export function AscentPyramid({
  grades,
}: { grades: { grade: Grade; number: number }[] }): JSX.Element {
  return (
    <>
      <p>Pyramid of Ascents</p>
      <div
        style={{
          width: '400px',
          height: '400px',
        }}
      >
        <ResponsiveBar
          theme={{
            background: 'var(--color-dark)',
            text: {
              fill: 'var(--color-light)',
            },
            tooltip: {
              container: {
                background: 'var(--color-dark)',
              },
            },
            axis: {
              ticks: {
                text: {
                  fill: 'var(--color-light)',
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
          margin={{ top: 50, right: 130, bottom: 80, left: 60 }}
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
