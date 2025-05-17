'use client'

import { useUser } from '@clerk/nextjs'
import { type ChangeEventHandler, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { ClimbingStyleToggleGroup } from '~/app/_components/climbing-style-toggle-group/climbing-style-toggle-group.tsx'
import { GradeInput } from '~/app/_components/grade-input/grade-input.tsx'
import { Loader } from '~/app/_components/loader/loader.tsx'
import { Spacer } from '~/app/_components/spacer/spacer.tsx'
import { _0To100RegEx } from '~/constants/generic.ts'
import {
  fromGradeToNumber,
  fromNumberToGrade,
} from '~/helpers/grade-converter.ts'
import { disjunctiveListFormatter } from '~/helpers/list-formatter.ts'
import {
  AVAILABLE_CLIMBING_DISCIPLINE,
  type Ascent,
  type Grade,
  HOLDS,
  PROFILES,
  _GRADES,
  ascentStyleSchema,
} from '~/schema/ascent'
import { onSubmit } from '../actions.ts'
import {
  MAX_HEIGHT,
  MAX_RATING,
  MAX_TRIES,
  MIN_HEIGHT,
  MIN_RATING,
  MIN_TRIES,
  _1To5RegEx,
  _1To9999RegEx,
} from '../constants.ts'
import { type AscentFormInput, ascentFormInputSchema } from '../types.ts'
import styles from './ascent-form.module.css'
import { DataList } from './data-list'

type HandleGradeChange = (value: number | null, event?: Event) => void

const numberOfGrades = _GRADES.length
const numberOfGradesBelowMinimum = 6
const numberOfGradesAboveMaximum = 3

const climbingDisciplineFormattedList = disjunctiveListFormatter(
  AVAILABLE_CLIMBING_DISCIPLINE,
)

export default function AscentForm({
  latestAscent,
  maxGrade,
  minGrade,
  areas,
  crags,
}: {
  latestAscent?: Ascent
  minGrade: Grade
  maxGrade: Grade
  areas?: string[]
  crags?: string[]
}) {
  const { user, isLoaded: isUserLoaded } = useUser()

  const defaultAscentToParse = useMemo(
    () =>
      ({
        date: new Date(),
        routeName: '',
        crag: latestAscent?.crag,
        area: latestAscent?.area,
        topoGrade: fromGradeToNumber(minGrade),
        personalGrade: fromGradeToNumber(minGrade),
        climbingDiscipline: latestAscent?.climbingDiscipline,
        tries: '1',
        style:
          latestAscent?.climbingDiscipline === 'Boulder' ? 'Flash' : 'Onsight',
      }) satisfies AscentFormInput,
    [latestAscent, minGrade],
  )

  const defaultAscentFormValues =
    ascentFormInputSchema.safeParse(defaultAscentToParse)

  if (!defaultAscentFormValues.success) {
    globalThis.console.warn(defaultAscentFormValues.error)
  }

  const defaultAscent = defaultAscentFormValues.data

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: defaultAscent,
  })

  const { ref: _unusedRef, ...topoGradeRegister } = register('topoGrade')
  const { ref: _unusedRef2, ...personalGradeRegister } =
    register('personalGrade')
  const { onChange: handleTriesChangeRegister, ...triesRegister } =
    register('tries')

  const numberTopoGrade = watch('topoGrade') ?? fromGradeToNumber(minGrade)
  const personalNumberGrade = watch('personalGrade') ?? numberTopoGrade
  const numberOfTries = watch('tries') ?? '1'
  const styleValue = watch('style')
  const discipline = watch('climbingDiscipline')
  const isBoulder = discipline === 'Boulder'

  const adjustedMinGrade = Math.max(
    fromGradeToNumber(minGrade) - numberOfGradesBelowMinimum,
    1,
  )
  const adjustedMaxGrade = Math.min(
    fromGradeToNumber(maxGrade) + numberOfGradesAboveMaximum,
    numberOfGrades,
  )

  const handleTopoGradeChange: HandleGradeChange = useCallback(
    value => {
      const val = value ?? fromGradeToNumber(minGrade)
      setValue('topoGrade', val)

      setValue('personalGrade', val)
    },
    [setValue, minGrade],
  )
  const handlePersonalGradeChange: HandleGradeChange = useCallback(
    value => {
      const val = value ?? fromGradeToNumber(minGrade)
      setValue('personalGrade', val)
    },
    [setValue, minGrade],
  )

  const handleStyleChange = useCallback(
    (val: string[]) => {
      const parsedVal = ascentStyleSchema.array().safeParse(val)
      if (!parsedVal.success) return

      const parsedClimbData = parsedVal.data[0]
      if (parsedClimbData === undefined) return

      setValue('style', parsedClimbData)
    },
    [setValue],
  )

  const handleTriesChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    event => {
      // Set the style value to 'Redpoint' when the number of tries is greater than 1
      if (Number(event.target.value) > 1) {
        setValue('style', 'Redpoint')
      }
      // By default set the style value to 'Onsight' when the number of tries is equal to 1
      if (Number(event.target.value) === 1) {
        setValue('style', isBoulder ? 'Flash' : 'Onsight')
      }
      return handleTriesChangeRegister(event)
    },
    [handleTriesChangeRegister, isBoulder, setValue],
  )

  if (!isUserLoaded) {
    return <Loader />
  }

  return user?.fullName === 'Edouard' ? (
    <form
      aria-describedby="form-description"
      autoComplete="off"
      className={styles.form}
      name="ascent-form"
      spellCheck={false}
      onSubmit={handleSubmit(
        async data => {
          const promise = onSubmit(data)
          toast.promise(promise, {
            pending: 'Submitting...',
            success: `Successfully submitted ${data.routeName} (${fromNumberToGrade(data?.topoGrade ?? 1)})`,
            error: 'Submission failed, please try again.',
          })

          if (await promise) reset()
        },
        error => {
          console.error(error)
          if ('message' in error) {
            toast.error(`Error: ${error.message}`)
          } else {
            toast.error('Something went wrong')
          }
        },
      )}
    >
      <div className={styles.field}>
        <label htmlFor="date">Date</label>
        <input
          {...register('date')}
          className={`${styles.input} contrast-color`}
          enterKeyHint="next"
          id="date"
          max={new Date().toISOString().split('T')[0]}
          required={true}
          title="Date"
          type="date"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="routeName">Route Name</label>
        <input
          {...register('routeName')}
          autoCapitalize="on"
          autoComplete="off"
          autoCorrect="off"
          className={`${styles.input} contrast-color`}
          enterKeyHint="next"
          id="routeName"
          placeholder="The name of the route or boulder climbed (use `N/A` for routes without name)"
          required={true}
          title="Route Name"
          type="text"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="climbingDiscipline">Climbing Discipline</label>
        <select
          {...register('climbingDiscipline')}
          className={`${styles.input} contrast-color`}
          enterKeyHint="next"
          id="climbingDiscipline"
          title={climbingDisciplineFormattedList}
        >
          {AVAILABLE_CLIMBING_DISCIPLINE.map(discipline => (
            <option key={discipline} value={discipline}>
              {discipline}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor="crag">Crag</label>
        <input
          {...register('crag')}
          autoCapitalize="on"
          autoComplete="off"
          className={`${styles.input} contrast-color`}
          enterKeyHint="next"
          id="crag"
          placeholder="The name of the crag"
          required={true}
          title="Crag Name"
          type="text"
          list="crag-list"
        />
        <DataList id="crag-list" options={crags ?? []} />
      </div>
      <div className={styles.field}>
        <label htmlFor="area">Area</label>
        <input
          {...register('area')}
          autoCapitalize="on"
          autoComplete="off"
          className={`${styles.input} contrast-color`}
          enterKeyHint="next"
          id="area"
          placeholder="The name of the crag's sector (or area)"
          title="Crag's area"
          type="text"
          list="area-list"
        />
        <DataList id="area-list" options={areas ?? []} />
      </div>
      <div className={styles.field}>
        <label htmlFor="tries" className="required">
          Tries & Style
        </label>
        <div className={styles.tries}>
          <input
            {...triesRegister}
            onChange={handleTriesChange}
            required={true}
            min={MIN_TRIES}
            max={MAX_TRIES}
            step={1}
            id="tries"
            placeholder="1"
            title="Number of tries"
            type="number"
            inputMode="numeric"
            pattern={_1To9999RegEx.source}
            enterKeyHint="next"
          />
          <ClimbingStyleToggleGroup
            display={Number(numberOfTries) === 1}
            onValueChange={handleStyleChange}
            value={styleValue}
            isOnsightDisable={isBoulder}
          />
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="topoGrade" className="required">
          Topo Grade
        </label>
        <GradeInput
          {...topoGradeRegister}
          value={numberTopoGrade}
          onValueChange={handleTopoGradeChange}
          min={adjustedMinGrade}
          max={adjustedMaxGrade}
          step={1}
          required={true}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="personalGrade">Personal Grade</label>
        <GradeInput
          {...personalGradeRegister}
          value={personalNumberGrade}
          onValueChange={handlePersonalGradeChange}
          min={adjustedMinGrade}
          max={adjustedMaxGrade}
          step={1}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="holds">Holds</label>
        <input
          {...register('holds')}
          className={`${styles.input} contrast-color`}
          enterKeyHint="next"
          id="holds"
          list="hold-types"
          placeholder={`Hold types (${HOLDS.slice(0, 3).join(', ')}, ...)`}
          title="The main hold type in the route or in the crux section"
          type="text"
        />
        <DataList id="hold-types" options={HOLDS} />
      </div>
      <div className={styles.field}>
        <label htmlFor="profile">Profile</label>
        <input
          {...register('profile')}
          className={`${styles.input} contrast-color`}
          enterKeyHint="next"
          id="profile"
          list="profile-types"
          placeholder={`Route's profile (${PROFILES.slice(0, 2).join(', ')}, ...)`}
          title="The main profile of the route or in the crux section"
          type="text"
        />
        <DataList id="profile-types" options={PROFILES} />
      </div>
      <div className={styles.field}>
        <label htmlFor="height">Height (m)</label>
        <input
          {...register('height')}
          className={`${styles.input} contrast-color`}
          // TODO: Remove disabled prop - https://axesslab.com/disabled-buttons-suck/
          disabled={isBoulder}
          enterKeyHint="next"
          id="height"
          inputMode="numeric"
          max={MAX_HEIGHT}
          min={MIN_HEIGHT}
          pattern={_0To100RegEx.source}
          placeholder="Height in meters (not needed for boulders)"
          step={5}
          title="Height of the route in meters (does not apply for boulders)"
          style={
            isBoulder
              ? {
                  cursor: 'not-allowed',
                }
              : undefined
          }
          type="number"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="rating">Rating</label>
        <input
          {...register('rating')}
          className={`${styles.input} contrast-color`}
          enterKeyHint="next"
          id="rating"
          inputMode="numeric"
          max={MAX_RATING}
          min={MIN_RATING}
          pattern={_1To5RegEx.source}
          placeholder={`${MAX_RATING - 1} ⭐️`}
          step={1}
          title={`Route / Boulder rating (on a ${MAX_RATING} stars system)`}
          type="number"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="comments">Comments</label>
        <textarea
          {...register('comments')}
          autoComplete="off"
          autoCorrect="on"
          className={`${styles.input} ${styles.textarea}`}
          enterKeyHint="send"
          id="comments"
          placeholder="Feelings, partners, betas..."
          spellCheck={true}
          title="Feelings, partners, betas..."
        />
      </div>
      <Spacer size={3} />
      <button
        type="submit"
        disabled={isSubmitting}
        className={`contrast-color ${styles.submit}`}
      >
        {isSubmitting ? 'Sending...' : 'Send 📮'}
      </button>
    </form>
  ) : (
    <section className="flex-column gap">
      <p>You are not authorized to log an ascent.</p>
    </section>
  )
}
