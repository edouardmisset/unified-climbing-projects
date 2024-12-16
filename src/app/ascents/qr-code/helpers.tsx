import { convertGradeToBackgroundColor } from '~/helpers/converter'
import { createAscentsQRTooltip } from '~/helpers/tooltips'
import { type Ascent, parseISODateToTemporal } from '~/schema/ascent'
import type { StringDateTime } from '~/types/generic'

export function ascentsQRCodeRender(
  ascentDay: { ascents?: Ascent[] } & StringDateTime,
) {
  const hardestAscent = ascentDay?.ascents?.at(0)
  return (
    <span
      key={parseISODateToTemporal(ascentDay.date).dayOfYear}
      style={{
        backgroundColor:
          hardestAscent === undefined
            ? 'white'
            : convertGradeToBackgroundColor(hardestAscent.topoGrade),
      }}
      title={
        ascentDay?.ascents ? createAscentsQRTooltip(ascentDay.ascents) : ''
      }
    />
  )
}
