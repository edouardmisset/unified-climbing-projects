'use server'

import type { AscentImportRow } from '~/domain/canonical/ascent'
import type { TrainingSessionImportRow } from '~/domain/canonical/training-session'
import { previewCanonicalImport, runCanonicalImport, undoCanonicalImport } from '~/services/imports'

const MAX_IMPORT_ROWS = 10_000

function assertImportRequest(
  kind: 'ascents' | 'training',
  rows: AscentImportRow[] | TrainingSessionImportRow[],
): void {
  if (!['ascents', 'training'].includes(kind) || !Array.isArray(rows))
    throw new Error('Invalid import request')
  if (rows.length === 0 || rows.length > MAX_IMPORT_ROWS)
    throw new Error('Import must contain between 1 and 10,000 rows')
}

export async function previewImport(
  kind: 'ascents' | 'training',
  rows: AscentImportRow[] | TrainingSessionImportRow[],
) {
  assertImportRequest(kind, rows)
  return previewCanonicalImport(kind, rows)
}

export async function runImport(
  kind: 'ascents' | 'training',
  rows: AscentImportRow[] | TrainingSessionImportRow[],
  allowDuplicates: boolean,
) {
  assertImportRequest(kind, rows)
  if (typeof allowDuplicates !== 'boolean') throw new Error('Invalid duplicate policy')
  return runCanonicalImport(kind, rows, allowDuplicates)
}

export async function undoImport(jobId: string) {
  if (typeof jobId !== 'string' || jobId.length === 0) throw new Error('Invalid import job')
  return undoCanonicalImport(jobId)
}
