import { fromGradeToBackgroundColor } from '~/helpers/converter'
import { isDateInYear } from '~/helpers/is-date-in-year'
import { type Ascent, _GRADES } from '~/schema/ascent'

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
