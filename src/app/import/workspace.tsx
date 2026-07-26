'use client'

import { useRouter } from 'next/navigation'
import { type ChangeEvent, useState } from 'react'
import { parse8aNuAscentCsv } from '~/domain/canonical/8a-nu'
import type { AscentImportRow } from '~/domain/canonical/ascent'
import { parseAscentCsv, parseTrainingSessionCsv } from '~/domain/canonical/csv-contract'
import { decodeUtf8Csv } from '~/domain/canonical/csv'
import type { TrainingSessionImportRow } from '~/domain/canonical/training-session'
import type { getRecentImportJobs } from '~/services/imports'
import { previewImport, runImport, undoImport } from './actions'
import styles from './workspace.module.css'

// Product contract: canonical import files are capped at 5 MiB.
// oxlint-disable-next-line no-magic-numbers
const MAX_FILE_BYTES = 5 * 1_024 * 1_024
const MAX_ROWS = 10_000
type ImportKind = 'ascents' | 'training'
type ImportSource = '8a-nu' | 'canonical-ascents' | 'canonical-training'
type ImportRows = AscentImportRow[] | TrainingSessionImportRow[]
type ImportPreview = {
  duplicatesInFile: number
  existingMatches: number
  total: number
}

function parseImportSource(source: ImportSource, text: string): ImportRows {
  if (source === '8a-nu') return parse8aNuAscentCsv(text)
  if (source === 'canonical-ascents') return parseAscentCsv(text)
  return parseTrainingSessionCsv(text)
}

type ImportWorkspaceProps = {
  recentJobs: Awaited<ReturnType<typeof getRecentImportJobs>>
}

export function ImportWorkspace({ recentJobs }: ImportWorkspaceProps) {
  const router = useRouter()
  const [source, setSource] = useState<ImportSource>('canonical-ascents')
  const [rows, setRows] = useState<ImportRows>([])
  const [preview, setPreview] = useState<ImportPreview>()
  const [allowDuplicates, setAllowDuplicates] = useState(false)
  const [message, setMessage] = useState('')
  const [isWorking, setIsWorking] = useState(false)

  const selectFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setRows([])
    setPreview(undefined)
    setMessage('')
    if (!file) return
    if (file.size > MAX_FILE_BYTES) {
      setMessage('File exceeds the 5 MB limit. Split it into smaller files.')
      return
    }

    setIsWorking(true)
    try {
      const text = decodeUtf8Csv(await file.arrayBuffer())
      const parsed = parseImportSource(source, text)
      if (parsed.length === 0) throw new Error('The file has headers but no data rows.')
      if (parsed.length > MAX_ROWS)
        throw new Error('File exceeds 10,000 rows. Split it into smaller files.')
      const kind: ImportKind = source === 'canonical-training' ? 'training' : 'ascents'
      const result = await previewImport(kind, parsed)
      setRows(parsed)
      setPreview(result)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to parse this file.')
    } finally {
      setIsWorking(false)
    }
  }

  const confirmImport = async () => {
    if (rows.length === 0) return
    setIsWorking(true)
    setMessage('')
    try {
      const kind: ImportKind = source === 'canonical-training' ? 'training' : 'ascents'
      const result = await runImport(kind, rows, allowDuplicates)
      setMessage(`Imported ${result.inserted} records; skipped ${result.skipped} duplicates.`)
      setRows([])
      setPreview(undefined)
      router.refresh()
    } catch (error) {
      setMessage(
        `${error instanceof Error ? error.message : 'Import failed.'} Retry by selecting the file again; existing fingerprints will skip completed batches.`,
      )
    } finally {
      setIsWorking(false)
    }
  }

  const undo = async (jobId: string) => {
    setIsWorking(true)
    try {
      const result = await undoImport(jobId)
      setMessage(`Removed ${result.deleted} records from that import.`)
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Undo failed.')
    } finally {
      setIsWorking(false)
    }
  }

  return (
    <div className={styles.workspace}>
      <section className={styles.panel}>
        <label>
          File type
          <select
            disabled={isWorking}
            onChange={(event) => {
              setSource(event.target.value as ImportSource)
              setRows([])
              setPreview(undefined)
            }}
            value={source}
          >
            <option value="canonical-ascents">Canonical ascents.csv</option>
            <option value="canonical-training">Canonical training-sessions.csv</option>
            <option value="8a-nu">8a.nu data export</option>
          </select>
        </label>
        <label>
          CSV file
          <input accept=".csv,text/csv" disabled={isWorking} onChange={selectFile} type="file" />
        </label>
        <p>Limits: UTF-8 CSV, 5 MB, 10,000 rows.</p>

        {preview ? (
          <div className={styles.preview}>
            <h2>Preview</h2>
            <dl>
              <div>
                <dt>Valid rows</dt>
                <dd>{preview.total}</dd>
              </div>
              <div>
                <dt>Existing exact matches</dt>
                <dd>{preview.existingMatches}</dd>
              </div>
              <div>
                <dt>Duplicates inside file</dt>
                <dd>{preview.duplicatesInFile}</dd>
              </div>
            </dl>
            <label className={styles.checkbox}>
              <input
                checked={allowDuplicates}
                onChange={(event) => setAllowDuplicates(event.target.checked)}
                type="checkbox"
              />
              Import exact duplicates anyway
            </label>
            <button disabled={isWorking} onClick={confirmImport} type="button">
              {isWorking ? 'Importing…' : `Import ${preview.total} valid rows`}
            </button>
          </div>
        ) : undefined}
        {message ? <p aria-live="polite">{message}</p> : undefined}
      </section>

      <section className={styles.panel}>
        <h2>Recent imports</h2>
        {recentJobs.length === 0 ? <p>No import jobs yet.</p> : undefined}
        <ul className={styles.jobs}>
          {recentJobs.map((job) => (
            <li key={job._id}>
              <span>
                <strong>{job.kind}</strong> · {job.status} · {job.inserted} inserted · {job.skipped}{' '}
                skipped
              </span>
              {(job.status === 'completed' || job.status === 'failed') && job.inserted > 0 ? (
                <button disabled={isWorking} onClick={() => undo(job._id)} type="button">
                  Undo
                </button>
              ) : undefined}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
