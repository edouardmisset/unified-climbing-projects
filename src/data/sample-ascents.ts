/* oxlint-disable no-magic-numbers */
import type { AscentRecord } from '~/domain/canonical/ascent'

type GradePlan = {
  grade: AscentRecord['grade']
  styles: Partial<Record<AscentRecord['style'], number>>
  tries: number[]
}

const plans: GradePlan[] = [
  {
    grade: '7a',
    styles: { Flash: 10, Onsight: 17, Redpoint: 11 },
    tries: [15, ...Array.from({ length: 5 }, () => 2), ...Array.from({ length: 32 }, () => 1)],
  },
  {
    grade: '7a+',
    styles: { Flash: 3, Onsight: 9, Redpoint: 3 },
    tries: [10, ...Array.from({ length: 5 }, () => 2), ...Array.from({ length: 9 }, () => 1)],
  },
  {
    grade: '7b',
    styles: { Flash: 2, Onsight: 13, Redpoint: 3 },
    tries: [2, ...Array.from({ length: 17 }, () => 1)],
  },
  {
    grade: '7b+',
    styles: { Flash: 3, Onsight: 1, Redpoint: 2 },
    tries: [2, ...Array.from({ length: 5 }, () => 1)],
  },
  {
    grade: '7c',
    styles: { Flash: 1, Redpoint: 7 },
    tries: [1, 5, ...Array.from({ length: 6 }, () => 3)],
  },
  {
    grade: '7c+',
    styles: { Flash: 2, Onsight: 1, Redpoint: 7 },
    tries: [1, 10, ...Array.from({ length: 7 }, () => 3), 1],
  },
  { grade: '8a+', styles: { Redpoint: 3 }, tries: [2, 6, 10] },
  { grade: '8b', styles: { Redpoint: 1 }, tries: [10] },
  { grade: '8b+', styles: { Redpoint: 1 }, tries: [10] },
]

const drafts = plans.flatMap((plan) => {
  let tryIndex = 0
  return (['Onsight', 'Flash', 'Redpoint'] as const).flatMap((style) =>
    Array.from({ length: plan.styles[style] ?? 0 }, () => ({
      grade: plan.grade,
      style,
      tries: plan.tries[tryIndex++] ?? 1,
    })),
  )
})

function moveMatchToIndex(
  index: number,
  predicate: (draft: (typeof drafts)[number]) => boolean,
): void {
  const matchingIndex = drafts.findIndex(
    (draft, currentIndex) => currentIndex >= index && predicate(draft),
  )
  if (matchingIndex === -1) throw new Error('Synthetic ascent plan is incomplete')
  const current = drafts[index]
  const matching = drafts[matchingIndex]
  if (!current || !matching) throw new Error('Synthetic ascent plan is incomplete')
  drafts[index] = matching
  drafts[matchingIndex] = current
}

moveMatchToIndex(0, ({ grade, style }) => grade === '7a' && style === 'Onsight')
moveMatchToIndex(1, ({ grade, style }) => grade === '7b' && style === 'Redpoint')
moveMatchToIndex(24, ({ grade, style }) => grade === '7a' && style === 'Flash')

const required2024Grades = {
  '7a': 7,
  '7a+': 4,
  '7b': 5,
  '7b+': 1,
  '7c': 1,
  '7c+': 1,
  '8a+': 1,
} as const
const indices2024 = new Set<number>([24])
for (const [grade, count] of Object.entries(required2024Grades)) {
  let remaining = count - (grade === '7a' ? 1 : 0)
  for (const [index, draft] of drafts.entries()) {
    if (remaining === 0) break
    if (!indices2024.has(index) && draft.grade === grade) {
      indices2024.add(index)
      remaining -= 1
    }
  }
}

const yearCounts = new Map([
  [2_017, 3],
  [2_018, 8],
  [2_019, 8],
  [2_020, 14],
  [2_021, 5],
  [2_022, 13],
  [2_023, 29],
])
const yearHeightTotals = new Map([
  [2_017, 55],
  [2_018, 155],
  [2_019, 155],
  [2_020, 290],
  [2_021, 105],
  [2_022, 300],
  [2_023, 405],
  [2_024, 455],
])

const yearByIndex = new Map<number, number>()
for (const index of indices2024) yearByIndex.set(index, 2_024)
const remainingIndices = drafts.map((_, index) => index).filter((index) => !indices2024.has(index))
let remainingOffset = 0
for (const [year, count] of yearCounts) {
  for (const index of remainingIndices.slice(remainingOffset, remainingOffset + count))
    yearByIndex.set(index, year)
  remainingOffset += count
}

const indicesByYear = new Map<number, number[]>()
for (const [index, year] of yearByIndex) {
  const indices = indicesByYear.get(year) ?? []
  indices.push(index)
  indicesByYear.set(year, indices)
}

const candidates2023 = indicesByYear.get(2_023) ?? []
const redpointCandidates2023 = candidates2023.filter((index) => drafts[index]?.style === 'Redpoint')
const boulderingIndices = new Set<number>([24, ...redpointCandidates2023.slice(0, 11)])
for (const index of candidates2023) if (boulderingIndices.size < 16) boulderingIndices.add(index)

const heightByIndex = new Map<number, number>()
for (const [year, indices] of indicesByYear) {
  const total = yearHeightTotals.get(year)
  if (total === undefined) throw new Error('Synthetic height plan is incomplete')
  const routeIndices = indices.filter((index) => !boulderingIndices.has(index))
  const base = Math.floor(total / routeIndices.length)
  let remainder = total - base * routeIndices.length
  for (const index of routeIndices) {
    heightByIndex.set(index, base + (remainder > 0 ? 1 : 0))
    remainder -= remainder > 0 ? 1 : 0
  }
}

export const sampleAscents: AscentRecord[] = drafts.map((draft, index) => {
  const year = yearByIndex.get(index)
  const yearIndices = year === undefined ? [] : (indicesByYear.get(year) ?? [])
  const positionInYear = yearIndices.indexOf(index)
  if (year === undefined || positionInYear === -1)
    throw new Error('Synthetic date plan is incomplete')
  const day = positionInYear < 17 ? positionInYear + 1 : positionInYear - 16
  const month = year === 2_024 ? 1 : (index % 9) + 1

  return {
    _id: `synthetic-ascent-${String(index + 1).padStart(3, '0')}`,
    area: index < 3 ? 'Rive Droite' : `Synthetic Sector ${index % 8}`,
    crag: `Synthetic Crag ${index % 12}`,
    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    discipline: boulderingIndices.has(index) ? 'Bouldering' : 'Sport',
    grade: draft.grade,
    height: heightByIndex.get(index),
    name: `Synthetic Route ${index + 1}`,
    style: draft.style,
    tries: draft.tries,
  }
})
