'use server'

import { stringifyDate } from '@edouardmisset/date/convert-string-date.ts'
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

  const ascentInGSFormat = {
    ...form,
    date: stringifyDate(new Date(form.date)),
  }

  const result = await api.ascents.addOne(ascentInGSFormat)

  globalThis.console.log('Ascent added successfully:', ascentInGSFormat)

  return result
}
