'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { calculateLoad } from '~/helpers/calculate-load'
import { trimAndNormalizeStringsInObject } from '~/helpers/trim-and-normalize-string-in-object'
import { type TrainingSession, trainingSessionFormSchema } from '~/schema/training'
import { addTrainingSession, TRAINING_CACHE_TAG } from '~/services/training'
import type { Object_ } from '~/types/generic'

export const onSubmit = async (formData: Object_): Promise<boolean> => {
  const normalizedFormData = trimAndNormalizeStringsInObject(formData)

  const parsedFormData = trainingSessionFormSchema.safeParse(normalizedFormData)

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

  try {
    await addTrainingSession(newTrainingSession)
    revalidatePath('/', 'layout')
    return true
  } catch (error) {
    globalThis.console.error('Error adding training session:', error)
    return false
  }
}
