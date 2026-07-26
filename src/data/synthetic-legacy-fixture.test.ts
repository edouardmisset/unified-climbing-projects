import { describe, expect, it } from 'vitest'
import {
  toCanonicalAscentRecord,
  toCanonicalTrainingSessionRecord,
} from '~/domain/canonical/legacy-transformers'
import {
  SYNTHETIC_LEGACY_EXPECTATIONS,
  SYNTHETIC_ASCENT_FIXTURES,
  SYNTHETIC_TRAINING_SESSION_FIXTURES,
} from './synthetic-legacy-fixture'

describe('synthetic legacy fixture', () => {
  it('contains stable, unique synthetic identifiers only', () => {
    const ids = [
      ...SYNTHETIC_ASCENT_FIXTURES.map(({ _id }) => _id),
      ...SYNTHETIC_TRAINING_SESSION_FIXTURES.map(({ _id }) => _id),
    ]

    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.every((id) => id.startsWith('synthetic-'))).toBe(true)
  })

  it('matches the canonical ascent acceptance expectations', () => {
    const ascents = SYNTHETIC_ASCENT_FIXTURES.map(toCanonicalAscentRecord)
    const latestAscent = ascents.find(
      ({ _id }) => _id === SYNTHETIC_LEGACY_EXPECTATIONS.latestAscent.id,
    )

    expect(ascents).toHaveLength(SYNTHETIC_LEGACY_EXPECTATIONS.ascentCount)
    expect(ascents.map(({ name }) => name)).toStrictEqual(SYNTHETIC_LEGACY_EXPECTATIONS.ascentNames)
    expect(latestAscent).toMatchObject({
      crag: SYNTHETIC_LEGACY_EXPECTATIONS.latestAscent.crag,
      date: SYNTHETIC_LEGACY_EXPECTATIONS.latestAscent.canonicalDate,
      discipline: SYNTHETIC_LEGACY_EXPECTATIONS.latestAscent.canonicalDiscipline,
      grade: SYNTHETIC_LEGACY_EXPECTATIONS.latestAscent.grade,
      name: SYNTHETIC_LEGACY_EXPECTATIONS.latestAscent.name,
    })
  })

  it('matches the canonical training-session acceptance expectations', () => {
    const sessions = SYNTHETIC_TRAINING_SESSION_FIXTURES.map(toCanonicalTrainingSessionRecord)

    expect(sessions).toHaveLength(SYNTHETIC_LEGACY_EXPECTATIONS.trainingSessionCount)
    expect(sessions.map(({ type }) => type)).toStrictEqual(
      SYNTHETIC_LEGACY_EXPECTATIONS.trainingSessionTypes,
    )
    expect(
      sessions.flatMap(({ location }) => (location === undefined ? [] : location)),
    ).toStrictEqual(SYNTHETIC_LEGACY_EXPECTATIONS.trainingSessionLocations)
  })
})
