import { describe, expect, it } from 'vite-plus/test'
import type { TrainingSession } from '~/schema/training'
import { fromTrainingSessionsToCalendarEntries } from './training-calendar-helpers'

const SESSION_TYPE_LABELS = [
  ['Outdoor', 'Out'],
  ['Contact Strength', 'CS'],
  ['Power', 'Po'],
  ['Max Strength', 'MS'],
  ['Endurance', 'En'],
  ['Power Endurance', 'PE'],
  ['Strength Endurance', 'SE'],
  ['Routine', 'Ro'],
  ['Finger Board', 'FB'],
  ['Core', 'Co'],
  ['Stretching', 'Sg'],
  ['Skill', 'Sk'],
  ['Stamina', 'St'],
  ['Chill', 'Ch'],
] as const satisfies readonly [TrainingSession['type'], string][]

describe('fromTrainingSessionsToCalendarEntries', () => {
  it('uses compact labels for every training session type', () => {
    const sessions = SESSION_TYPE_LABELS.map(([type], index): TrainingSession[] => [
      {
        _id: `training-${index}`,
        date: `2024-01-${String(index + 1).padStart(2, '0')}`,
        type,
      },
    ])

    const entries = fromTrainingSessionsToCalendarEntries(2_024, sessions)

    expect(entries.map(({ shortText }) => shortText)).toStrictEqual(
      SESSION_TYPE_LABELS.map(([, label]) => label),
    )
  })
})
