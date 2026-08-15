import LogWizard from './_components/log-wizard'

import { getAllAscents } from '~/services/ascents'
import { getAllTrainingSessions } from '~/services/training'
import { buildLogWizardBootstrap } from './log-defaults'

export async function LogFormWrapper() {
  const [ascents, trainingSessions] = await Promise.all([getAllAscents(), getAllTrainingSessions()])
  return <LogWizard bootstrap={buildLogWizardBootstrap(ascents, trainingSessions)} />
}
