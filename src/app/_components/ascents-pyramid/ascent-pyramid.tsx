'use client'

import { ResponsiveBar } from '@nivo/bar'
import { roundToTen } from '~/helpers/tooltips'
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
const gradeAxisFormatter = {
  format: (value: string) => (value.endsWith('+') ? value : `${value} `),
}

export function AscentPyramid({
  grades,
}: { grades: { grade: Grade; number: number }[] }) {
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
          data={grades}
          keys={['number']}
          indexBy="grade"
          margin={{ right: 40, bottom: 40, left: 40 }}
          padding={0.5}
          layout="horizontal"
          enableGridY={false}
          maxValue={roundToTen(Math.max(...grades.map(grade => grade.number)))}
          colors="var(--blue-8)"
          animate={true}
          enableLabel={false}
          tooltipLabel={grade =>
            `${grade.data.grade} => ${grade.data.number} ascents`
          }
          axisLeft={gradeAxisFormatter}
          axisBottom={{
            tickRotation: -90,
          }}
        />
      </div>
    </>
  )
}
