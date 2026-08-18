import { describe, expect, it } from 'vite-plus/test'
import type { TrainingSession } from '~/schema/training'
import { getTrainingSessionsGaugeData } from './get-training-sessions-gauge-data'

function session(id: string, type: TrainingSession['type']): TrainingSession {
  return {
    _id: id,
    date: '2026-01-01',
    type,
  }
}

describe('getTrainingSessionsGaugeData', () => {
  it('returns empty series for empty input', () => {
    const result = getTrainingSessionsGaugeData([])

    expect(result).toStrictEqual({
      groupData: [],
      typeData: [],
    })
  })

  it('sorts groups by count and sorts session types within each group', () => {
    const sessions = [
      session('cs-1', 'Contact Strength'),
      session('cs-2', 'Contact Strength'),
      session('cs-3', 'Contact Strength'),
      session('ms-1', 'Max Strength'),
      session('po-1', 'Power'),
      session('pe-1', 'Power Endurance'),
      session('pe-2', 'Power Endurance'),
      session('en-1', 'Endurance'),
      session('se-1', 'Strength Endurance'),
      session('out-1', 'Outdoor'),
      session('out-2', 'Outdoor'),
      session('out-3', 'Outdoor'),
      session('sta-1', 'Stamina'),
      session('sta-2', 'Stamina'),
      session('ro-1', 'Routine'),
      session('ro-2', 'Routine'),
      session('ch-1', 'Chill'),
    ]

    const result = getTrainingSessionsGaugeData(sessions)

    expect(result.groupData.map(group => group.id)).toStrictEqual([
      'Max strength',
      'Endurance',
      'Outdoor',
      'Aerobic',
      'Others',
      'Chill',
    ])

    expect(
      result.typeData.filter(type => type.groupId === 'Max strength').map(type => type.id),
    ).toStrictEqual(['Contact Strength', 'Max Strength', 'Power'])

    expect(
      result.typeData.filter(type => type.groupId === 'Others').map(type => type.id),
    ).toStrictEqual(['Routine'])

    expect(result.typeData.find(type => type.id === 'Contact Strength')?.fill).toBe(
      'var(--strength)',
    )
    expect(result.typeData.find(type => type.id === 'Outdoor')?.fill).toBe('var(--outdoor)')
    expect(result.typeData.find(type => type.id === 'Routine')?.fill).toBe('var(--otherTraining)')
  })
})
