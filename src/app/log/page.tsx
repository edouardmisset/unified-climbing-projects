'use client'

import { type SubmitHandler, useForm } from 'react-hook-form'
import { fromZodError } from 'zod-validation-error'

import { env } from '~/env'
import {
  ROUTE_GRADE_TO_NUMBER,
  convertGradeToNumber,
  convertNumberToGrade,
} from '~/helpers/converter'
import type { Grade } from '~/schema/ascent'
import { GradeSlider } from '../_components/slider/slider'
import { MAX_HEIGHT, MAX_RATING, MIN_HEIGHT, MIN_RATING } from './constants'
import styles from './page.module.css'
import {
  type AscentFormInput,
  ascentFormInputSchema,
  ascentFormOutputSchema,
} from './types'

const climberAverageGrade: Grade = '7b' // TODO: get this from the api

const onSubmit: SubmitHandler<Record<string, unknown>> = async formData => {
  try {
    console.log({ data: formData })
    const parsedData = ascentFormOutputSchema.parse(formData)
    console.log({ parsedData })

    // TODO: send data to the api...
    // If the data is sent to my Google Sheet's DB, we need to make some
    // transformations (personalGrade => 'My Grade', department lookup, climber,
    // etc.)
  } catch (error) {
    const zErrors = fromZodError(error as Zod.ZodError)

    for (const detail of zErrors.details) {
      console.error(detail)
      // TODO: change this console.log to a toast
      console.error(detail.message)
    }
  }
}

// TODO: get intelligent default values from the API
const defaultAscentToParse = {
  routeName:
    env.NEXT_PUBLIC_ENV === 'development' ? 'This_Is_A_Test_Route_Name' : '',
  crag: env.NEXT_PUBLIC_ENV === 'development' ? 'This_Is_A_Test_Crag' : '',
  topoGrade: climberAverageGrade,
  personalGrade: climberAverageGrade,
  date: new Date(),
  holds: 'Crimp',
  climbingDiscipline: 'Route',
  profile: 'Vertical',
  height: env.NEXT_PUBLIC_ENV === 'development' ? 20 : undefined,
  rating: env.NEXT_PUBLIC_ENV === 'development' ? 1 : undefined,
  tries: '1',
} satisfies AscentFormInput
const defaultAscentFormValues =
  ascentFormInputSchema.parse(defaultAscentToParse)

export default function Log(): React.JSX.Element {
  const { handleSubmit, register, setValue, watch } = useForm({
    defaultValues: defaultAscentFormValues,
  })

  const { ref: _unusedRef, ...topoGradeRegister } = register('topoGrade')
  const { ref: _unusedRef2, ...personalGradeRegister } =
    register('personalGrade')

  const topoGradeOrNumber = watch('topoGrade') ?? climberAverageGrade
  const personalGradeOrNumber = watch('personalGrade') ?? topoGradeOrNumber

  const topoGrade =
    typeof topoGradeOrNumber === 'number'
      ? convertNumberToGrade(topoGradeOrNumber)
      : topoGradeOrNumber

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${styles.form} flex-column intrinsic-container`}
      >
        <h2 className={styles.title}>Congrats 🎉</h2>

        <label htmlFor="date" className="flex-column">
          Date
          <input required {...register('date')} type="date" title="Date" />
        </label>
        <label htmlFor="routeName" className="flex-column">
          Route Name
          <input
            required
            id="routeName"
            autoComplete="off"
            {...register('routeName')}
            placeholder="The name of the route or boulder climbed"
            title="Route Name"
          />
        </label>
        <label htmlFor="climbingDiscipline" className="flex-column">
          Route, Boulder or Multi-Pitch
          <select
            id="climbingDiscipline"
            {...register('climbingDiscipline')}
            title="Route, Boulder or Multi-Pitch"
          >
            <option value="Route" defaultChecked>
              Route
            </option>
            <option value="Boulder">Boulder</option>
            <option value="Multi-Pitch">Multi-Pitch</option>
          </select>
        </label>
        <label htmlFor="crag" className="flex-column">
          Crag
          <input
            required
            id="crag"
            {...register('crag')}
            placeholder="The name of the crag"
            title="Crag Name"
          />
        </label>
        <label htmlFor="area" className="flex-column">
          Area
          <input
            id="area"
            {...register('area')}
            placeholder="The name of the crag's sector (or area)"
            title="Crag's area"
          />
        </label>
        <label htmlFor="tries" className="flex-column">
          Tries
          <input
            {...register('tries')}
            min={1}
            step={1}
            type="number"
            id="tries"
            placeholder="1"
            title="Number of tries"
          />
        </label>
        <div className={styles.grades}>
          <label htmlFor="topoGrade" className="">
            Topo Grade {topoGrade}
          </label>
          <GradeSlider
            {...topoGradeRegister}
            value={[(topoGrade as Grade) || climberAverageGrade]}
            onValueChange={([value]) => {
              setValue(
                'topoGrade',
                convertNumberToGrade(
                  value ?? convertGradeToNumber(climberAverageGrade),
                  // biome-ignore lint/suspicious/noExplicitAny:
                ) as any,
              )

              setValue(
                'personalGrade',
                convertNumberToGrade(
                  value ?? convertGradeToNumber(climberAverageGrade),
                  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                ) as any,
              )
            }}
            min={1}
            max={ROUTE_GRADE_TO_NUMBER.size}
            step={1}
          />
          <label htmlFor="personalGrade" className="">
            Personal Grade{' '}
            {typeof personalGradeOrNumber === 'number'
              ? convertNumberToGrade(personalGradeOrNumber)
              : personalGradeOrNumber}
          </label>
          <GradeSlider
            {...personalGradeRegister}
            value={[(personalGradeOrNumber as Grade) || climberAverageGrade]}
            onValueChange={([value]) =>
              setValue(
                'personalGrade',
                convertNumberToGrade(
                  value ?? convertGradeToNumber(climberAverageGrade),
                  // biome-ignore lint/suspicious/noExplicitAny: needs to be "polymorphic"
                ) as any,
              )
            }
            min={1}
            max={ROUTE_GRADE_TO_NUMBER.size}
            step={1}
          />
        </div>
        <label htmlFor="holds" className="flex-column">
          Holds
          <input
            {...register('holds')}
            type="text"
            id="holds"
            placeholder="Hold types (crimps, jugs, underclings, pockets...)"
            title="Hold type"
          />
        </label>
        <label htmlFor="profile" className="flex-column">
          Profile
          <input
            {...register('profile')}
            type="text"
            id="profile"
            placeholder="Route's profile (vertical, slab, overhang...)"
            title="Profile of the route"
          />
        </label>
        <label htmlFor="height" className="flex-column">
          Height (m)
          <input
            {...register('height')}
            type="number"
            min={MIN_HEIGHT}
            max={MAX_HEIGHT}
            step={5}
            id="height"
            placeholder="Height of the route (not needed for boulders)"
            title="Height of the route (does not apply for boulders)"
          />
        </label>
        <label htmlFor="rating" className="flex-column">
          Rating
          <input
            {...register('rating')}
            min={MIN_RATING}
            max={MAX_RATING}
            step={1}
            type="number"
            id="rating"
            placeholder="5 ⭐️"
            title="Route rating (on a 5 stars system)"
          />
        </label>
        <label htmlFor="comments" className="flex-column">
          Comments
          <textarea
            {...register('comments')}
            id="comments"
            placeholder="Feelings, partners, betas..."
            title="Comments: Feelings, partners, betas..."
            autoComplete="off"
          />
        </label>
        <input type="submit" />
      </form>
    </div>
  )
}
