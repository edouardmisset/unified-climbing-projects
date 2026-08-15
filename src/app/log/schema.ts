import {
  type AscentPublicInput,
  ascentDisciplineSchema,
  ascentFormObjectSchema,
  ascentPublicInputSchema,
} from '~/domain/ascent'
import { isAscentStyleValidForTries } from '~/domain/ascent-rules'
import { calendarDateSchema, optionalTextCodec } from '~/domain/common'
import {
  type TrainingSessionPublicInput,
  trainingSessionFormSchema,
  trainingSessionPublicInputSchema,
} from '~/domain/training-session'
import { includesAscents, includesTraining, LOG_SCOPES } from '~/domain/climbing-log'
import { z } from 'zod'

const ascentDetailsSchema = ascentFormObjectSchema
  .omit({ crag: true, date: true })
  .superRefine((ascent, context) => {
    if (isAscentStyleValidForTries(ascent.style, ascent.tries)) return
    context.addIssue({
      code: 'custom',
      message: 'Ascents with more than 1 try must use Redpoint style',
      path: ['style'],
    })
  })
const trainingDetailsSchema = trainingSessionFormSchema.omit({
  date: true,
  discipline: true,
  location: true,
})
const trainingValueDetailsSchema = trainingSessionPublicInputSchema.omit({
  date: true,
  discipline: true,
  location: true,
})

const climbingLogDraftValueSchema = z
  .object({
    ascents: ascentDetailsSchema.array(),
    date: calendarDateSchema,
    discipline: ascentDisciplineSchema,
    location: optionalTextCodec,
    scope: z.enum(LOG_SCOPES),
    training: trainingDetailsSchema.partial(),
  })
  .superRefine((form, context) => {
    if (includesAscents(form.scope) && form.ascents.length === 0)
      context.addIssue({
        code: 'custom',
        message: 'Log at least one ascent',
        path: ['ascents'],
      })

    if (includesAscents(form.scope) && form.location === undefined)
      context.addIssue({
        code: 'custom',
        message: 'A location is required when logging ascents',
        path: ['location'],
      })

    if (includesTraining(form.scope)) {
      const trainingResult = trainingValueDetailsSchema.safeParse(form.training)
      if (!trainingResult.success)
        for (const issue of trainingResult.error.issues)
          context.addIssue({
            ...issue,
            path: ['training', ...issue.path],
          })
    }
  })

type ClimbingLogDraftValue = z.output<typeof climbingLogDraftValueSchema>

function buildClimbingLogValue(form: ClimbingLogDraftValue) {
  const ascents: AscentPublicInput[] = includesAscents(form.scope)
    ? form.ascents.map(ascent =>
        ascentPublicInputSchema.parse({
          ...ascent,
          crag: form.location,
          date: form.date,
        }),
      )
    : []

  const training: TrainingSessionPublicInput | undefined = includesTraining(form.scope)
    ? trainingSessionPublicInputSchema.parse({
        ...form.training,
        date: form.date,
        discipline: form.discipline,
        location: form.location,
      })
    : undefined

  return { ascents, training }
}

export const climbingLogFormSchema = climbingLogDraftValueSchema.transform(buildClimbingLogValue)

export type ClimbingLogFormInput = z.input<typeof climbingLogFormSchema>
export type ClimbingLogValue = z.output<typeof climbingLogFormSchema>
