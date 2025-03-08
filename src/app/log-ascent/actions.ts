'use server'

import { stringifyDate } from '@edouardmisset/date/convert-string-date.ts'
import type { SubmitHandler } from 'react-hook-form'
import { api } from '~/trpc/server.ts'
import { ascentFormOutputSchema } from './types.ts'

export const onSubmit: SubmitHandler<
  Record<string, unknown>
> = async formData => {
  const parsedFormData = ascentFormOutputSchema.safeParse(formData)

  if (!parsedFormData.success) {
    globalThis.console.error(parsedFormData.error)
    return
  }

  const { data: form } = parsedFormData

  const ascentInGSFormat = {
    ...form,
    date: stringifyDate(new Date(form.date)),
  }

  await api.ascents.addOne(ascentInGSFormat)

  globalThis.console.log('Ascent added successfully:', ascentInGSFormat)

  return parsedFormData
}
