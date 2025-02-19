import { createYearList } from '~/data/helpers'
import { fromGradeToBackgroundColor } from '~/helpers/converter'
import { filterAscents } from '~/helpers/filter-ascents'
import { isDateInYear } from '~/helpers/is-date-in-year'
import { type Ascent, _GRADES } from '~/schema/ascent'

export function getAscentsPerYearByGrade(ascents: Ascent[]): {
  year: number
  [grade: string]: number
}[] {
  const descendingYears = createYearList(ascents, { descending: false })

  const ascentsFrequencyByYear = descendingYears.map(year => {
    const filteredAscentsByYear = ascents.filter(({ date }) =>
      isDateInYear(date, year),
    )

    const yearGradeFrequencyParts = _GRADES.map(grade => {
      const count = filterAscents(filteredAscentsByYear, {
        grade,
      }).length

      return {
        [grade]: count,
        [`${grade}Color`]: fromGradeToBackgroundColor(grade),
      }
    })

    // Merges all objects from `yearGradeFrequencyParts` into one object,
    // combining all properties and overriding duplicates with the last
    // occurrence.
    const yearGradeFrequency = Object.assign({}, ...yearGradeFrequencyParts)

    return {
      year,
      ...yearGradeFrequency,
    }
  })

  return ascentsFrequencyByYear
}
