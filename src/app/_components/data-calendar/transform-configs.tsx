import { AscentsPopoverDescription } from '~/app/_components/ascents-popover-description/ascents-popover-description'
import { TrainingPopoverDescription } from '~/app/_components/training-popover-description/training-popover-description'
import { fromGradeToBackgroundColor } from '~/helpers/ascent-converter'
import { displayGrade } from '~/helpers/display-grade'
import { getHardestAscent } from '~/helpers/filter-ascents'
import { prettyLongDate } from '~/helpers/formatters'
import { getSessionTypeColors } from '~/helpers/training-converter'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import type { DataTransformConfig } from './types'

/**
 * Configuration for transforming ascent data to calendar entries
 */
export const ascentTransformConfig: DataTransformConfig<Ascent> = {
  getBackgroundColor: (ascents) => {
    if (ascents.length === 0) return undefined
    const { topoGrade } = getHardestAscent(ascents)
    return fromGradeToBackgroundColor(topoGrade)
  },
  
  getShortText: (ascents) => {
    if (ascents.length === 0) return ''
    const { topoGrade } = getHardestAscent(ascents)
    const { climbingDiscipline } = ascents[0]
    return displayGrade({ climbingDiscipline, grade: topoGrade })
  },
  
  getTitle: (ascents) => {
    if (ascents.length === 0) return ''
    const { date, crag } = ascents[0]
    return `${prettyLongDate(date)} - ${crag}`
  },
  
  getDescription: (ascents) => {
    if (ascents.length === 0) return ''
    return <AscentsPopoverDescription ascents={ascents} />
  },
  
  getIsSpecialCase: (ascents) => {
    return ascents.every(ascent => ascent.climbingDiscipline === 'Boulder')
  }
}

/**
 * Configuration for transforming training session data to calendar entries
 */
export const trainingTransformConfig: DataTransformConfig<TrainingSession> = {
  getBackgroundColor: (sessions) => {
    if (sessions.length === 0) return undefined
    const { sessionType, intensity, volume } = sessions[0]
    return getSessionTypeColors({
      intensityPercent: intensity,
      sessionType,
      volumePercent: volume,
    })
  },
  
  getShortText: (sessions) => {
    if (sessions.length === 0) return ''
    return sessions[0].sessionType || ''
  },
  
  getTitle: (sessions) => {
    if (sessions.length === 0) return ''
    return prettyLongDate(sessions[0].date)
  },
  
  getDescription: (sessions) => {
    if (sessions.length === 0) return ''
    return <TrainingPopoverDescription trainingSessions={sessions} />
  },
  
  getIsSpecialCase: () => false
}