import { filterAscents } from '~/helpers/filter-ascents'
import type { Ascent, Grade } from '~/schema/ascent'

type GradeFrequency = {
  grade: Grade
  Onsight: number
  OnsightColor: string
  Flash: number
  FlashColor: string
  Redpoint: number
  RedpointColor: string
}[]

export function getGradeFrequencyAndColors(
  filteredAscents: Ascent[],
): GradeFrequency {
  const sortedFilteredGrades = [
    ...new Set(filteredAscents.map(({ topoGrade }) => topoGrade)),
  ].sort()

  const gradeClimbingStylesCount: GradeFrequency = sortedFilteredGrades.map(
    grade => {
      const filteredAscentsByGrade = filterAscents(filteredAscents, { grade })

      return {
        grade,
        Onsight: filterAscents(filteredAscentsByGrade, { style: 'Onsight' })
          .length,
        OnsightColor: 'var(--onsight)',
        Flash: filterAscents(filteredAscentsByGrade, { style: 'Flash' }).length,
        FlashColor: 'var(--flash)',
        Redpoint: filterAscents(filteredAscentsByGrade, { style: 'Redpoint' })
          .length,
        RedpointColor: 'var(--redpoint)',
      }
    },
  )

  return gradeClimbingStylesCount
}
