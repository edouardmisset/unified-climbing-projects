'use client'

import { ResponsiveBar } from '@nivo/bar'
import { roundToTen } from '~/helpers/tooltips'
import { api } from '~/trpc/react'

export default function Page() {
  const [data, { isError, isLoading }] =
    api.grades.getFrequency.useSuspenseQuery()

  const grades = data.map(([key, value]) => ({
    grade: key,
    number: value,
  }))

  if (isError) return <div>An error occurred</div>
  if (isLoading) return <div>Loading...</div>
  if (grades === undefined) return <div>No data</div>

  return (
    <div>
      <h1>Dashboard</h1>
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
    </div>
  )
}
