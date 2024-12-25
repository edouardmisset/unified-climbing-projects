import { fromGradeToBackgroundColor } from '~/helpers/converter'
import { createAscentsQRTooltip } from '~/helpers/tooltips'
import type { Ascent } from '~/schema/ascent'
import type { StringDateTime } from '~/types/generic'

export function ascentsQRCodeRender(
  ascentDay: { ascents?: Ascent[] } & StringDateTime,
) {
  const hardestAscent = ascentDay?.ascents?.at(0)
  return (
    <span
      key={ascentDay.date}
      style={{
        backgroundColor:
          hardestAscent === undefined
            ? 'white'
            : fromGradeToBackgroundColor(hardestAscent.topoGrade),
      }}
      title={
        ascentDay?.ascents ? createAscentsQRTooltip(ascentDay.ascents) : ''
      }
    />
  )
}
