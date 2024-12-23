import { ASCENT_STYLE_TO_COLOR } from '~/constants/ascents'
import { ASCENT_STYLE, type Ascent } from '~/schema/ascent'

export const getAscentsByStyle = (ascents: Ascent[]) => {
  return ASCENT_STYLE.map(style => {
    const filteredAscentsByStyle = ascents.filter(
      ({ style: ascentStyle }) => style === ascentStyle,
    )

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
