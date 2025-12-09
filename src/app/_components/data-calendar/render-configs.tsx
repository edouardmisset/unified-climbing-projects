import { AscentsPopoverDescription } from '~/app/_components/ascents-popover-description/ascents-popover-description'
import { TrainingPopoverDescription } from '~/app/_components/training-popover-description/training-popover-description'
import { fromGradeToBackgroundColor } from '~/helpers/ascent-converter'
import { getHardestAscent } from '~/helpers/filter-ascents'
import { prettyLongDate } from '~/helpers/formatters'
import { getSessionTypeColors } from '~/helpers/training-converter'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { DisplayGrade } from '../climbing/display-grade/display-grade'
import { CalendarCell } from './calendar-cell'

export const renderAscentDay = (ascents: Ascent[], date: string) => {
  const year = new Date(date).getFullYear()

  if (ascents.length === 0) {
    return <CalendarCell date={date} year={year} />
  }

  const { topoGrade, climbingDiscipline } = getHardestAscent(ascents)
  const backgroundColor = fromGradeToBackgroundColor(topoGrade)
  const shortText = DisplayGrade({ climbingDiscipline, grade: topoGrade })
  const title = `${prettyLongDate(date)} - ${ascents[0]?.crag}`
  const isSpecialCase = ascents.every(
    ascent => ascent.climbingDiscipline === 'Boulder',
  )

  return (
    <CalendarCell
      backgroundColor={backgroundColor}
      date={date}
      description={<AscentsPopoverDescription ascents={ascents} />}
      isSpecialCase={isSpecialCase}
      shortText={shortText}
      title={title}
      year={year}
    />
  )
}

export const renderTrainingDay = (
  sessions: TrainingSession[],
  date: string,
) => {
  const year = new Date(date).getFullYear()

  if (sessions.length === 0 || sessions[0] === undefined) {
    return <CalendarCell date={date} year={year} />
  }

  const { sessionType, intensity, volume } = sessions[0]
  const backgroundColor = getSessionTypeColors({
    intensityPercent: intensity,
    sessionType,
    volumePercent: volume,
  })

  return (
    <CalendarCell
      backgroundColor={backgroundColor}
      date={date}
      description={<TrainingPopoverDescription trainingSessions={sessions} />}
      shortText={sessionType}
      title={`${prettyLongDate(date)} - ${sessionType}`}
      year={year}
    />
  )
}
