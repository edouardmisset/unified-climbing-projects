import { describe, expect, it } from 'vite-plus/test'
import { ASCENT_CSV_COLUMNS, type AscentDomain } from './ascent'
import {
  ASCENT_CSV_TEMPLATE,
  TRAINING_SESSION_CSV_TEMPLATE,
  parseAscentCsv,
  parseTrainingSessionCsv,
  serializeAscentsCsv,
  serializeTrainingSessionsCsv,
} from './csv-contract'
import { CanonicalCsvError } from './csv'
import { TRAINING_SESSION_CSV_COLUMNS, type TrainingSessionDomain } from './training-session'

function captureCsvError(callback: () => unknown): CanonicalCsvError {
  let caughtError: unknown = undefined

  try {
    callback()
  } catch (error) {
    caughtError = error
  }

  if (!(caughtError instanceof CanonicalCsvError))
    throw new Error('Expected a CanonicalCsvError', { cause: caughtError })

  return caughtError
}

const completeAscent = {
  area: 'Secteur nord',
  comments: 'Départ, puis "crux"\nSortie délicate',
  crag: 'Falaise d’Été',
  date: '2024-02-29',
  discipline: 'Sport',
  grade: '7a+',
  height: 0,
  holds: 'Crimp',
  name: 'L’arête, directe',
  personalGrade: '7b',
  profile: 'Arête',
  rating: 0,
  style: 'Onsight',
  tries: 1,
} as const satisfies AscentDomain

const completeTrainingSession = {
  anatomicalRegion: 'Fingers',
  comments: 'Série "qualité", sans douleur\nRepos long',
  date: '2024-03-01',
  discipline: 'Bouldering',
  energySystem: 'Anaerobic Alactic',
  intensity: 80,
  location: 'Salle, centre-ville',
  type: 'Finger Board',
  volume: 60,
} as const satisfies TrainingSessionDomain

describe('canonical CSV templates', () => {
  it('contains only the fixed ascent header row', () => {
    expect(ASCENT_CSV_TEMPLATE).toBe(`${ASCENT_CSV_COLUMNS.join(',')}\r\n`)
    expect(parseAscentCsv(ASCENT_CSV_TEMPLATE)).toStrictEqual([])
  })

  it('contains only the fixed training-session header row', () => {
    expect(TRAINING_SESSION_CSV_TEMPLATE).toBe(`${TRAINING_SESSION_CSV_COLUMNS.join(',')}\r\n`)
    expect(parseTrainingSessionCsv(TRAINING_SESSION_CSV_TEMPLATE)).toStrictEqual([])
  })
})

describe('ascent CSV contract', () => {
  it('accepts required columns in any order with optional columns absent', () => {
    const csv =
      'tries,style,date,crag,grade,name,discipline\n1,Onsight,2024-02-29,Example Crag,7a,Example Route,Sport\n'

    expect(parseAscentCsv(csv)).toStrictEqual([
      {
        crag: 'Example Crag',
        date: '2024-02-29',
        discipline: 'Sport',
        grade: '7a',
        name: 'Example Route',
        style: 'Onsight',
        tries: 1,
      },
    ])
  })

  it('round-trips every canonical field, Unicode, quotes, commas, and newlines', () => {
    expect(parseAscentCsv(serializeAscentsCsv([completeAscent]))).toStrictEqual([completeAscent])
  })

  it('exports only canonical domain columns in fixed order', () => {
    const recordWithInternalFields = {
      ...completeAscent,
      _id: 'internal-id',
      contentFingerprint: 'internal-fingerprint',
      importJobId: 'internal-job',
      ownerId: 'internal-owner',
      points: 1_000,
    }

    const csv = serializeAscentsCsv([recordWithInternalFields])
    const [header] = csv.split('\r\n')

    expect(header).toBe(ASCENT_CSV_COLUMNS.join(','))
    expect(csv).not.toMatch(/_id|ownerId|contentFingerprint|importJobId|points/u)
  })

  it('reports invalid domain values as row errors', () => {
    const error = captureCsvError(() =>
      parseAscentCsv(
        'discipline,name,grade,crag,date,style,tries\nSport,Example,7a,Crag,2024-02-30,Onsight,1\n',
      ),
    )

    expect(error).toMatchObject({ code: 'INVALID_ROW', row: 2 })
    expect(error.cause).toBeDefined()
  })
})

describe('training-session CSV contract', () => {
  it('accepts date and type in either order with optional columns absent', () => {
    expect(parseTrainingSessionCsv('type,date\nOutdoor,2024-03-01\n')).toStrictEqual([
      { date: '2024-03-01', type: 'Outdoor' },
    ])
  })

  it('round-trips every canonical field, Unicode, quotes, commas, and newlines', () => {
    expect(
      parseTrainingSessionCsv(serializeTrainingSessionsCsv([completeTrainingSession])),
    ).toStrictEqual([completeTrainingSession])
  })

  it('exports empty optional cells without stored load or internal fields', () => {
    const recordWithInternalFields = {
      _id: 'internal-id',
      date: '2024-03-01',
      load: 48,
      ownerId: 'internal-owner',
      type: 'Outdoor',
    } as const
    const csv = serializeTrainingSessionsCsv([recordWithInternalFields])

    expect(csv).toBe(
      `${TRAINING_SESSION_CSV_COLUMNS.join(',')}\r\n2024-03-01,Outdoor,"","","","","","",""\r\n`,
    )
    expect(csv).not.toMatch(/_id|ownerId|load/u)
  })
})
