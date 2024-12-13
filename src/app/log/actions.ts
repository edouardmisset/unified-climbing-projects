'use server'

import { stringifyDate } from '@edouardmisset/date'
import type { SubmitHandler } from 'react-hook-form'
import { api } from '~/trpc/server.ts'
import { ascentFormOutputSchema } from './types.ts'

export const onSubmit: SubmitHandler<
  Record<string, unknown>
> = async formData => {
  const parsedFormData = ascentFormOutputSchema.safeParse(formData)

  if (!parsedFormData.success) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    globalThis.console.error(parsedFormData.error)
    return
  }

  const { data: form } = parsedFormData

  api.ascents.addOne({
    ...form,
    date: stringifyDate(new Date(form.date)),
  })
  return
}
