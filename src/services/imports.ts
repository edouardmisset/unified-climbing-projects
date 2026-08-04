import 'server-only'

import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { api } from '~/../convex/_generated/api'
import type { Id } from '~/../convex/_generated/dataModel'
import type { AscentImportRow } from '~/domain/ascent'
import {
  createAscentFingerprintInput,
  createTrainingSessionFingerprintInput,
} from '~/domain/fingerprint-input'
import type { TrainingSessionImportRow } from '~/domain/training-session'
import { getConvexAuthToken } from './convex'

const IMPORT_BATCH_SIZE = 100

type ImportKind = 'ascents' | 'training'
type ImportRows = AscentImportRow[] | TrainingSessionImportRow[]

function chunks<T>(rows: readonly T[]): T[][] {
  const result: T[][] = []
  for (let index = 0; index < rows.length; index += IMPORT_BATCH_SIZE)
    result.push(rows.slice(index, index + IMPORT_BATCH_SIZE))
  return result
}

export async function previewCanonicalImport(kind: ImportKind, rows: ImportRows) {
  const token = await getConvexAuthToken()
  const duplicateInputs =
    kind === 'ascents'
      ? (rows as AscentImportRow[]).map(row => createAscentFingerprintInput(row))
      : (rows as TrainingSessionImportRow[]).map(row => createTrainingSessionFingerprintInput(row))
  const duplicatesInFile = duplicateInputs.length - new Set(duplicateInputs).size
  const existingMatches: boolean[] = []

  if (kind === 'ascents')
    for (const batch of chunks(rows as AscentImportRow[])) {
      // Preview batches are sequential to cap backend request pressure.
      // eslint-disable-next-line no-await-in-loop
      const matches = await fetchQuery(api.imports.findExistingAscents, { rows: batch }, { token })
      existingMatches.push(...matches)
    }
  else
    for (const batch of chunks(rows as TrainingSessionImportRow[])) {
      // Preview batches are sequential to cap backend request pressure.
      // eslint-disable-next-line no-await-in-loop
      const matches = await fetchQuery(
        api.imports.findExistingTrainingSessions,
        { rows: batch },
        { token },
      )
      existingMatches.push(...matches)
    }

  return {
    duplicatesInFile,
    existingMatches: existingMatches.filter(Boolean).length,
    total: rows.length,
  }
}

export async function runCanonicalImport(
  kind: ImportKind,
  rows: ImportRows,
  allowDuplicates: boolean,
) {
  const token = await getConvexAuthToken()
  const jobId = await fetchMutation(api.imports.createJob, { kind, total: rows.length }, { token })
  let inserted = 0
  let skipped = 0

  try {
    if (kind === 'ascents')
      for (const batch of chunks(rows as AscentImportRow[])) {
        // Inserts are intentionally ordered so a failed batch stops the import.
        // eslint-disable-next-line no-await-in-loop
        const result = await fetchMutation(
          api.imports.insertAscents,
          { allowDuplicates, jobId, rows: batch },
          { token },
        )
        inserted += result.inserted
        skipped += result.skipped
      }
    else
      for (const batch of chunks(rows as TrainingSessionImportRow[])) {
        // Inserts are intentionally ordered so a failed batch stops the import.
        // eslint-disable-next-line no-await-in-loop
        const result = await fetchMutation(
          api.imports.insertTrainingSessions,
          { allowDuplicates, jobId, rows: batch },
          { token },
        )
        inserted += result.inserted
        skipped += result.skipped
      }
    await fetchMutation(api.imports.finishJob, { failed: false, jobId }, { token })
    return { inserted, jobId, skipped }
  } catch (error) {
    // Preserve the original import failure if recording the terminal status also fails.
    await fetchMutation(api.imports.finishJob, { failed: true, jobId }, { token }).catch(() => {})
    throw error
  }
}

export async function undoCanonicalImport(jobId: string) {
  const token = await getConvexAuthToken()
  let deleted = 0
  let isDone = false
  while (!isDone) {
    // Undo is bounded by the backend and must advance one batch at a time.
    // eslint-disable-next-line no-await-in-loop
    const result = await fetchMutation(
      api.imports.undoBatch,
      { jobId: jobId as Id<'importJobs'> },
      { token },
    )
    deleted += result.deleted
    ;({ isDone } = result)
  }
  return { deleted }
}

export async function getRecentImportJobs() {
  const token = await getConvexAuthToken()
  return fetchQuery(api.imports.listJobs, {}, { token })
}
