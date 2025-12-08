import { AscentsPopoverDescription } from '~/app/_components/ascents-popover-description/ascents-popover-description'
import { TrainingPopoverDescription } from '~/app/_components/training-popover-description/training-popover-description'
import { fromGradeToBackgroundColor } from '~/helpers/ascent-converter'
import { getHardestAscent } from '~/helpers/filter-ascents'
import { prettyLongDate } from '~/helpers/formatters'
import { getSessionTypeColors } from '~/helpers/training-converter'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { DisplayGrade } from '../climbing/display-grade/display-grade'
import type { DataTransformConfig } from './types'

/**
 * Configuration for transforming ascent data to calendar entries
 */
export const ascentTransformConfig: DataTransformConfig<Ascent> = {
  getBackgroundColor: ascents => {
    if (ascents.length === 0) return ''
    const { topoGrade } = getHardestAscent(ascents)
    return fromGradeToBackgroundColor(topoGrade)
  },

  getShortText: ascents => {
    if (ascents.length === 0) return ''
    const { topoGrade, climbingDiscipline } = getHardestAscent(ascents)
    return DisplayGrade({ climbingDiscipline, grade: topoGrade })
  },

  getTitle: ascents => {
    if (ascents[0] === undefined) return ''
    const { date, crag } = ascents[0]
    return `${prettyLongDate(date)} - ${crag}`
  },

  getDescription: ascents =>
    ascents.length === 0 ? '' : <AscentsPopoverDescription ascents={ascents} />,

  getIsSpecialCase: ascents =>
    ascents.every(ascent => ascent.climbingDiscipline === 'Boulder'),
}

/**
 * Configuration for transforming training session data to calendar entries
 */
export const trainingTransformConfig: DataTransformConfig<TrainingSession> = {
  getBackgroundColor: sessions => {
    if (sessions[0] === undefined) return ''
    const { sessionType, intensity, volume } = sessions[0]
    return getSessionTypeColors({
      intensityPercent: intensity,
      sessionType,
      volumePercent: volume,
    })
  },

  getShortText: sessions => {
    if (sessions[0] === undefined) return ''
    return sessions[0].sessionType || ''
  },

  getTitle: sessions => {
    if (sessions[0] === undefined) return ''
    return prettyLongDate(sessions[0].date)
  },

  getDescription: sessions => {
    if (sessions.length === 0) return ''
    return <TrainingPopoverDescription trainingSessions={sessions} />
  },

  getIsSpecialCase: () => false,
}
