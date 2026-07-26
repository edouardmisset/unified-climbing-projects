import { describe, expect, it } from 'vitest'
import { CanonicalCsvError } from './csv'
import { SANITIZED_8A_NU_FIXTURE } from './fixtures/8a-nu.fixture'
import { parse8aNuAscentCsv } from './8a-nu'

describe('8a.nu CSV adapter', () => {
  it('converts the current export contract into canonical ascents', () => {
    expect(parse8aNuAscentCsv(SANITIZED_8A_NU_FIXTURE)).toStrictEqual([
      {
        area: 'North Sector',
        comments: 'Synthetic comment',
        crag: 'Example Crag',
        date: '2024-07-01',
        discipline: 'Sport',
        grade: '7a+',
        height: 24,
        name: 'Synthetic Redpoint',
        rating: 5,
        style: 'Redpoint',
        tries: 1,
      },
      {
        crag: 'Example Forest',
        date: '2024-07-02',
        discipline: 'Bouldering',
        grade: '7a',
        name: 'Synthetic Flash',
        style: 'Flash',
        tries: 1,
      },
      {
        area: 'Training Sector',
        crag: 'Example Wall',
        date: '2024-07-03',
        discipline: 'Sport',
        grade: '6b',
        height: 15,
        name: 'Synthetic Top Rope',
        rating: 3,
        style: 'Redpoint',
        tries: 1,
      },
    ])
  })

  it('rejects provider schema drift', () => {
    expect(() =>
      parse8aNuAscentCsv(SANITIZED_8A_NU_FIXTURE.replace('"sits"', '"new_field"')),
    ).toThrow(CanonicalCsvError)
  })

  it('reports unsupported ascent types as invalid rows', () => {
    expect(() => parse8aNuAscentCsv(SANITIZED_8A_NU_FIXTURE.replace('"f"', '"unknown"'))).toThrow(
      expect.objectContaining({ code: 'INVALID_ROW', row: 3 }),
    )
  })
})
