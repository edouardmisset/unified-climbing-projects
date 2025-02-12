import { fromGradeToClassName } from '~/helpers/converter'
import { getHardestAscent } from '~/helpers/filter-ascents'
import { createAscentsQRTooltip } from '~/helpers/tooltips'
import type { Ascent } from '~/schema/ascent'
import type { StringDate } from '~/types/generic'

export function ascentsQRCodeRender(
  ascentDay: { ascents?: Ascent[] } & StringDate,
) {
  const { ascents, date } = ascentDay

  const hardestAscent = ascents && getHardestAscent(ascents)
  return (
    <span
      key={date}
      className={fromGradeToClassName(hardestAscent?.topoGrade)}
      title={createAscentsQRTooltip(ascents)}
    />
  )
}
