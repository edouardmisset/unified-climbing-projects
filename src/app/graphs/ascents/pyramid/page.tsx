'use client'

import { ResponsiveBar } from '@nivo/bar'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { z } from 'zod'
import { isDataResponse } from '~/types/generic'

const data = [
  {
    day: 'Monday',
    temperature: 59,
  },
  {
    day: 'Tuesday',
    temperature: 61,
  },
  {
    day: 'Wednesday',
    temperature: 55,
  },
  {
    day: 'Thursday',
    temperature: 78,
  },
  {
    day: 'Friday',
    temperature: 71,
  },
  {
    day: 'Saturday',
    temperature: 56,
  },
  {
    day: 'Sunday',
    temperature: 67,
  },
]

export default function Page() {
  const { data } = useQuery({
    queryKey: ['grades'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/api/grades/frequency')
      const json = await response.json()
      if (!isDataResponse(json)) {
        throw new Error('Invalid response from server')
      }

      return json
    },
  })

  const parsedData =
    data === undefined ? [] : z.record(z.number()).parse(data.data)

  const grades = Object.entries(parsedData).map(([key, value]) => ({
    grade: key,
    number: value,
  }))

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
          }}
          data={[...grades].sort((a, b) => b.grade.localeCompare(a.grade))} 
          keys={['number']}
          indexBy="grade"
          margin={{ top: 50, right: 130, bottom: 80, left: 60 }}
          padding={0.4}
          valueScale={{ type: 'linear' }}
          colors="var(--blue-8)"
          animate={true}
          enableLabel={false}
          axisTop={null}
          axisRight={null}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'grade',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          axisBottom={{
            tickRotation: -90,
          }}
        />
      </div>
    </div>
  )
}
