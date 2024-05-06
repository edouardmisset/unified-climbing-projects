import { type Ascent } from '~/types/ascent'
import { type TrainingSession } from '~/types/training'

export const createAscentTooltip = (ascents: Ascent[]): string =>
  ascents.length >= 1
    ? `📅 ${ascents[0]!.date.toLocaleString(undefined, {
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

export const createTrainingTooltip = ({
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
}: TrainingSession): string => {
  const datum = `📅 ${date.toLocaleString(undefined, {
    day: "numeric",
    weekday: "long",
    month: "long",
  })
    }`
  const cragum = gymCrag
    ? `\t${routeOrBouldering === "Bouldering"
      ? "🪨"
      : routeOrBouldering === "Route"
        ? "🧗"
        : routeOrBouldering === "Multi-Pitch"
          ? "⛰️"
          : ""
    } ${gymCrag}`
    : ""
  const seshum = sessionType ? ` (${sessionType})` : ""
  const volum = volume ? `Volume: ${volume}%` : ""
  const intensitum = intensity ? `Intensity: ${intensity}%` : ""
  const loadum = load ? `Load: ${roundToTen(load)}%` : ""
  const commentum = comments ? `💬 “${comments}”` : ""
  const anatomicum = anatomicalRegion === undefined
    ? ""
    : `| ${anatomicalRegion === "Ar"
      ? "💪"
      : anatomicalRegion === "Fi"
        ? "🖐️"
        : anatomicalRegion === "Ge"
          ? "🦵"
          : ""
    }`
  const energium = energySystem === undefined
    ? ""
    : `| ${energySystem === "AA"
      ? "🔥"
      : energySystem === "AL"
        ? "🪫"
        : energySystem === "AE"
          ? "🫀"
          : ""
    }`

  return [
    `${datum} ${cragum} ${seshum}`,
    `${volum} ${intensitum} ${loadum} ${anatomicum} ${energium}`,
    commentum,
  ].filter((s) => s !== "").join("\n\n")
}


export const roundToTen = (n: number): number => Math.round(n / 10) * 10
