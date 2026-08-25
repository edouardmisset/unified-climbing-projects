import { createGradeScaleFromAscents } from '~/helpers/create-grade-scale'
import { type Grade, type Ascent, ASCENT_STYLE } from '~/schema/ascent'
import type { AnimatedAscent } from './crag-race-timeline'

export type AnimatedPyramidDatum = {
  Flash: number
  Onsight: number
  Redpoint: number
  grade: Grade
}

export type AscentPyramidTimeline = {
  frames: readonly {
    data: readonly AnimatedPyramidDatum[]
    date: string
    totalAscents: number
  }[]
  maximumCount: number
}

function createEmptyCounts(grades: readonly Grade[]): Map<Grade, Record<Ascent['style'], number>> {
  return new Map(
    grades.map(grade => [
      grade,
      Object.fromEntries(ASCENT_STYLE.map(style => [style, 0])) as Record<Ascent['style'], number>,
    ]),
  )
}

function createFrameData(
  grades: readonly Grade[],
  counts: ReadonlyMap<Grade, Record<Ascent['style'], number>>,
): AnimatedPyramidDatum[] {
  return grades.map(grade => {
    const values = counts.get(grade)
    return {
      Flash: values?.Flash ?? 0,
      Onsight: values?.Onsight ?? 0,
      Redpoint: values?.Redpoint ?? 0,
      grade,
    }
  })
}

export function createAscentPyramidTimeline(
  ascents: readonly AnimatedAscent[],
  dates: readonly string[],
): AscentPyramidTimeline {
  if (ascents.length === 0 || dates.length === 0) return { frames: [], maximumCount: 0 }

  const grades = createGradeScaleFromAscents(ascents)
  const ascentsByDate = new Map<string, AnimatedAscent[]>()
  for (const ascent of ascents) {
    const dateAscents = ascentsByDate.get(ascent.date) ?? []
    dateAscents.push(ascent)
    ascentsByDate.set(ascent.date, dateAscents)
  }

  const counts = createEmptyCounts(grades)
  let previousData: readonly AnimatedPyramidDatum[] = createFrameData(grades, counts)
  let totalAscents = 0
  const frames = dates.map(date => {
    const dateAscents = ascentsByDate.get(date) ?? []
    for (const ascent of dateAscents) {
      const gradeCounts = counts.get(ascent.grade)
      if (gradeCounts !== undefined) gradeCounts[ascent.style] += 1
    }

    if (dateAscents.length > 0) {
      totalAscents += dateAscents.length
      previousData = createFrameData(grades, counts)
    }
    return { data: previousData, date, totalAscents }
  })

  const maximumCount = Math.max(
    ...(frames.at(-1)?.data.map(({ Flash, Onsight, Redpoint }) => Flash + Onsight + Redpoint) ??
      []),
    0,
  )
  return { frames, maximumCount }
}
