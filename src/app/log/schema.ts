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
    hasTraining: z.boolean(),
    training: trainingDetailsSchema.partial(),
  })
  .superRefine((form, context) => {
    if (!form.hasTraining && form.ascents.length === 0)
      context.addIssue({
        code: 'custom',
        message: 'Add at least one ascent or a training session',
        path: ['ascents'],
      })

    if (form.ascents.length > 0 && form.location === undefined)
      context.addIssue({
        code: 'custom',
        message: 'A location is required when logging ascents',
        path: ['location'],
      })

    if (form.hasTraining) {
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
  const ascents: AscentPublicInput[] = form.ascents.map(ascent =>
    ascentPublicInputSchema.parse({
      ...ascent,
      crag: form.location,
      date: form.date,
    }),
  )

  const training: TrainingSessionPublicInput | undefined = form.hasTraining
    ? trainingSessionPublicInputSchema.parse({
        ...form.training,
        date: form.date,
        discipline: form.discipline,
        location: form.location,
      })
    : undefined

  return { ascents, training }
}

export const climbingLogFormSchema = z.preprocess(value => {
  if (
    typeof value === 'object' &&
    value !== null &&
    'hasTraining' in value &&
    value.hasTraining === false
  )
    return { ...value, training: {} }
  return value
}, climbingLogDraftValueSchema.transform(buildClimbingLogValue))

export type ClimbingLogFormInput = z.input<typeof climbingLogFormSchema>
export type ClimbingLogValue = z.output<typeof climbingLogFormSchema>
