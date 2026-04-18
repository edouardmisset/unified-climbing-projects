import { ASCENT_STYLE_TO_COLOR } from '~/constants/ascents'
import { filterAscents } from '~/helpers/filter-ascents'
import { ASCENT_STYLE, ascentStyleSchema, type Ascent } from '~/schema/ascent'

const PARSED_ASCENT_STYLES = ASCENT_STYLE.map(raw => ascentStyleSchema.parse(raw))

type AscentByStyle = {
  color: string
  id: Ascent['style']
  label: Ascent['style']
  value: number
}

export const getAscentsByStyle = (ascents: Ascent[]): AscentByStyle[] =>
  PARSED_ASCENT_STYLES.map(style => {
    const filteredAscentsByStyle = filterAscents(ascents, { style })

    if (filteredAscentsByStyle.length === 0) return

    return {
      color: fromAscentStyleToBackgroundColor(style),
      id: style,
      label: style,
      value: filteredAscentsByStyle.length,
    }
  }).filter(style => style !== undefined)

function fromAscentStyleToBackgroundColor(ascentStyle: Ascent['style']): string {
  return ASCENT_STYLE_TO_COLOR[ascentStyle as keyof typeof ASCENT_STYLE_TO_COLOR] ?? 'var(--gray-5)'
}
