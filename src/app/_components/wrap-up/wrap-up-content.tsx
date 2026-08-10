import { filterAscents } from '~/helpers/filter-ascents'
import { filterTrainingSessions } from '~/helpers/filter-training'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { getAllAscents } from '~/services/ascents'
import { getAllTrainingSessions } from '~/services/training'
import { Card } from '../ui/card/card'
import { AscentSummary } from './_components/ascent-summary'
import { CragsSummary } from './_components/crags-summary'
import { DaysOutsideSummary } from './_components/days-outside-summary'
import { HardestClimbsSummary } from './_components/hardest-climbs-summary'
import { TopTenSummary } from './_components/top-ten-summary'
import { TrainingSummary } from './_components/training-summary/training-summary'
import { VerticalMilestoneSummary } from './_components/vertical-milestone-summary'

async function getAscentsAndTraining(
  year?: number,
): Promise<{ ascents: Ascent[]; trainingSessions: TrainingSession[] }> {
  const [allAscents, allTrainingSessions] = await Promise.all([
    getAllAscents(),
    getAllTrainingSessions(),
  ])

  const ascents = year === undefined ? allAscents : filterAscents(allAscents, { year })
  const trainingSessions =
    year === undefined ? allTrainingSessions : filterTrainingSessions(allTrainingSessions, { year })

  return { ascents, trainingSessions }
}

export async function WrapUpContent({ year }: { year?: number }) {
  const { ascents, trainingSessions } = await getAscentsAndTraining(year)

  const isTrainingEmpty = trainingSessions.length === 0
  const isAscentsEmpty = ascents.length === 0

  if (isAscentsEmpty && isTrainingEmpty)
    return (
      <Card>
        <h2>No Data</h2>
        <p>You have not logged any data yet. Go train and climb some routes!</p>
      </Card>
    )

  return (
    <>
      <DaysOutsideSummary ascents={ascents} trainingSessions={trainingSessions} />
      <AscentSummary ascents={ascents} />
      <HardestClimbsSummary ascents={ascents} />
      <VerticalMilestoneSummary ascents={ascents} />
      <CragsSummary ascents={ascents} trainingSessions={trainingSessions} />
      <TrainingSummary trainingSessions={trainingSessions} />
      <TopTenSummary ascents={ascents} />
    </>
  )
}
