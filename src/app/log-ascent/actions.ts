'use server'

import { stringifyDate } from '@edouardmisset/date/convert-string-date.ts'
import { env } from '~/env.js'
import { api } from '~/trpc/server.ts'
import type { AscentFormOutput } from './types.ts'
import { ascentFormOutputSchema } from './types.ts'

export const onSubmit = async (
  formData: AscentFormOutput,
): Promise<boolean> => {
  if (env.NODE_ENV === 'development') {
    globalThis.console.log(
      'Received form data:',
      JSON.stringify(formData, null, 2),
    )
  }

  const parsedFormData = ascentFormOutputSchema.safeParse(formData)

  if (!parsedFormData.success) {
    globalThis.console.error(parsedFormData.error)
    return false
  }

  const { data: form } = parsedFormData

  const ascentWithFormattedDate = {
    ...form,
    date: stringifyDate(new Date(form.date)),
  }

  return await api.ascents.addOne(ascentWithFormattedDate)
}
