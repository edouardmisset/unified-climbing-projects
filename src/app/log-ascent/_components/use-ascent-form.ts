import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import {
  fromGradeToNumber,
  fromNumberToGrade,
} from '~/helpers/grade-converter.ts'
import { type Ascent, ascentSchema, type Grade } from '~/schema/ascent'
import { api } from '~/trpc/react.tsx'
import { onSubmit } from '../actions.ts'
import type { InternalFormData } from '../types.ts'
import {
  fromInternalFormData,
  toInternalFormData,
} from './form-transformers.ts'

type UseAscentFormParams = {
  latestAscent?: Ascent
  minGrade: Grade
  maxGrade: Grade
}

export function useAscentForm(params: UseAscentFormParams) {
  const { latestAscent, minGrade } = params
  const utils = api.useUtils()
  const router = useRouter()

  // Create default form values
  const defaultValues = toInternalFormData(
    {
      area: latestAscent?.area,
      climbingDiscipline: latestAscent?.climbingDiscipline,
      crag: latestAscent?.crag,
      date: new Date(),
      routeName: '',
      style:
        latestAscent?.climbingDiscipline === 'Boulder' ? 'Flash' : 'Onsight',
    },
    minGrade,
  )

  const form = useForm<InternalFormData>({
    defaultValues,
  })

  const { handleSubmit, watch, setValue, reset } = form

  // Watch values for business logic
  const numberOfTries = watch('tries')
  const discipline = watch('climbingDiscipline')
  const isBoulder = discipline === 'Boulder'

  // Business logic handlers
  const handleTopoGradeChange = useCallback(
    (value: number | null) => {
      const grade = value ?? fromGradeToNumber(minGrade)
      setValue('topoGrade', grade)
      setValue('personalGrade', grade) // Sync personal grade with topo grade
    },
    [setValue, minGrade],
  )

  const handlePersonalGradeChange = useCallback(
    (value: number | null) => {
      const grade = value ?? fromGradeToNumber(minGrade)
      setValue('personalGrade', grade)
    },
    [setValue, minGrade],
  )

  const handleTriesChange = useCallback(
    (tries: string) => {
      setValue('tries', tries)

      // Auto-update style based on tries
      const triesNumber = Number(tries)
      if (triesNumber > 1) {
        setValue('style', 'Redpoint')
      } else if (triesNumber === 1) {
        setValue('style', isBoulder ? 'Flash' : 'Onsight')
      }
    },
    [setValue, isBoulder],
  )

  const handleStyleChange = useCallback(
    (style: string) => {
      const res = ascentSchema.shape.style.safeParse(style)
      if (!res.success) {
        console.error('Invalid style:', res.error)
        return
      }

      setValue('style', res.data)
    },
    [setValue],
  )

  // Form submission
  const onFormSubmit = handleSubmit(
    async (data: InternalFormData) => {
      const externalData = fromInternalFormData(data)
      const promise = onSubmit(externalData)

      toast.promise(promise, {
        error: 'Submission failed, please try again.',
        pending: 'Submitting...',
        success: `You sent ${data.routeName} (${fromNumberToGrade(data.topoGrade)})`,
      })

      if (!(await promise)) return

      reset()
      await utils.ascents.invalidate()
      router.refresh()
    },
    error => {
      console.error(error)
      if ('message' in error) {
        toast.error(`Error: ${error.message}`)
      } else {
        toast.error('Something went wrong')
      }
    },
  )

  return {
    form,
    formState: {
      numberOfTries,
      isBoulder,
    },
    handlers: {
      onSubmit: onFormSubmit,
      onTopoGradeChange: handleTopoGradeChange,
      onPersonalGradeChange: handlePersonalGradeChange,
      onTriesChange: handleTriesChange,
      onStyleChange: handleStyleChange,
    },
  }
}
