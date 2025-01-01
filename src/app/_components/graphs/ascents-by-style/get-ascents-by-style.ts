import { ASCENT_STYLE_TO_COLOR } from '~/constants/ascents'
import { filterAscents } from '~/helpers/filter-ascents'
import { ASCENT_STYLE, type Ascent } from '~/schema/ascent'

export const getAscentsByStyle = (ascents: Ascent[]) => {
  return ASCENT_STYLE.map(style => {
    const filteredAscentsByStyle = filterAscents(ascents, { style })

    return {
      id: style,
      label: style,
      value: filteredAscentsByStyle.length,
      color: fromAscentStyleToBackgroundColor(style),
    }
  })
}

const fromAscentStyleToBackgroundColor = (ascentStyle: Ascent['style']) => {
  return ASCENT_STYLE_TO_COLOR[ascentStyle] ?? 'var(--gray-5)'
}
