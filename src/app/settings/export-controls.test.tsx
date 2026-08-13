import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
  const click = vi.spyOn(globalThis.HTMLAnchorElement.prototype, 'click').mockReturnValue()
  return { blobs, click, createObjectURL, revokeObjectURL }
}

function required<T>(value: T | undefined): T {
  expect(value).toBeDefined()
  if (value === undefined) throw new Error('Expected test value to be defined')
  return value
}

describe('exportControls', () => {
  it('downloads each dataset as canonical CSV or portable JSON', async () => {
    const downloads = setupDownloads()
    const user = userEvent.setup()
    render(<ExportControls ascents={[ascent]} trainingSessions={[training]} />)

    const [ascentsCsvButton, trainingCsvButton] = screen.getAllByRole('button', {
      name: 'Download CSV',
    })
    const [ascentsJsonButton, trainingJsonButton] = screen.getAllByRole('button', {
      name: 'Download JSON',
    })

    await user.click(required(ascentsCsvButton))
    await user.click(required(trainingCsvButton))
    await user.click(required(ascentsJsonButton))
    await user.click(required(trainingJsonButton))

    expect(downloads.click).toHaveBeenCalledTimes(4)
    const [ascentsCsv, trainingCsv, ascentsJson, trainingJson] = downloads.blobs
    expect(required(ascentsCsv).type).toBe('text/csv;charset=utf-8')
    expect(required(trainingCsv).type).toBe('text/csv;charset=utf-8')
    expect(required(ascentsJson).type).toBe('application/json;charset=utf-8')
    expect(required(trainingJson).type).toBe('application/json;charset=utf-8')
    expect(parseAscentCsv(await required(ascentsCsv).text())).toStrictEqual([
      expect.objectContaining({ comments: ascent.comments, crag: ascent.crag, name: ascent.name }),
    ])
    expect(parseTrainingSessionCsv(await required(trainingCsv).text())).toStrictEqual([
      expect.objectContaining({ comments: training.comments, location: training.location }),
    ])
    expect(JSON.parse(await required(ascentsJson).text())).toStrictEqual([
      expect.objectContaining({ comments: ascent.comments, crag: ascent.crag, name: ascent.name }),
    ])
    expect(JSON.parse(await required(trainingJson).text())).toStrictEqual([
      expect.objectContaining({ comments: training.comments, location: training.location }),
    ])
    const exportedAscents = JSON.parse(await required(ascentsJson).text()) as Record<
      string,
      unknown
    >[]
    const exportedTrainingSessions = JSON.parse(await required(trainingJson).text()) as Record<
      string,
      unknown
    >[]
    expect(exportedAscents.every(record => !('_id' in record))).toBe(true)
    expect(exportedTrainingSessions.every(record => !('_id' in record))).toBe(true)
  })

  it('exports empty datasets as header-only CSVs and empty JSON arrays', async () => {
    const downloads = setupDownloads()
    const user = userEvent.setup()
    render(<ExportControls ascents={[]} trainingSessions={[]} />)

    const [ascentsCsvButton, trainingCsvButton] = screen.getAllByRole('button', {
      name: 'Download CSV',
    })
    const [ascentsJsonButton, trainingJsonButton] = screen.getAllByRole('button', {
      name: 'Download JSON',
    })

    await user.click(required(ascentsCsvButton))
    await user.click(required(trainingCsvButton))
    await user.click(required(ascentsJsonButton))
    await user.click(required(trainingJsonButton))

    const [ascentsCsv, trainingCsv, ascentsJson, trainingJson] = downloads.blobs
    expect(parseAscentCsv(await required(ascentsCsv).text())).toStrictEqual([])
    expect(parseTrainingSessionCsv(await required(trainingCsv).text())).toStrictEqual([])
    expect(JSON.parse(await required(ascentsJson).text())).toStrictEqual([])
    expect(JSON.parse(await required(trainingJson).text())).toStrictEqual([])
  })

  it('downloads both published CSV templates', async () => {
    const downloads = setupDownloads()
    const user = userEvent.setup()
    render(<ExportControls ascents={[]} trainingSessions={[]} />)

    const [ascentTemplateButton, trainingTemplateButton] = screen.getAllByRole('button', {
      name: 'CSV template',
    })
    await user.click(required(ascentTemplateButton))
    await user.click(required(trainingTemplateButton))

    expect(downloads.blobs).toHaveLength(2)
    expect(parseAscentCsv(await required(downloads.blobs[0]).text())).toStrictEqual([])
    expect(parseTrainingSessionCsv(await required(downloads.blobs[1]).text())).toStrictEqual([])
  })
})
