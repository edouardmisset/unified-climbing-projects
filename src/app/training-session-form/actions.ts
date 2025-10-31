'use server'

import { trimAndNormalizeStringsInObject } from '~/helpers/trim-and-normalize-string-in-object'
import { trainingSessionFormSchema } from '~/schema/training'
import { api } from '~/trpc/server'
import type { Object_ } from '~/types/generic'

export const onSubmit = async (formData: Object_): Promise<boolean> => {
  const normalizedFormData = trimAndNormalizeStringsInObject(formData)

  const parsedFormData = trainingSessionFormSchema.safeParse(normalizedFormData)

  if (!parsedFormData.success) {
    globalThis.console.error(parsedFormData.error)
    return false
  }

  return await api.training.addOne(parsedFormData.data)
}
