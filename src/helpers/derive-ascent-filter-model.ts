import { stringEqualsCaseInsensitive, stringIncludes } from '@edouardmisset/text'
import { ASCENT_DISCIPLINES } from '~/domain/ascent'
import { isDateInPeriod } from '~/helpers/period'
import { compareStringsAscending } from '~/helpers/sort-strings'
import { ASCENT_STYLE, type Ascent } from '~/schema/ascent'
import type { Period } from '~/schema/generic'

export type AscentFilterValues = {
  area?: string
  crag?: string
  discipline?: Ascent['discipline']
  grade?: Ascent['grade']
  period?: Period
  route?: string
  style?: Ascent['style']
  year?: number
}

export type AscentFilterFacets = {
  areas: string[]
  crags: string[]
  disciplines: Ascent['discipline'][]
  styles: Ascent['style'][]
  years: string[]
}

type DeriveAscentFilterModelResult = { ascents: Ascent[]; facets: AscentFilterFacets }

export function deriveAscentFilterModel(
  ascents: Ascent[],
  filters: AscentFilterValues,
): DeriveAscentFilterModelResult {
  const areas = new Set<NonNullable<Ascent['area']>>()
  const crags = new Set<NonNullable<Ascent['crag']>>()
  const disciplines = new Set<Ascent['discipline']>()
  const styles = new Set<Ascent['style']>()
  const years = new Set<string>()
  const results: Ascent[] = []

  for (const ascent of ascents) {
    const date = new Date(ascent.date)
    const matches = {
      area: matchesText(ascent.area, filters.area),
      crag: matchesText(ascent.crag, filters.crag),
      discipline: filters.discipline === undefined || ascent.discipline === filters.discipline,
      grade: matchesText(ascent.grade, filters.grade),
      period: isDateInPeriod(date, filters.period),
      style: filters.style === undefined || ascent.style === filters.style,
      year: filters.year === undefined || date.getFullYear() === filters.year,
    }
    const matchesOther = (...excluded: (keyof typeof matches)[]) =>
      Object.entries(matches).every(
        ([key, value]) => excluded.includes(key as keyof typeof matches) || value,
      )

    if (matchesOther('year', 'grade', 'period')) years.add(String(date.getFullYear()))
    if (matchesOther('discipline', 'grade')) disciplines.add(ascent.discipline)
    if (matchesOther('style', 'grade')) styles.add(ascent.style)
    if (matchesOther('crag', 'grade')) {
      const crag = ascent.crag.trim()
      if (crag !== '') crags.add(crag)
    }
    if (matchesOther('area', 'grade')) {
      const area = ascent.area?.trim()
      if (area !== undefined && area !== '') areas.add(area)
    }

    if (Object.values(matches).every(Boolean) && matchesRoute(ascent.name, filters.route))
      results.push(ascent)
  }

  return {
    ascents: results,
    facets: {
      areas: [...areas].toSorted(compareStringsAscending),
      crags: [...crags].toSorted(compareStringsAscending),
      disciplines: ASCENT_DISCIPLINES.filter(discipline => disciplines.has(discipline)),
      styles: ASCENT_STYLE.filter(style => styles.has(style)),
      years: [...years].toSorted((a, b) => Number(b) - Number(a)),
    },
  }
}

function matchesText(actual: string | undefined, expected: string | undefined): boolean {
  return (
    expected === undefined ||
    (actual !== undefined && stringEqualsCaseInsensitive(actual, expected))
  )
}

function matchesRoute(name: string, route: string | undefined): boolean {
  return route === undefined || route === '' || stringIncludes(name, route)
}
