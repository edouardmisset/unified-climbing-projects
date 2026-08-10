import { describe, expect, it } from 'vite-plus/test'
import { sampleAscents } from '~/data/sample-ascents'
import { filterAscents } from './filter-ascents'
import { deriveAscentFilterModel } from './derive-ascent-filter-model'

describe('deriveAscentFilterModel', () => {
  it('returns the same result set as the existing ascent filter', () => {
    const filters = {
      area: 'Rive Droite',
      discipline: 'Sport' as const,
      style: 'Redpoint' as const,
      year: 2_022,
    }

    const model = deriveAscentFilterModel(sampleAscents, filters)

    expect(model.ascents).toStrictEqual(filterAscents(sampleAscents, filters))
  })

  it('derives facet options from all filters except the facet itself', () => {
    const model = deriveAscentFilterModel(sampleAscents, { discipline: 'Sport' })

    expect(model.facets.disciplines).toContain('Bouldering')
    expect(model.facets.styles).not.toHaveLength(0)
    expect(model.facets.years).toStrictEqual([...model.facets.years].toSorted().toReversed())
  })
})
