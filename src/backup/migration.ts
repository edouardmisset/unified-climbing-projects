import { readFile, writeFile } from 'node:fs/promises'
import {
  BOULDERING,
  DEEP_WATER_SOLOING,
  MULTI_PITCH,
  type Ascent as NewAscent,
  ascentSchema as newAscentSchema,
  SPORT,
} from '~/schema/ascent'
import { oldAscentSchema } from './migration-helpers'

const deepWaterRegex = /deep[\s-]?water[\s-]?solo(ing)?|dws|psicobloc/i

const updateClimbingDiscipline = (ascent: {
  climbingDiscipline: string
  comments?: string
}): NewAscent['discipline'] => {
  let newDiscipline = ascent.climbingDiscipline
  const oldDiscipline = ascent.climbingDiscipline

  if (oldDiscipline === 'Route') {
    newDiscipline = SPORT
  } else if (oldDiscipline === 'Boulder') {
    newDiscipline = BOULDERING
  } else if (oldDiscipline === 'Multi-Pitch') {
    newDiscipline = MULTI_PITCH
  } else if (oldDiscipline === 'Deep Water Soloing') {
    newDiscipline = DEEP_WATER_SOLOING
  } else {
    newDiscipline = oldDiscipline
  }

  if (deepWaterRegex.test(ascent.comments?.toLowerCase() ?? '')) {
    newDiscipline = 'Deep Water Soloing'
  }

  return newAscentSchema.shape.discipline.parse(newDiscipline)
}

const migrateAscents = async (inputFilePath: string) => {
  const oldAscents = oldAscentSchema
    .array()
    .parse(JSON.parse(await readFile(inputFilePath, 'utf8')))

  const newAscents = oldAscents.map(
    ascent =>
      ({
        _id: ascent._id,
        area: ascent.area?.trim(),
        comments: ascent.comments?.trim(),
        crag: ascent.crag.trim(),
        date: ascent.date,
        discipline: updateClimbingDiscipline(ascent),
        grade: ascent.topoGrade,
        height: ascent.height,
        holds: ascent.holds,
        name: ascent.routeName.trim(),
        personalGrade: ascent.personalGrade,
        profile: ascent.profile,
        rating: ascent.rating,
        style: ascent.style,
        tries: ascent.tries,
      }) satisfies NewAscent,
  )

  const result = newAscentSchema.array().safeParse(newAscents)

  if (!result.success) {
    console.error('Migration failed with the following errors:')
    for (const issue of result.error.issues) {
      console.error(`- ${issue.path.join('.')} : ${issue.message}`)
    }
    throw new Error('Ascent migration failed. See errors above.')
  }

  await writeFile(
    inputFilePath.replace('.json', '-migrated.json'),
    JSON.stringify(result.data, null, 2),
    'utf8',
  )
}

if (import.meta.main) {
  migrateAscents('./src/backup/ascent-data-2025-10-31.json')
}
