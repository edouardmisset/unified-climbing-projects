import { NextResponse } from 'next/server'
import { getWeekNumber } from '~/helpers/date'
import { getDataFromDB } from '~/services/backup'
import {
  backupDataToWorksheet,
  createOrReplaceWorksheet,
  loadBackupSpreadsheet,
} from '~/services/google-sheets'

export async function GET() {
  try {
    const now = new Date()
    const { ascents, trainingSessions } = await getDataFromDB()

    const [ascentsSpreadsheet, trainingSpreadsheet] = await Promise.all([
      loadBackupSpreadsheet('ascent'),
      loadBackupSpreadsheet('training'),
    ])

    const sheetTitle = `Week-${getWeekNumber(now)}-${now.getFullYear()}`
    const [ascentsBackupSheet, trainingBackupSheet] = await Promise.all([
      createOrReplaceWorksheet(ascentsSpreadsheet, sheetTitle),
      createOrReplaceWorksheet(trainingSpreadsheet, sheetTitle),
    ])

    await Promise.all([
      backupDataToWorksheet(ascentsBackupSheet, ascents),
      backupDataToWorksheet(trainingBackupSheet, trainingSessions),
    ])

    return NextResponse.json(
      {
        ok: true,
        ascents: ascents.length,
        trainingSessions: trainingSessions.length,
      },
      { status: 204 },
    )
  } catch (error) {
    globalThis.console.error('Cron backup failed', error)
    return NextResponse.json({ ok: false, error: 'Cron backup failed' }, { status: 500 })
  }
}
