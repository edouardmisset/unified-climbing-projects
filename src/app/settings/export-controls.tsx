'use client'

import { strToU8, zipSync } from 'fflate'
import type { AscentRecord } from '~/domain/canonical/ascent'
import {
  ASCENT_CSV_TEMPLATE,
  TRAINING_SESSION_CSV_TEMPLATE,
  serializeAscentsCsv,
  serializeTrainingSessionsCsv,
} from '~/domain/canonical/csv-contract'
import type { TrainingSessionRecord } from '~/domain/canonical/training-session'
import styles from './settings.module.css'

type ExportControlsProps = {
  ascents: AscentRecord[]
  trainingSessions: TrainingSessionRecord[]
}

function downloadBlob(blob: Blob, fileName: string): void {
  const url = globalThis.URL.createObjectURL(blob)
  const link = globalThis.document.createElement('a')
  link.href = url
  link.download = fileName
  globalThis.document.body.append(link)
  link.click()
  link.remove()
  globalThis.setTimeout(() => {
    globalThis.URL.revokeObjectURL(url)
  }, 0)
}

function downloadText(text: string, fileName: string): void {
  downloadBlob(new globalThis.Blob([text], { type: 'text/csv;charset=utf-8' }), fileName)
}

export function ExportControls({ ascents, trainingSessions }: ExportControlsProps) {
  const downloadExport = () => {
    const archive = zipSync(
      {
        'ascents.csv': strToU8(serializeAscentsCsv(ascents)),
        'training-sessions.csv': strToU8(serializeTrainingSessionsCsv(trainingSessions)),
      },
      { level: 6 },
    )
    downloadBlob(
      new globalThis.Blob([archive], { type: 'application/zip' }),
      'climbing-log-export.zip',
    )
  }

  return (
    <div className={styles.controls}>
      <button className={styles.primaryAction} onClick={downloadExport} type='button'>
        Download ZIP ({ascents.length + trainingSessions.length} records)
      </button>
      <button
        onClick={() => {
          downloadText(ASCENT_CSV_TEMPLATE, 'ascents-template.csv')
        }}
        type='button'
      >
        Ascent template
      </button>
      <button
        onClick={() => {
          downloadText(TRAINING_SESSION_CSV_TEMPLATE, 'training-sessions-template.csv')
        }}
        type='button'
      >
        Training template
      </button>
    </div>
  )
}
