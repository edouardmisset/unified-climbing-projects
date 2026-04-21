import { filterAscents } from '~/ascents/helpers/filter-ascents'
import { filterTrainingSessions } from '~/training/helpers/filter-training'
import type { Ascent } from '~/ascents/schema'
import type { TrainingSession } from '~/training/schema'
import { getAllAscents } from '~/ascents/services'
import { getAllTrainingSessions } from '~/training/services'
import { Card } from '~/shared/components/ui/card/card'
import Layout from '~/shared/components/page-layout/page-layout'
import { AscentSummary } from './_components/ascent-summary'
import { CragsSummary } from './_components/crags-summary'
import { DaysOutsideSummary } from './_components/days-outside-summary'
import { HardestClimbsSummary } from './_components/hardest-climbs-summary'
import { TopTenSummary } from './_components/top-ten-summary'
import { TrainingSummary } from './_components/training-summary/training-summary'
import { VerticalMilestoneSummary } from './_components/vertical-milestone-summary'
import { WrapUpHeader } from './_components/wrap-up-header'
import styles from './wrap-up.module.css'

async function getAscentsAndTraining(
  year?: number,
): Promise<{ ascents: Ascent[]; trainingSessions: TrainingSession[] }> {
  const [allAscents, allTrainingSessions] = await Promise.all([
    getAllAscents(),
    getAllTrainingSessions(),
  ])

  const ascents = year ? filterAscents(allAscents, { year }) : allAscents
  const trainingSessions = year
    ? filterTrainingSessions(allTrainingSessions, { year })
    : allTrainingSessions

  return { ascents, trainingSessions }
}

export default async function WrapUp({ year }: { year?: number }) {
  const { ascents, trainingSessions } = await getAscentsAndTraining(year)

  const isTrainingEmpty = trainingSessions.length === 0
  const isAscentsEmpty = ascents.length === 0

  if (isAscentsEmpty && isTrainingEmpty)
    return (
      <Layout title={<WrapUpHeader year={year} />}>
        <Card>
          <h2>No Data</h2>
          <p>
            You have not logged any data yet. {isAscentsEmpty ? 'Go climb some routes! ' : ''}{' '}
            {isTrainingEmpty ? 'Go train!' : ''}
          </p>
        </Card>
      </Layout>
    )

  return (
    <Layout gridClassName={`padding ${styles.wrapUp}`} title={<WrapUpHeader year={year} />}>
      <DaysOutsideSummary ascents={ascents} trainingSessions={trainingSessions} />
      <AscentSummary ascents={ascents} />
      <HardestClimbsSummary ascents={ascents} />
      <VerticalMilestoneSummary ascents={ascents} />
      <CragsSummary ascents={ascents} trainingSessions={trainingSessions} />
      <TrainingSummary trainingSessions={trainingSessions} />
      <TopTenSummary ascents={ascents} />
    </Layout>
  )
}
