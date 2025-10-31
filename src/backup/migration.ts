import { readFile, writeFile } from 'node:fs/promises'
import {
  BOULDERING,
  type Ascent as NewAscent,
  ascentSchema as newAscentSchema,
  SPORT,
} from '~/schema/ascent'
import { oldAscentSchema } from './migration-helpers'

const updateClimbingDiscipline = (ascent: {
  climbingDiscipline: string
  comments?: string
}): NewAscent['discipline'] => {
  let newDiscipline = ascent.climbingDiscipline
  const oldDiscipline = ascent.climbingDiscipline

  const lowercaseComments = ascent.comments?.toLowerCase() ?? ''
  if (
    lowercaseComments.includes('deep water solo') ||
    lowercaseComments.includes('deep-water-solo') ||
    lowercaseComments.includes('dws') ||
    lowercaseComments.includes('psicobloc')
  ) {
    newDiscipline = 'Deep Water Soloing'
  }

  if (oldDiscipline === SPORT) {
    newDiscipline = SPORT
  } else if (oldDiscipline === BOULDERING) {
    newDiscipline = BOULDERING
  } else if (oldDiscipline === 'Multi-Pitch') {
    newDiscipline = 'Multi-Pitch'
  } else if (oldDiscipline === 'Deep Water Soloing') {
    newDiscipline = 'Deep Water Soloing'
  } else {
    newDiscipline = oldDiscipline
  }
  return newAscentSchema.shape.discipline.parse(newDiscipline)
}

const migrateAscents = async (inputFilePath: string) => {
  const oldAscents = oldAscentSchema
    .array()
    .parse(JSON.parse(await readFile(inputFilePath, 'utf8')))

  const _newAscents = oldAscents.map(ascent => {
    const newDiscipline = updateClimbingDiscipline(ascent)

    return {
      _id: ascent._id,
      area: ascent.area?.trim(),
      comments: ascent.comments?.trim(),
      crag: ascent.crag.trim(),
      date: ascent.date,
      discipline: newDiscipline,
      grade: ascent.topoGrade,
      height: ascent.height,
      holds: ascent.holds,
      name: ascent.routeName.trim(),
      personalGrade: ascent.personalGrade,
      profile: ascent.profile,
      rating: ascent.rating,
      style: ascent.style,
      tries: ascent.tries,
    } satisfies NewAscent
  })

  const result = newAscentSchema.array().safeParse(_newAscents)

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
  migrateAscents('./ascent-data-sample-2025-10-31.json')
}
