import type { CSSProperties } from 'react'
import { AscentsPopoverDescription } from '~/app/_components/ascents-popover-description/ascents-popover-description'
import { TrainingPopoverDescription } from '~/app/_components/training-popover-description/training-popover-description'
import { fromGradeToBackgroundColor } from '~/helpers/ascent-converter'
import { getHardestAscent } from '~/helpers/filter-ascents'
import { prettyLongDate } from '~/helpers/formatters'
import { getSessionTypeColors } from '~/helpers/training-converter'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { DisplayGrade } from '../climbing/display-grade/display-grade'
import type { DayTransform } from './types'

export const renderAscentDay: DayTransform<Ascent> = ({ items, date }) => {
  if (items.length === 0) {
    return { date, isEmpty: true }
  }

  const { topoGrade, climbingDiscipline } = getHardestAscent(items)
  const backgroundColor = fromGradeToBackgroundColor(topoGrade)
  const shortText = DisplayGrade({ climbingDiscipline, grade: topoGrade })
  const title = `${prettyLongDate(date)}${items[0]?.crag ? ` - ${items[0]?.crag}` : ''}`
  const isSpecialCase = items.every(ascent => ascent.climbingDiscipline === 'Boulder')
  const style: CSSProperties = { ['--cell-color' as string]: backgroundColor }

  return {
    date,
    content: shortText,
    style,
    popoverDescription: <AscentsPopoverDescription ascents={items} />,
    popoverTitle: title,
    isSpecialCase,
  }
}

export const renderTrainingDay: DayTransform<TrainingSession> = ({
  items,
  date,
}) => {
  if (items.length === 0 || items[0] === undefined) {
    return { date, isEmpty: true }
  }

  const { sessionType, intensity, volume } = items[0]
  const backgroundColor = getSessionTypeColors({
    intensityPercent: intensity,
    sessionType,
    volumePercent: volume,
  })
  const style: CSSProperties = { ['--cell-color' as string]: backgroundColor }

  return {
    date,
    content: sessionType,
    style,
    popoverDescription: <TrainingPopoverDescription trainingSessions={items} />,
    popoverTitle: `${prettyLongDate(date)} - ${sessionType}`,
  }
}
