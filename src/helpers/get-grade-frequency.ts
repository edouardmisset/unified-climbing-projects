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

export function getGradeFrequency(filteredAscents: Ascent[]): GradeFrequency {
  const sortedFilteredGrades = [
    ...new Set(filteredAscents.map(({ topoGrade }) => topoGrade)),
  ].sort()

  const gradeClimbingStylesCount = sortedFilteredGrades.map(grade => {
    const filteredAscentsByGrade = filteredAscents.filter(
      ({ topoGrade }) => topoGrade === grade,
    )

    return {
      grade,
      Onsight: filteredAscentsByGrade.filter(({ style }) => style === 'Onsight')
        .length,
      OnsightColor: 'var(--green-5)',
      Flash: filteredAscentsByGrade.filter(({ style }) => style === 'Flash')
        .length,
      FlashColor: 'var(--yellow-5)',
      Redpoint: filteredAscentsByGrade.filter(
        ({ style }) => style === 'Redpoint',
      ).length,
      RedpointColor: 'var(--red-5)',
    }
  })

  return gradeClimbingStylesCount as {
    grade: Grade
    Onsight: number
    OnsightColor: string
    Flash: number
    FlashColor: string
    Redpoint: number
    RedpointColor: string
  }[]
}
