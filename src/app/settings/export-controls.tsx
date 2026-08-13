'use client'

import type { AscentRecord } from '~/domain/ascent'
import {
  ASCENT_CSV_TEMPLATE,
  TRAINING_SESSION_CSV_TEMPLATE,
  serializeAscentsCsv,
  serializeTrainingSessionsCsv,
} from '~/domain/csv-contract'
import type { TrainingSessionRecord } from '~/domain/training-session'
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

function downloadJson(records: { _id: string }[], fileName: string): void {
  const exportRecords = records.map(({ _id: _, ...record }) => record)
  downloadBlob(
    new globalThis.Blob([JSON.stringify(exportRecords, undefined, 2)], {
      type: 'application/json;charset=utf-8',
    }),
    fileName,
  )
}

export function ExportControls({ ascents, trainingSessions }: ExportControlsProps) {
  return (
    <div className={styles.exportGroups}>
      <section aria-labelledby='ascents-export-title' className={styles.exportGroup}>
        <h3 id='ascents-export-title'>Ascents ({ascents.length})</h3>
        <div className={styles.controls}>
          <button
            className={styles.primaryAction}
            onClick={() => {
              downloadText(serializeAscentsCsv(ascents), 'ascents.csv')
            }}
            type='button'
          >
            Download CSV
          </button>
          <button
            onClick={() => {
              downloadJson(ascents, 'ascents.json')
            }}
            type='button'
          >
            Download JSON
          </button>
          <button
            onClick={() => {
              downloadText(ASCENT_CSV_TEMPLATE, 'ascents-template.csv')
            }}
            type='button'
          >
            CSV template
          </button>
        </div>
      </section>

      <section aria-labelledby='training-sessions-export-title' className={styles.exportGroup}>
        <h3 id='training-sessions-export-title'>Training sessions ({trainingSessions.length})</h3>
        <div className={styles.controls}>
          <button
            className={styles.primaryAction}
            onClick={() => {
              downloadText(serializeTrainingSessionsCsv(trainingSessions), 'training-sessions.csv')
            }}
            type='button'
          >
            Download CSV
          </button>
          <button
            onClick={() => {
              downloadJson(trainingSessions, 'training-sessions.json')
            }}
            type='button'
          >
            Download JSON
          </button>
          <button
            onClick={() => {
              downloadText(TRAINING_SESSION_CSV_TEMPLATE, 'training-sessions-template.csv')
            }}
            type='button'
          >
            CSV template
          </button>
        </div>
      </section>
    </div>
  )
}
