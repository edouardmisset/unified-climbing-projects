import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { strFromU8, unzipSync } from 'fflate'
import { describe, expect, it, vi } from 'vite-plus/test'
import { parseAscentCsv, parseTrainingSessionCsv } from '~/domain/csv-contract'
import type { AscentRecord } from '~/domain/ascent'
import type { TrainingSessionRecord } from '~/domain/training-session'
import { ExportControls } from './export-controls'

const ascent = {
  _id: 'ascent-id',
  comments: 'Unicode: é, comma, and "quote"\nsecond line',
  crag: 'Céüse',
  date: '2026-08-01',
  discipline: 'Sport',
  grade: '7a',
  name: 'Berlin',
  style: 'Redpoint',
  tries: 2,
} satisfies AscentRecord

const training = {
  _id: 'training-id',
  comments: 'Power, then rest',
  date: '2026-08-02',
  discipline: 'Bouldering',
  intensity: 80,
  location: "Salle d'escalade",
  type: 'Power',
  volume: 60,
} satisfies TrainingSessionRecord

function setupDownloads() {
  const blobs: Blob[] = []
  const createObjectURL = vi.fn<(blob: Blob) => string>(blob => {
    blobs.push(blob)
    return `blob:test-${blobs.length}`
  })
  const revokeObjectURL = vi.fn<(url: string) => void>()
  Object.defineProperties(globalThis.URL, {
    createObjectURL: { configurable: true, value: createObjectURL },
    revokeObjectURL: { configurable: true, value: revokeObjectURL },
  })
  const click = vi
    .spyOn(globalThis.HTMLAnchorElement.prototype, 'click')
    .mockImplementation(() => {})
  return { blobs, click, createObjectURL, revokeObjectURL }
}

describe('exportControls', () => {
  it('downloads a two-file ZIP whose canonical CSVs round-trip', async () => {
    const downloads = setupDownloads()
    const user = userEvent.setup()
    render(<ExportControls ascents={[ascent]} trainingSessions={[training]} />)

    await user.click(screen.getByRole('button', { name: 'Download ZIP (2 records)' }))

    expect(downloads.click).toHaveBeenCalledOnce()
    const archiveBlob = downloads.blobs[0]
    expect(archiveBlob?.type).toBe('application/zip')
    const files = unzipSync(new Uint8Array(await archiveBlob!.arrayBuffer()))
    expect(Object.keys(files).toSorted()).toStrictEqual(['ascents.csv', 'training-sessions.csv'])
    expect(parseAscentCsv(strFromU8(files['ascents.csv']!))).toStrictEqual([
      expect.objectContaining({ comments: ascent.comments, crag: ascent.crag, name: ascent.name }),
    ])
    expect(parseTrainingSessionCsv(strFromU8(files['training-sessions.csv']!))).toStrictEqual([
      expect.objectContaining({ comments: training.comments, location: training.location }),
    ])
  })

  it('exports valid header-only CSVs for empty datasets', async () => {
    const downloads = setupDownloads()
    const user = userEvent.setup()
    render(<ExportControls ascents={[]} trainingSessions={[]} />)

    await user.click(screen.getByRole('button', { name: 'Download ZIP (0 records)' }))

    const files = unzipSync(new Uint8Array(await downloads.blobs[0]!.arrayBuffer()))
    expect(parseAscentCsv(strFromU8(files['ascents.csv']!))).toStrictEqual([])
    expect(parseTrainingSessionCsv(strFromU8(files['training-sessions.csv']!))).toStrictEqual([])
  })

  it('downloads both published CSV templates', async () => {
    const downloads = setupDownloads()
    const user = userEvent.setup()
    render(<ExportControls ascents={[]} trainingSessions={[]} />)

    await user.click(screen.getByRole('button', { name: 'Ascent template' }))
    await user.click(screen.getByRole('button', { name: 'Training template' }))

    expect(downloads.blobs).toHaveLength(2)
    expect(parseAscentCsv(await downloads.blobs[0]!.text())).toStrictEqual([])
    expect(parseTrainingSessionCsv(await downloads.blobs[1]!.text())).toStrictEqual([])
  })
})
