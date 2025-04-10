'use client'

import { useUser } from '@clerk/nextjs'
import { type ChangeEventHandler, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { ClimbingStyleToggleGroup } from '~/app/_components/climbing-style-toggle-group/climbing-style-toggle-group.tsx'
import { Loader } from '~/app/_components/loader/loader.tsx'
import { GradeSlider } from '~/app/_components/slider/slider'
import { Spacer } from '~/app/_components/spacer/spacer.tsx'
import { _0To100RegEx } from '~/constants/generic.ts'
import { env } from '~/env'
import {
  fromGradeToNumber,
  fromNumberToGrade,
} from '~/helpers/grade-converter.ts'
import { disjunctiveListFormatter } from '~/helpers/list-formatter.ts'
import {
  AVAILABLE_CLIMBING_DISCIPLINE,
  HOLDS,
  PROFILES,
  _GRADES,
  ascentStyleSchema,
} from '~/schema/ascent'
import { api } from '~/trpc/react.tsx'
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

type HandleGradeSliderChange = (
  value: number | readonly number[],
  event: Event,
  activeThumbIndex: number,
) => void

const isDevelopmentEnv = env.NEXT_PUBLIC_ENV === 'development'
const numberOfGrades = _GRADES.length
const numberOfGradesBelowMinimum = 6
const numberOfGradesAboveMaximum = 3

export default function AscentForm() {
  const { user } = useUser()

  const { data: rawAverageGrade, isLoading: isAverageGradeLoading } =
    api.grades.getAverage.useQuery()
  const averageGrade = fromGradeToNumber(rawAverageGrade ?? '7b')

  const { data: allCrags, isLoading: areCragsLoading } =
    api.crags.getAll.useQuery()
  const { data: allAreas, isLoading: areAreasLoading } =
    api.areas.getAll.useQuery()

  const {
    data: [minGrade, maxGrade] = [
      fromNumberToGrade(1),
      fromNumberToGrade(numberOfGrades),
    ],
    isLoading: isGradesLoading,
  } = api.grades.getMinMax.useQuery()

  const defaultAscentToParse = {
    routeName: isDevelopmentEnv ? 'This_Is_A_Test_Route_Name' : '',
    crag: isDevelopmentEnv ? 'This_Is_A_Test_Crag' : '',
    topoGrade: averageGrade,
    personalGrade: averageGrade,
    holds: isDevelopmentEnv ? 'Crimp' : undefined,
    profile: isDevelopmentEnv ? 'Vertical' : undefined,
    date: new Date(),
    climbingDiscipline: 'Route',
    tries: '1',
    style: 'Onsight',
  } satisfies AscentFormInput

  const defaultAscentFormValues =
    ascentFormInputSchema.safeParse(defaultAscentToParse)

  if (!defaultAscentFormValues.success) {
    globalThis.console.log(defaultAscentFormValues.error)
  }

  const { data: defaultAscent } = defaultAscentFormValues

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

  const numberTopoGrade = watch('topoGrade') ?? averageGrade
  const personalNumberGrade = watch('personalGrade') ?? numberTopoGrade
  const numberOfTries = watch('tries') ?? '1'

  const handleTopoGradeChange: HandleGradeSliderChange = useCallback(
    value => {
      const val = (typeof value === 'number' ? value : value[0]) ?? averageGrade
      setValue('topoGrade', val)

      setValue('personalGrade', val)
    },
    [setValue, averageGrade],
  )
  const updatePersonalGradeChange: HandleGradeSliderChange = useCallback(
    value => {
      const val = (typeof value === 'number' ? value : value[0]) ?? averageGrade
      setValue('personalGrade', val)
    },
    [setValue, averageGrade],
  )

  const handleStyleChange = useCallback(
    (val: string[]) => {
      const parsedVal = ascentStyleSchema.array().safeParse(val)
      if (!parsedVal.success) return

      const parsedClimbData = parsedVal.data[0]

      return parsedClimbData === undefined
        ? undefined
        : setValue('style', parsedClimbData)
    },
    [setValue],
  )

  const styleValue = watch('style')
  const isOnsightDisable = watch('climbingDiscipline') === 'Boulder'

  const adjustedMinGrade = Math.max(
    fromGradeToNumber(minGrade) - numberOfGradesBelowMinimum,
    1,
  )
  const adjustedMaxGrade = Math.min(
    fromGradeToNumber(maxGrade) + numberOfGradesAboveMaximum,
    numberOfGrades,
  )
  const handleTriesChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    event => {
      // Set the style value to 'Redpoint' when the number of tries is greater than 1
      if (Number(event.target.value) > 1) {
        setValue('style', 'Redpoint')
      }
      // By default set the style value to 'Onsight' when the number of tries is equal to 1
      if (Number(event.target.value) === 1) {
        if (isOnsightDisable) {
          setValue('style', 'Flash')
        } else {
          setValue('style', 'Onsight')
        }
      }
      return handleTriesChangeRegister(event)
    },
    [handleTriesChangeRegister, isOnsightDisable, setValue],
  )

  const climbingDisciplineFormattedList = disjunctiveListFormatter(
    AVAILABLE_CLIMBING_DISCIPLINE,
  )

  if (
    isAverageGradeLoading ||
    isGradesLoading ||
    areCragsLoading ||
    areAreasLoading
  ) {
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
        <datalist id="crag-list">
          {allCrags?.map(crag => (
            <option key={crag} value={crag}>
              {crag}
            </option>
          ))}
        </datalist>
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
        <datalist id="area-list">
          {allAreas?.map(area => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </datalist>
      </div>
      <div className={styles.field}>
        <label htmlFor="tries">Tries & Style</label>
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
            isOnsightDisable={isOnsightDisable}
          />
        </div>
      </div>
      <div className={styles.grades}>
        <label htmlFor="topoGrade" className={styles.field}>
          <span>
            Topo Grade <strong>{fromNumberToGrade(numberTopoGrade)}</strong>
          </span>
        </label>
        <GradeSlider
          {...topoGradeRegister}
          value={numberTopoGrade}
          onValueChange={handleTopoGradeChange}
          min={adjustedMinGrade}
          max={adjustedMaxGrade}
          step={1}
        />
        <label htmlFor="personalGrade" className={styles.field}>
          <span>
            Personal Grade{' '}
            <strong>{fromNumberToGrade(personalNumberGrade)}</strong>
          </span>
        </label>
        <GradeSlider
          {...personalGradeRegister}
          value={personalNumberGrade}
          onValueChange={updatePersonalGradeChange}
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
        <datalist id="hold-types">
          {HOLDS.map(hold => (
            <option key={hold} value={hold} />
          ))}
        </datalist>
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
        <datalist id="profile-types">
          {PROFILES.map(profile => (
            <option key={profile} value={profile} />
          ))}
        </datalist>
      </div>
      <div className={styles.field}>
        <label htmlFor="height">Height (m)</label>
        <input
          {...register('height')}
          className={`${styles.input} contrast-color`}
          // TODO: Remove disabled prop - https://axesslab.com/disabled-buttons-suck/
          disabled={watch('climbingDiscipline') === 'Boulder'}
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
            watch('climbingDiscipline') === 'Boulder'
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
