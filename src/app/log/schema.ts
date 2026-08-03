import { type AscentPublicInput, ascentDisciplineSchema, ascentFormSchema } from '~/domain/ascent'
import { calendarDateSchema, optionalFormStringSchema } from '~/domain/common'
import {
  type TrainingSessionPublicInput,
  trainingSessionFormSchema,
} from '~/domain/training-session'
import { z } from '~/helpers/zod'

const ascentDetailsSchema = ascentFormSchema.omit({ crag: true, date: true })
const trainingDetailsSchema = trainingSessionFormSchema.omit({
  date: true,
  discipline: true,
  location: true,
})

export const climbingLogFormSchema = z
  .object({
    ascents: ascentDetailsSchema.array(),
    date: calendarDateSchema,
    discipline: ascentDisciplineSchema,
    includeTraining: z.boolean(),
    location: optionalFormStringSchema,
    training: trainingDetailsSchema.partial(),
  })
  .superRefine((form, context) => {
    if (!form.includeTraining && form.ascents.length === 0)
      context.addIssue({
        code: 'custom',
        message: 'Log a training session or at least one ascent',
        path: ['ascents'],
      })

    if (form.ascents.length > 0 && form.location === undefined)
      context.addIssue({
        code: 'custom',
        message: 'A location is required when logging ascents',
        path: ['location'],
      })

    if (form.includeTraining) {
      const trainingResult = trainingDetailsSchema.safeParse(form.training)
      if (!trainingResult.success)
        for (const issue of trainingResult.error.issues)
          context.addIssue({
            ...issue,
            path: ['training', ...issue.path],
          })
    }
  })
  .transform(form => {
    const ascents: AscentPublicInput[] = form.ascents.map(ascent =>
      ascentFormSchema.parse({
        ...ascent,
        crag: form.location,
        date: form.date,
      }),
    )

    const training: TrainingSessionPublicInput | undefined = form.includeTraining
      ? trainingSessionFormSchema.parse({
          ...form.training,
          date: form.date,
          discipline: form.discipline,
          location: form.location,
        })
      : undefined

    return { ascents, training }
  })

export type ClimbingLogFormInput = z.input<typeof climbingLogFormSchema>
export type ClimbingLogValue = z.output<typeof climbingLogFormSchema>
