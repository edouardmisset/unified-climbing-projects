import { createGradeScaleFromAscents } from '~/helpers/create-grade-scale'
import type { Ascent, Grade } from '~/schema/ascent'

export const MAX_VISIBLE_CRAGS = 10

export type AnimatedAscent = Pick<Ascent, '_id' | 'crag' | 'date' | 'grade' | 'style'>
export type CragRaceAscent = Pick<AnimatedAscent, '_id' | 'crag' | 'date' | 'grade'>

export type CragRaceDatum = {
  count: number
  crag: string
} & Partial<Record<Grade, number>>

export type CragRaceFrame = {
  data: readonly CragRaceDatum[]
  date: string
  totalAscents: number
}

export type CragRaceTimeline = {
  frames: readonly CragRaceFrame[]
  grades: readonly Grade[]
  maximumCount: number
}

function compareStrings(left: string, right: string): number {
  if (left === right) return 0
  return left < right ? -1 : 1
}

function nextCalendarDate(date: string): string {
  const value = new Date(`${date}T00:00:00.000Z`)
  value.setUTCDate(value.getUTCDate() + 1)
  return value.toISOString().slice(0, 10)
}

export function createTimelineDates(ascents: readonly Pick<AnimatedAscent, 'date'>[]): string[] {
  if (ascents.length === 0) return []

  const sortedDates = ascents.map(({ date }) => date).toSorted(compareStrings)
  const [firstDate] = sortedDates
  const lastDate = sortedDates.at(-1)
  if (firstDate === undefined || lastDate === undefined) return []

  const dates: string[] = []
  let date = firstDate
  while (date <= lastDate) {
    dates.push(date)
    date = nextCalendarDate(date)
  }
  return dates
}

function buildRankedData(
  counts: ReadonlyMap<string, ReadonlyMap<Grade, number>>,
  grades: readonly Grade[],
): CragRaceDatum[] {
  return [...counts.entries()]
    .toSorted(([leftCrag, leftCounts], [rightCrag, rightCounts]) => {
      const leftTotal = [...leftCounts.values()].reduce((sum, count) => sum + count, 0)
      const rightTotal = [...rightCounts.values()].reduce((sum, count) => sum + count, 0)
      return rightTotal - leftTotal || compareStrings(leftCrag, rightCrag)
    })
    .slice(0, MAX_VISIBLE_CRAGS)
    .map(([crag, gradeCounts]) => {
      const gradeData = Object.fromEntries(
        grades.map(grade => [grade, gradeCounts.get(grade) ?? 0]),
      ) as Partial<Record<Grade, number>>
      return Object.assign(gradeData, {
        count: [...gradeCounts.values()].reduce((sum, count) => sum + count, 0),
        crag,
      })
    })
}

export function createCragRaceTimeline(ascents: readonly CragRaceAscent[]): CragRaceTimeline {
  if (ascents.length === 0) return { frames: [], grades: [], maximumCount: 0 }

  const sortedAscents = ascents.toSorted(
    (left, right) => compareStrings(left.date, right.date) || compareStrings(left._id, right._id),
  )
  const ascentsByDate = new Map<string, CragRaceAscent[]>()

  for (const ascent of sortedAscents) {
    const dateAscents = ascentsByDate.get(ascent.date) ?? []
    dateAscents.push(ascent)
    ascentsByDate.set(ascent.date, dateAscents)
  }

  const grades = createGradeScaleFromAscents(ascents)
  const counts = new Map<string, Map<Grade, number>>()
  const frames: CragRaceFrame[] = []
  let totalAscents = 0
  let previousData: readonly CragRaceDatum[] = []

  for (const date of createTimelineDates(sortedAscents)) {
    const dateAscents = ascentsByDate.get(date) ?? []
    if (dateAscents.length > 0) {
      for (const ascent of dateAscents) {
        const crag = ascent.crag.trim()
        const cragCounts = counts.get(crag) ?? new Map<Grade, number>()
        cragCounts.set(ascent.grade, (cragCounts.get(ascent.grade) ?? 0) + 1)
        counts.set(crag, cragCounts)
      }
      totalAscents += dateAscents.length
      previousData = buildRankedData(counts, grades)
    }

    frames.push({ date, data: previousData, totalAscents })
  }

  const maximumCount = Math.max(...(frames.at(-1)?.data.map(({ count }) => count) ?? []), 0)
  return { frames, grades, maximumCount }
}
