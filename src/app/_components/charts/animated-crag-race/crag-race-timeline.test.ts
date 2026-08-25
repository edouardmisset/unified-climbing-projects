import { describe, expect, it } from 'vite-plus/test'
import { sampleAscents } from '~/testing/sample-data'
import { createCragRaceTimeline } from './crag-race-timeline'

describe('createCragRaceTimeline', () => {
  it('creates one cumulative frame for every calendar day and batches same-day ascents', () => {
    const [sample] = sampleAscents
    if (sample === undefined) throw new Error('Expected sample ascent')

    const timeline = createCragRaceTimeline([
      { ...sample, _id: 'a', crag: 'Alpha', date: '2024-01-01' },
      { ...sample, _id: 'b', crag: 'Beta', date: '2024-01-01' },
      { ...sample, _id: 'c', crag: 'Alpha', date: '2024-01-03' },
    ])

    expect(timeline.frames.map(frame => frame.date)).toStrictEqual([
      '2024-01-01',
      '2024-01-02',
      '2024-01-03',
    ])
    expect(timeline.frames[0]?.data).toHaveLength(2)
    expect(timeline.frames[0]?.data[0]).toMatchObject({ crag: 'Alpha', count: 1 })
    expect(timeline.frames[0]?.data[1]).toMatchObject({ crag: 'Beta', count: 1 })
    expect(timeline.frames[0]?.data[0]?.[sample.grade]).toBe(1)
    expect(timeline.frames[1]?.data).toBe(timeline.frames[0]?.data)
    expect(timeline.frames[2]?.data).toHaveLength(2)
    expect(timeline.frames[2]?.data[0]).toMatchObject({ crag: 'Alpha', count: 2 })
    expect(timeline.frames[2]?.data[1]).toMatchObject({ crag: 'Beta', count: 1 })
    expect(timeline.frames[2]?.data[0]?.[sample.grade]).toBe(2)
    expect(timeline.frames.map(frame => frame.totalAscents)).toStrictEqual([2, 2, 3])
    expect(timeline.maximumCount).toBe(2)
  })

  it('uses a deterministic alphabetical order for tied crags', () => {
    const [sample] = sampleAscents
    if (sample === undefined) throw new Error('Expected sample ascent')

    const timeline = createCragRaceTimeline([
      { ...sample, _id: 'b', crag: 'Beta', date: '2024-01-01' },
      { ...sample, _id: 'a', crag: 'Alpha', date: '2024-01-01' },
    ])

    expect(timeline.frames[0]?.data.map(({ crag }) => crag)).toStrictEqual(['Alpha', 'Beta'])
  })
})
