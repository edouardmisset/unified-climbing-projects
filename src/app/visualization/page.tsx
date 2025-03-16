import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader'
import NotFound from '~/app/not-found'
import { createYearList } from '~/data/helpers'
import { api } from '~/trpc/server'
import { VisualizationContent } from './_components/visualization-content/visualization-content'

export default async function Visualization() {
  const allAscents = await api.ascents.getAllAscents()
  const trainingSessions = await api.training.getAllTrainingSessions()

  if (!allAscents || !trainingSessions) return <NotFound />

  const ascentYears = createYearList(allAscents)
  const trainingYears = createYearList(trainingSessions)

  return (
    <Suspense fallback={<Loader />}>
      <VisualizationContent
        allAscents={allAscents}
        trainingSessions={trainingSessions}
        ascentYears={ascentYears}
        trainingYears={trainingYears}
      />
    </Suspense>
  )
}

export const metadata: Metadata = {
  title: 'Visualization 🖼️',
  description: 'Fun visuals of all my climbing ascents and training sessions',
  keywords: [
    'climbing',
    'visualization',
    'ascents',
    'qr code',
    'training',
    'barcode',
    'calendar',
  ],
}
