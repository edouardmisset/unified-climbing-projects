'use client'

import { ResponsiveBar } from '@nivo/bar'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { roundToTen } from '~/helpers/tooltips'
import { isDataResponse } from '~/types/generic'

export default function Page() {
  const {
    data: grades,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['grades'],
    queryFn: async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
        const response = await fetch(`${apiBaseUrl}/grades/frequency`)
        const json = await response.json()
        if (!isDataResponse(json)) {
          throw new Error('Invalid response from server')
        }

        const parsedAscents = z.record(z.number()).parse(json.data)

        const mappedSortedGrades = Object.entries(parsedAscents).map(
          ([key, value]) => ({
            grade: key,
            number: value,
          }),
        )

        return mappedSortedGrades
      } catch (error) {
        throw new Error('An error occurred')
      }
    },
  })

  if (isError) return <div>An error occurred</div>
  if (isLoading) return <div>Loading...</div>
  if (grades === undefined) return <div>No data</div>

  return (
    <div>
      <h1>Grade Pyramid</h1>
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
