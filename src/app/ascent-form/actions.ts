'use server'

import { revalidatePath } from 'next/cache'
import { trimAndNormalizeStringsInObject } from '~/helpers/trim-and-normalize-string-in-object.ts'
import { addAscent } from '~/services/ascents'
import type { Object_ } from '~/types/generic.ts'
import { ascentFormOutputSchema } from './types.ts'

export const onSubmit = async (formData: Object_): Promise<boolean> => {
  const normalizedFormData = trimAndNormalizeStringsInObject(formData)

  const parsedFormData = ascentFormOutputSchema.safeParse(normalizedFormData)

  if (!parsedFormData.success) return false

  try {
    await addAscent(parsedFormData.data)
    revalidatePath('/', 'layout')
    return true
  } catch (error) {
    globalThis.console.error('Error adding ascent:', error instanceof Error ? error.message : error)
    return false
  }
}
