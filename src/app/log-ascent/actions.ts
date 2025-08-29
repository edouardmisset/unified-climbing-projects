'use server'

import { api } from '~/trpc/server.ts'
import { ascentFormOutputSchema } from './types.ts'

export const onSubmit = async (
  formData: Record<string, unknown>,
): Promise<boolean> => {
  const parsedFormData = ascentFormOutputSchema.safeParse(formData)

  if (!parsedFormData.success) {
    globalThis.console.error(parsedFormData.error)
    return false
  }

  const { data: form } = parsedFormData

  return await api.ascents.addOne(form)
}
