'use client'

import { useForm, type SubmitHandler } from 'react-hook-form'
import { fromZodError } from 'zod-validation-error'

import {
  ROUTE_GRADE_TO_NUMBER,
  convertGradeToNumber,
  convertNumberToGrade,
  type RouteGrade,
} from '~/helpers/converter'
import { GradeSlider } from '../_components/slider/slider'
import { MAX_HEIGHT, MAX_RATING, MIN_HEIGHT, MIN_RATING } from './constants'
import { ascentFormInputSchema, ascentFormOutputSchema } from './types'
import styles from './page.module.css'

const climberAverageGrade: RouteGrade = '7b' // get this from the api

const onSubmit: SubmitHandler<Record<string, unknown>> = async formData => {
  try {
    console.log({ data: formData })
    const parsedData = ascentFormOutputSchema.parse(formData)
    console.log({ parsedData })

    // send data to the api...
  } catch (error) {
    const zErrors = fromZodError(error as Zod.ZodError)

    zErrors.details.forEach(detail => {
      console.error(detail)
      // TODO transform this log to a toast
      console.error(detail.message)
    })
  }
}

const defaultAscentFormValues = ascentFormInputSchema.parse({
  topoGrade: climberAverageGrade,
  date: new Date(),
  holds: 'Crimp',
  routeOrBoulder: 'Route',
  profile: 'Vertical',
})

export default function Log(): React.JSX.Element {
  const { handleSubmit, register, setValue, watch } = useForm({
    defaultValues: defaultAscentFormValues,
  })

  const { ref: _unusedRef, ...topoGradeRegister } = register('topoGrade')
  const topoGradeValue = watch('topoGrade')
  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${styles.form} flex-column intrinsic-container`}
      >
        <h2
          className=""
          style={{
            maxWidth: '100%',
            textAlign: 'center',
          }}
        >
          Congrats 🎉
        </h2>
        <fieldset
          className={`${styles.fields} intrinsic-container flex-column`}
          id="basics"
        >
          <legend>The Basics</legend>
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
          <label htmlFor="routeName" className="flex-column">
            Route or Boulder
            <select
              id="routeOrBoulder"
              {...register('routeOrBoulder')}
              title="Route or Boulder"
            >
              <option value="Route" defaultChecked>
                Route
              </option>
              <option value="Boulder">Boulder</option>
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
          <label htmlFor="topoGrade" className="">
            Topo Grade {topoGradeValue}
            <GradeSlider
              {...topoGradeRegister}
              defaultValue={[convertGradeToNumber(climberAverageGrade)]}
              onValueChange={([value]) =>
                setValue(
                  'topoGrade',

                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  convertNumberToGrade(
                    value ?? convertGradeToNumber(climberAverageGrade),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ) as any,
                )
              }
              min={1}
              max={ROUTE_GRADE_TO_NUMBER.size}
              step={1}
            />
          </label>
        </fieldset>
        <fieldset
          className={`${styles.fields} intrinsic-container flex-column`}
        >
          <legend>The nitty gritty</legend>
          <label htmlFor="holds" className="flex-column">
            Holds
            <input
              {...register('holds')}
              type="text"
              name="holds"
              id="holds"
              placeholder="Hold types (crimps, jugs, underclings, pockets...)"
              title="Holds"
            />
          </label>
          <label htmlFor="profile" className="flex-column">
            profile
            <input
              {...register('profile')}
              type="text"
              name="profile"
              id="profile"
              placeholder="Route's profile (vertical, slab, overhang...)"
              title="profile"
            />
          </label>
          <label htmlFor="height" className="flex-column">
            Height
            <input
              {...register('height')}
              type="number"
              min={MIN_HEIGHT}
              max={MAX_HEIGHT}
              step={1}
              name="height"
              id="height"
              placeholder="Height of the route (not needed for boulders)"
              title="height"
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
              name="rating"
              id="rating"
              placeholder="5*"
              title="rating"
            />
          </label>
          <label htmlFor="comments" className="flex-column">
            Comments
            <textarea
              {...register('comments')}
              name="comments"
              id="comments"
              placeholder="Feelings, partners, betas..."
              title="comments"
              autoComplete="off"
            />
          </label>
        </fieldset>
        <input type="submit" />
      </form>
    </div>
  )
}
