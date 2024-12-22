import { type Ascent, _GRADES } from '~/schema/ascent'
import { fromGradeToBackgroundColor } from './converter.ts'
import { isDateInYear } from './is-date-in-year'

export function getAscentsPerYearByGrade(ascents: Ascent[]): {
  year: number
  [grade: string]: number | string
}[] {
  const sortedYears = [
    ...new Set(ascents.map(({ date }) => new Date(date).getFullYear())),
  ].sort()

  return sortedYears.map(year => {
    const filteredAscentsByYear = ascents.filter(({ date }) =>
      isDateInYear(date, year),
    )

    const yearGradeFrequency = _GRADES.reduce(
      (acc, grade) => {
        const filteredAscentsByGrade = filteredAscentsByYear.filter(
          ({ topoGrade }) => topoGrade === grade,
        )

        acc[grade] = filteredAscentsByGrade.length
        acc[`${grade}Color`] = fromGradeToBackgroundColor(grade)

        return acc
      },
      {} as { [key: string]: number | string },
    )

    return {
      year,
      ...yearGradeFrequency,
    }
  })
}
