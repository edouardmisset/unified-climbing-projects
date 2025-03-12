'use server'

import type { SubmitHandler } from 'react-hook-form'
import { type TrainingSession, trainingSessionSchema } from '~/schema/training'
import { api } from '~/trpc/server'

export const onSubmit: SubmitHandler<
  Record<string, unknown>
> = async formData => {
  const parsedFormData = trainingSessionSchema
    .omit({ load: true })
    .omit({ id: true })
    .safeParse(formData)

  if (!parsedFormData.success) {
    globalThis.console.error(parsedFormData.error)
    return
  }

  const { data: form } = parsedFormData

  const { volume, intensity } = form

  const newTrainingSession = {
    ...form,
    load:
      volume === undefined || intensity === undefined
        ? undefined
        : Math.round((volume * intensity) / 100),
  } satisfies Omit<TrainingSession, 'id'>

  return await api.training.addOne(newTrainingSession)
}
