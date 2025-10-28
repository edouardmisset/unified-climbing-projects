'use server'

import { trimAndNormalizeStringsInObject } from '~/helpers/trim-and-normalize-string-in-object.ts'
import { api } from '~/trpc/server'
import type { Object_ } from '~/types/generic.ts'
import { ascentFormOutputSchema } from './types.ts'

export const onSubmit = async (formData: Object_): Promise<boolean> => {
  const normalizedFormData = trimAndNormalizeStringsInObject(formData)

  const parsedFormData = ascentFormOutputSchema.safeParse(normalizedFormData)

  if (!parsedFormData.success) {
    globalThis.console.error(parsedFormData.error)
    return false
  }

  return await api.ascents.addOne(parsedFormData.data)
}
