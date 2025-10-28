import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { extractDateFromISODateString } from '~/helpers/date'
import type { AscentListProps } from '~/schema/ascent'
import type { TrainingSessionListProps } from '~/schema/training'
import { getAllAscentsFromDB, getAllTrainingSessionsFromDB } from './convex'

const BACKUP_DIRECTORY = './src/backup/'

export async function writeClimbingDBToBackupJson(): Promise<{
  ascentFile: string
  trainingFile: string
}> {
  const { ascents, trainingSessions } = await getDataFromDB()

  const ascentFileName = 'ascent-data'
  const trainingFileName = 'training-data'

  const ascentDated = generateTimestampedFilename(ascentFileName)
  const trainingDated = generateTimestampedFilename(trainingFileName)

  const files = [
    { path: join(BACKUP_DIRECTORY, ascentDated), content: ascents },
    { path: join(BACKUP_DIRECTORY, trainingDated), content: trainingSessions },
    {
      path: join(BACKUP_DIRECTORY, `${ascentFileName}.json`),
      content: ascents,
    },
    {
      path: join(BACKUP_DIRECTORY, `${trainingFileName}.json`),
      content: trainingSessions,
    },
  ] as const

  for (const { path, content } of files) {
    await writeFile(path, JSON.stringify(content), {
      flag: 'w',
    })
  }

  return { ascentFile: ascentDated, trainingFile: trainingDated }
}

export async function getDataFromDB(): Promise<DataToBackup> {
  const [ascents, trainingSessions] = await Promise.all([
    getAllAscentsFromDB(),
    getAllTrainingSessionsFromDB(),
  ])

  return { ascents, trainingSessions }
}

function generateTimestampedFilename(baseFileName: string): string {
  const date = new Date()
  const formattedDate = extractDateFromISODateString(date.toISOString())
  return `${baseFileName}-${formattedDate}.json`
}

type DataToBackup = AscentListProps & TrainingSessionListProps
