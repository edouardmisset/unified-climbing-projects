import { objectKeys } from '@edouardmisset/object'
import { JWT } from 'google-auth-library'
import {
  GoogleSpreadsheet,
  type GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet'
import { env } from '~/env'
import type { Object_ } from '~/types/generic'

const serviceAccountAuth = new JWT({
  email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`)?.join('\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

export async function loadBackupSpreadsheet(
  climbingDataType: 'ascent' | 'training',
): Promise<GoogleSpreadsheet> {
  const id =
    climbingDataType === 'ascent'
      ? env.GOOGLE_SHEET_ID_ASCENTS_BACKUP
      : env.GOOGLE_SHEET_ID_TRAINING_BACKUP

  try {
    const doc = new GoogleSpreadsheet(id, serviceAccountAuth)
    await doc.loadInfo()
    return doc
  } catch (error) {
    throw new Error(
      `Failed to load ${climbingDataType} backup spreadsheet (ID: ${id}): ${error instanceof Error ? error.message : String(error)}`, { cause: error },
    )
  }
}

export async function createOrReplaceWorksheet(
  spreadsheet: GoogleSpreadsheet,
  title: string,
): Promise<GoogleSpreadsheetWorksheet> {
  const existingSheet = spreadsheet.sheetsByTitle[title]
  if (existingSheet) {
    await existingSheet.delete()
  }

  return await spreadsheet.addSheet({ title })
}

export async function backupDataToWorksheet<T extends Object_>(
  sheet: GoogleSpreadsheetWorksheet,
  data: T[],
): Promise<void> {
  if (data.length === 0) {
    return
  }

  const headersSet = new Set<string>()
  for (const element of data) {
    for (const key of objectKeys(element)) {
      headersSet.add(key as string)
    }
  }

  await sheet.setHeaderRow([...headersSet])
  await sheet.addRows(
    data as Parameters<GoogleSpreadsheetWorksheet['addRows']>[0],
  )
}
