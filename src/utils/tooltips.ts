import { Ascent } from '@/types/ascent'
import { TrainingSession } from '@/types/training'

export const createAscentQRTooltip = (ascents: Ascent[]): string =>
  ascents.length >= 1
    ? `📅 ${ascents[0].date.toLocaleString(undefined, {
      day: 'numeric',
      weekday: 'long',
      month: 'long',
    })}
${ascents.some(ascent => ascent.routeOrBoulder === 'Route')
      ? 'Routes'
      : 'Boulders'
    } (${ascents.length}):
${ascents
      .map(
        ({ routeName, topoGrade, routeOrBoulder, crag }) =>
          `${routeOrBoulder === 'Boulder' ? '🪨' : ''}${routeOrBoulder === 'Route' ? '🧗' : ''
          } ${routeName} (${crag}) - ${topoGrade}`,
      )
      .join('\n')}`
    : ''

export const createTrainingQRTooltip = ({
  date,
  routeOrBouldering,
  volume,
  load,
  intensity,
  gymCrag,
  anatomicalRegion,
  energySystem,
  sessionType,
  comments,
}: TrainingSession): string => `📅 ${date.toLocaleString(undefined, {
  day: 'numeric',
  weekday: 'long',
  month: 'long',
})} ${gymCrag
    ? `\t${routeOrBouldering === 'Bouldering'
      ? '🪨'
      : routeOrBouldering === 'Route'
        ? '🧗'
        : routeOrBouldering === 'Multi-Pitch'
          ? '⛰️'
          : ''
    } ${gymCrag}`
    : ''
  }  ${sessionType ? ` (${sessionType})` : ''}
${volume ? `\nVolume: ${volume}%` : ''} ${intensity ? `Intensity: ${intensity}%` : ''
  } ${load ? `Load: ${load}%` : ''}
${comments
    ? `
💬 “${comments}”`
    : ''
  }`
