'use client'

import type React from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import type Zod from 'zod'
import { fromZodError } from 'zod-validation-error'

import { env } from '~/env'
import {
  convertGradeToNumber,
  convertNumberToGrade,
} from '~/helpers/converters'
import { type Grade, _GRADES, holds, profiles } from '~/schema/ascent'

import { GradeSlider } from '../_components/slider/slider.tsx'
import {
  MAX_HEIGHT,
  MAX_RATING,
  MAX_TRIES,
  MIN_HEIGHT,
  MIN_RATING,
  MIN_TRIES,
} from './constants.ts'
import styles from './page.module.css'
import {
  type AscentFormInput,
  _0To5RegEx,
  _0To100RegEx,
  _1To9999RegEx,
  ascentFormInputSchema,
  ascentFormOutputSchema,
} from './types.ts'

const climberAverageGrade: Grade = '7b' // TODO: get this from the api

type GradeSetter = (value: number[]) => void

const onSubmit: SubmitHandler<Record<string, unknown>> = formData => {
  try {
    const _parsedData = ascentFormOutputSchema.parse(formData)
    // biome-ignore lint/suspicious/noConsole: WIP
    // biome-ignore lint/suspicious/noConsoleLog: WIP
    globalThis.console.log(_parsedData)
    // TODO: send data to the api...
    // If the data is sent to my Google Sheet's DB, we need to make some
    // transformations (personalGrade => 'My Grade', department lookup, climber,
    // etc.)
  } catch (error) {
    const zErrors = fromZodError(error as Zod.ZodError)

    for (const _detail of zErrors.details) {
      // biome-ignore lint/suspicious/noConsole: WIP
      globalThis.console.error(_detail)
    }
  }
}

// TODO: get intelligent default values from the API
const isDevelopmentEnv = env.NEXT_PUBLIC_ENV === 'development'

const defaultAscentToParse = {
  routeName: isDevelopmentEnv ? 'This_Is_A_Test_Route_Name' : '',
  crag: isDevelopmentEnv ? 'This_Is_A_Test_Crag' : '',
  topoGrade: climberAverageGrade,
  personalGrade: climberAverageGrade,
  date: new Date(),
  holds: 'Crimp',
  climbingDiscipline: 'Route',
  profile: 'Vertical',
  height: isDevelopmentEnv ? 20 : undefined,
  rating: isDevelopmentEnv ? 1 : undefined,
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

  const handleTopoGradeChange: GradeSetter = ([value]) => {
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
  }
  const updatePersonalGradeChange: GradeSetter = ([value]) =>
    setValue(
      'personalGrade',
      convertNumberToGrade(
        value ?? convertGradeToNumber(climberAverageGrade),
        // biome-ignore lint/suspicious/noExplicitAny: needs to be "polymorphic"
      ) as any,
    )
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Congrats 🎉</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label htmlFor="date" className={styles.label}>
          Date
          <input
            required={true}
            {...register('date')}
            className={styles.input}
            type="date"
            title="Date"
          />
        </label>
        <label htmlFor="routeName" className={styles.label}>
          Route Name
          <input
            required={true}
            type="text"
            className={styles.input}
            id="routeName"
            autoComplete="off"
            {...register('routeName')}
            placeholder="The name of the route or boulder climbed"
            title="Route Name"
          />
        </label>
        <label htmlFor="climbingDiscipline" className={styles.label}>
          Climbing Discipline
          <select
            id="climbingDiscipline"
            className={styles.input}
            {...register('climbingDiscipline')}
            title="Route, Boulder or Multi-Pitch"
          >
            <option value="Route">Route</option>
            <option value="Boulder">Boulder</option>
            <option value="Multi-Pitch">Multi-Pitch</option>
          </select>
        </label>
        <label htmlFor="crag" className={styles.label}>
          Crag
          <input
            required={true}
            id="crag"
            className={styles.input}
            {...register('crag')}
            placeholder="The name of the crag"
            title="Crag Name"
            type="text"
          />
        </label>
        <label htmlFor="area" className={styles.label}>
          Area
          <input
            id="area"
            className={styles.input}
            {...register('area')}
            placeholder="The name of the crag's sector (or area)"
            title="Crag's area"
            type="text"
          />
        </label>
        <label htmlFor="tries" className={styles.label}>
          Tries
          <input
            {...register('tries')}
            min={MIN_TRIES}
            max={MAX_TRIES}
            step={1}
            className={styles.input}
            id="tries"
            placeholder="1"
            title="Number of tries"
            type="number"
            inputMode="numeric"
            pattern={_1To9999RegEx.source}
          />
        </label>
        <div className={styles.grades}>
          <label htmlFor="topoGrade" className={styles.label}>
            Topo Grade {topoGrade}
          </label>
          <GradeSlider
            {...topoGradeRegister}
            value={[(topoGrade as Grade) || climberAverageGrade]}
            onValueChange={handleTopoGradeChange}
            min={1}
            max={_GRADES.length}
            step={1}
          />
          <label htmlFor="personalGrade" className={styles.label}>
            Personal Grade{' '}
            {typeof personalGradeOrNumber === 'number'
              ? convertNumberToGrade(personalGradeOrNumber)
              : personalGradeOrNumber}
          </label>
          <GradeSlider
            {...personalGradeRegister}
            value={[(personalGradeOrNumber as Grade) || climberAverageGrade]}
            onValueChange={updatePersonalGradeChange}
            min={1}
            max={_GRADES.length}
            step={1}
          />
        </div>
        <label htmlFor="holds" className={styles.label}>
          Holds
          <input
            {...register('holds')}
            id="holds"
            className={styles.input}
            placeholder={`Hold types (${holds.slice(0, 3).join(', ')}, ...)`}
            title="Hold type"
            type="text"
            list="hold-types"
          />
        </label>
        <datalist id="hold-types">
          {holds.map(hold => (
            <option key={hold} value={hold} />
          ))}
        </datalist>

        <label htmlFor="profile" className={styles.label}>
          Profile
          <input
            {...register('profile')}
            id="profile"
            className={styles.input}
            placeholder={`Route's profile (${profiles.slice(0, 3).join(', ')}, ...)`}
            title="Profile of the route"
            type="text"
            list="profile-types"
          />
        </label>
        <datalist id="profile-types">
          {profiles.map(profile => (
            <option key={profile} value={profile} />
          ))}
        </datalist>
        <label htmlFor="height" className={styles.label}>
          Height (m)
          <input
            {...register('height')}
            min={MIN_HEIGHT}
            max={MAX_HEIGHT}
            step={5}
            id="height"
            className={styles.input}
            placeholder="Height of the route (not needed for boulders)"
            title="Height of the route (does not apply for boulders)"
            type="number"
            inputMode="numeric"
            pattern={_0To100RegEx.source}
          />
        </label>
        <label htmlFor="rating" className={styles.label}>
          Rating
          <input
            {...register('rating')}
            min={MIN_RATING}
            max={MAX_RATING}
            step={1}
            className={styles.input}
            id="rating"
            placeholder={`${MAX_RATING} ⭐️`}
            title={`Route rating (on a ${MAX_RATING} stars system)`}
            type="number"
            inputMode="numeric"
            pattern={_0To5RegEx.source}
          />
        </label>
        <label htmlFor="comments" className={styles.label}>
          Comments
          <textarea
            {...register('comments')}
            id="comments"
            className={`${styles.input} ${styles.textarea}`}
            placeholder="Feelings, partners, betas..."
            title="Comments: Feelings, partners, betas..."
            autoComplete="off"
          />
        </label>
        <input type="submit" value="Send 📮" />
      </form>
    </div>
  )
}
