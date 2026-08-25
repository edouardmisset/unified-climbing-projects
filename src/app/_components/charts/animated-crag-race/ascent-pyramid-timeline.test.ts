import { describe, expect, it } from 'vite-plus/test'
import { sampleAscents } from '~/testing/sample-data'
import { createAscentPyramidTimeline } from './ascent-pyramid-timeline'

describe('createAscentPyramidTimeline', () => {
  it('keeps the full grade scale fixed while accumulating same-day styles', () => {
    const [sample] = sampleAscents
    if (sample === undefined) throw new Error('Expected sample ascent')

    const timeline = createAscentPyramidTimeline(
      [
        { ...sample, _id: 'a', date: '2024-01-01', grade: '6a', style: 'Onsight' },
        { ...sample, _id: 'b', date: '2024-01-01', grade: '6b', style: 'Flash' },
        { ...sample, _id: 'c', date: '2024-01-03', grade: '6a', style: 'Redpoint' },
      ],
      ['2024-01-01', '2024-01-02', '2024-01-03'],
    )

    expect(timeline.frames[0]?.data.map(({ grade }) => grade)).toStrictEqual(['6a', '6a+', '6b'])
    expect(timeline.frames[0]?.data[0]).toMatchObject({ Onsight: 1, Redpoint: 0 })
    expect(timeline.frames[0]?.data[2]).toMatchObject({ Flash: 1, Onsight: 0 })
    expect(timeline.frames[1]?.data).toBe(timeline.frames[0]?.data)
    expect(timeline.frames[2]?.data[0]).toMatchObject({ Onsight: 1, Redpoint: 1 })
    expect(timeline.frames.map(frame => frame.totalAscents)).toStrictEqual([2, 2, 3])
    expect(timeline.maximumCount).toBe(2)
  })
})
