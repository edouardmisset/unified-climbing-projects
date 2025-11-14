import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { api } from '~/trpc/server'
import { Card } from '../card/card'
import Layout from '../page-layout/page-layout'
import { AscentSummary } from './_components/ascent-summary'
import { CragsSummary } from './_components/crags-summary'
import { DaysOutsideSummary } from './_components/days-outside-summary'
import { HardestClimbsSummary } from './_components/hardest-climbs-summary'
import { TopTenSummary } from './_components/top-ten-summary'
import { VerticalMilestoneSummary } from './_components/vertical-milestone-summary'
import { WrapUpHeader } from './_components/wrap-up-header'
import styles from './wrap-up.module.css'

async function getAscentsAndTraining(
  year?: number,
): Promise<{ ascents: Ascent[]; trainingSessions: TrainingSession[] }> {
  const [ascents, trainingSessions] = await Promise.all([
    api.ascents.getAll({ year }),
    api.training.getAll({ year }),
  ])
  return { ascents, trainingSessions }
}

export default async function WrapUp({ year }: { year?: number }) {
  const { ascents, trainingSessions } = await getAscentsAndTraining(year)

  const isTrainingEmpty = trainingSessions.length === 0
  const isAscentsEmpty = ascents.length === 0

  if (isAscentsEmpty && isTrainingEmpty) {
    return (
      <Layout title={<WrapUpHeader year={year} />}>
        <Card>
          <h2>No Data</h2>
          <p>
            You have not logged any data yet.{' '}
            {isAscentsEmpty ? 'Go climb some routes! ' : ''}{' '}
            {isTrainingEmpty ? 'Go train!' : ''}
          </p>
        </Card>
      </Layout>
    )
  }

  return (
    <Layout
      gridClassName={`padding ${styles.wrapUp}`}
      title={<WrapUpHeader year={year} />}
    >
      <DaysOutsideSummary
        ascents={ascents}
        trainingSessions={trainingSessions}
      />
      <AscentSummary ascents={ascents} />
      <HardestClimbsSummary ascents={ascents} />
      <VerticalMilestoneSummary ascents={ascents} />
      <CragsSummary ascents={ascents} trainingSessions={trainingSessions} />
      <TopTenSummary ascents={ascents} />
    </Layout>
  )
}
