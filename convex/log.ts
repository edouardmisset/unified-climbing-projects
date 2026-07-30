import { ascentPublicInputSchema } from '~/domain/canonical/ascent'
import {
  createAscentFingerprintInput,
  createTrainingSessionFingerprintInput,
} from '~/domain/canonical/fingerprint-input'
import { trainingSessionPublicInputSchema } from '~/domain/canonical/training-session'
import { zodToConvex } from 'convex-helpers/server/zod'
import { v } from 'convex/values'
import { mutation } from './_generated/server'
import { requireIdentity } from './auth'
import { createContentFingerprint } from './fingerprint'
import { assertWritesEnabled } from './maintenance'

const publicAscentInputValidator = zodToConvex(ascentPublicInputSchema)
const publicTrainingInputValidator = zodToConvex(trainingSessionPublicInputSchema)
const ascentIdValidator = v.id('ascents')
const trainingIdValidator = v.id('training')
const ascentIdsValidator = v.array(ascentIdValidator)
const optionalTrainingIdValidator = v.optional(trainingIdValidator)

export const post = mutation({
  args: {
    ascents: v.array(publicAscentInputValidator),
    training: v.optional(publicTrainingInputValidator),
  },
  returns: v.object({
    ascentIds: ascentIdsValidator,
    trainingId: optionalTrainingIdValidator,
  }),
  handler: async (ctx, args) => {
    assertWritesEnabled()
    const { subject } = await requireIdentity(ctx)
    const ascents = ascentPublicInputSchema.array().parse(args.ascents)
    const training =
      args.training === undefined
        ? undefined
        : trainingSessionPublicInputSchema.parse(args.training)

    if (training === undefined && ascents.length === 0)
      throw new Error('A climbing log must contain a training session or at least one ascent')

    const trainingId =
      training === undefined
        ? undefined
        : await ctx.db.insert('training', {
            ...training,
            contentFingerprint: await createContentFingerprint(
              createTrainingSessionFingerprintInput(training),
            ),
            ownerId: subject,
          })

    const ascentIds = await Promise.all(
      ascents.map(async ascent => {
        const contentFingerprint = await createContentFingerprint(
          createAscentFingerprintInput(ascent),
        )
        return await ctx.db.insert('ascents', {
          ...ascent,
          contentFingerprint,
          ownerId: subject,
        })
      }),
    )

    return trainingId === undefined ? { ascentIds } : { ascentIds, trainingId }
  },
})
