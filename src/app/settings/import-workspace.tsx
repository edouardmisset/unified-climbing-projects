'use client'

import { useRouter } from 'next/navigation'
import { type ChangeEvent, useState } from 'react'
import { parse8aNuAscentCsv } from '~/domain/8a-nu'
import type { AscentImportRow } from '~/domain/ascent'
import { parseAscentCsv, parseTrainingSessionCsv } from '~/domain/csv-contract'
import { decodeUtf8Csv } from '~/domain/csv'
import type { TrainingSessionImportRow } from '~/domain/training-session'
import type { getRecentImportJobs } from '~/services/imports'
import { previewImport, runImport, undoImport } from './actions'
import styles from './settings.module.css'

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
    const input = event.currentTarget
    const file = input.files?.[0]
    // Allow selecting the same file again after an error or a completed import.
    input.value = ''
    setRows([])
    setPreview(undefined)
    setAllowDuplicates(false)
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
      <div className={styles.fields}>
        <label className={styles.field}>
          <span>File type</span>
          <select
            className={styles.select}
            disabled={isWorking}
            onChange={event => {
              setSource(event.target.value as ImportSource)
              setRows([])
              setPreview(undefined)
              setAllowDuplicates(false)
              setMessage('')
            }}
            value={source}
          >
            <option value='canonical-ascents'>Canonical ascents.csv</option>
            <option value='canonical-training'>Canonical training-sessions.csv</option>
            <option value='8a-nu'>8a.nu data export</option>
          </select>
        </label>
        <label className={styles.field}>
          <span>CSV file</span>
          <input
            accept='.csv,text/csv'
            disabled={isWorking}
            onChange={event => {
              void selectFile(event)
            }}
            type='file'
          />
        </label>
      </div>
      <p className={styles.limit}>Limits: UTF-8 CSV, 5 MB, 10,000 rows.</p>

      {preview ? (
        <div className={styles.preview}>
          <h3>Preview</h3>
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
              onChange={event => {
                setAllowDuplicates(event.target.checked)
              }}
              type='checkbox'
            />
            Import exact duplicates anyway
          </label>
          <button
            disabled={isWorking}
            onClick={() => {
              void confirmImport()
            }}
            type='button'
          >
            {isWorking ? 'Importing…' : `Import ${preview.total} valid rows`}
          </button>
        </div>
      ) : undefined}
      {message ? (
        <p aria-live='polite' className={styles.message}>
          {message}
        </p>
      ) : undefined}

      <div className={styles.recentImports}>
        <h3>Recent imports</h3>
        {recentJobs.length === 0 ? <p>No import jobs yet.</p> : undefined}
        <ul className={styles.jobs}>
          {recentJobs.map(job => (
            <li key={job._id}>
              <span>
                <strong>{job.kind}</strong> · {job.status} · {job.inserted} inserted · {job.skipped}{' '}
                skipped
              </span>
              {['running', 'undoing', 'completed', 'failed'].includes(job.status) &&
              job.inserted > 0 ? (
                <button
                  disabled={isWorking}
                  onClick={() => {
                    void undo(job._id)
                  }}
                  type='button'
                >
                  Undo
                </button>
              ) : undefined}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
