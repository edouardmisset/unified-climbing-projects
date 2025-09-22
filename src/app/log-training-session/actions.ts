'use server'

import { calculateLoad } from '~/helpers/calculate-load'
import {
  type TrainingSession,
  trainingSessionFormSchema,
} from '~/schema/training'
import { api } from '~/trpc/server'

export const onSubmit = async (
  formData: Record<string, unknown>,
): Promise<boolean> => {
  const parsedFormData = trainingSessionFormSchema.safeParse(formData)

  if (!parsedFormData.success) {
    globalThis.console.error(parsedFormData.error)
    return false
  }

  const { data: form } = parsedFormData

  const { volume, intensity } = form

  const newTrainingSession = {
    ...form,
    load: calculateLoad(volume, intensity),
  } satisfies Omit<TrainingSession, '_id'>

  return await api.training.addOne(newTrainingSession)
}
