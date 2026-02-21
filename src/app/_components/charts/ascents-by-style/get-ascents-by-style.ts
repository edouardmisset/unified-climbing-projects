import { ASCENT_STYLE_TO_COLOR } from '~/constants/ascents'
import { filterAscents } from '~/helpers/filter-ascents'
import { ASCENT_STYLE, type Ascent } from '~/schema/ascent'

type AscentByStyle = {
  color: string
  id: Ascent['style']
  label: Ascent['style']
  value: number
}

export const getAscentsByStyle = (ascents: Ascent[]): AscentByStyle[] =>
  ASCENT_STYLE.map(style => {
    const filteredAscentsByStyle = filterAscents(ascents, { style })

    if (filteredAscentsByStyle.length === 0) return

    return {
      color: fromAscentStyleToBackgroundColor(style),
      id: style,
      label: style,
      value: filteredAscentsByStyle.length,
    }
  }).filter(val => val !== null)

function fromAscentStyleToBackgroundColor(ascentStyle: Ascent['style']): string {
  return ASCENT_STYLE_TO_COLOR[ascentStyle] ?? 'var(--gray-5)'
}
