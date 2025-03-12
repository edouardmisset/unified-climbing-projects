'use client'

import { type ChangeEventHandler, useCallback } from 'react'
import { useForm } from 'react-hook-form'
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
import { disjunctiveListFormatter } from '~/helpers/list.ts'
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
import styles from '../page.module.css'
import { type AscentFormInput, ascentFormInputSchema } from '../types.ts'

type HandleGradeSliderChange = (
  value: number | number[],
  event: Event,
  activeThumbIndex: number,
) => void

const isDevelopmentEnv = env.NEXT_PUBLIC_ENV === 'development'
const numberOfGrades = _GRADES.length
const numberOfGradesBelowMinimum = 6
const numberOfGradesAboveMaximum = 3

export default function AscentForm() {
  const { data, isLoading: isAverageGradeLoading } =
    api.grades.getAverage.useQuery()
  const averageGrade = fromGradeToNumber(data ?? '7b')

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
    holds: 'Crimp',
    profile: 'Vertical',
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

  const { handleSubmit, register, setValue, watch, reset } = useForm({
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
      // Reset the style value to 'Redpoint' when the number of tries is greater than 1
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

  if (isAverageGradeLoading || isGradesLoading) {
    return <Loader />
  }

  return (
    <form
      aria-describedby="form-description"
      autoComplete="off"
      autoCorrect="off"
      className={styles.form}
      name="ascent-form"
      spellCheck={false}
      onSubmit={handleSubmit(data => {
        onSubmit(data)
        reset()
      }, console.error)}
    >
      <label htmlFor="date" className={styles.label}>
        Date
        <input
          {...register('date')}
          className={styles.input}
          enterKeyHint="next"
          id="date"
          max={new Date().toISOString().split('T')[0]}
          required={true}
          title="Date"
          type="date"
        />
      </label>
      <label htmlFor="routeName" className={styles.label}>
        Route Name
        <input
          {...register('routeName')}
          autoCapitalize="on"
          autoComplete="off"
          className={styles.input}
          id="routeName"
          placeholder="The name of the route or boulder climbed (use `N/A` for routes without name)"
          required={true}
          title="Route Name"
          type="text"
        />
      </label>
      <label htmlFor="climbingDiscipline" className={styles.label}>
        Climbing Discipline
        <select
          {...register('climbingDiscipline')}
          className={styles.input}
          id="climbingDiscipline"
          title={climbingDisciplineFormattedList}
        >
          {AVAILABLE_CLIMBING_DISCIPLINE.map(discipline => (
            <option key={discipline} value={discipline}>
              {discipline}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="crag" className={styles.label}>
        Crag
        <input
          {...register('crag')}
          autoCapitalize="on"
          autoComplete="on"
          className={styles.input}
          enterKeyHint="next"
          id="crag"
          placeholder="The name of the crag"
          required={true}
          title="Crag Name"
          type="text"
        />
      </label>
      <label htmlFor="area" className={styles.label}>
        Area
        <input
          {...register('area')}
          autoComplete="on"
          className={styles.input}
          enterKeyHint="next"
          id="area"
          placeholder="The name of the crag's sector (or area)"
          title="Crag's area"
          type="text"
        />
      </label>
      <label htmlFor="tries" className={styles.label}>
        Tries & Style
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
      </label>
      <div className={styles.grades}>
        <label htmlFor="topoGrade" className={styles.label}>
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
        <label htmlFor="personalGrade" className={styles.label}>
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
      <label htmlFor="holds" className={styles.label}>
        Holds
        <input
          {...register('holds')}
          className={styles.input}
          enterKeyHint="next"
          id="holds"
          list="hold-types"
          placeholder={`Hold types (${HOLDS.slice(0, 3).join(', ')}, ...)`}
          required
          title="The main hold type in the route or in the crux section"
          type="text"
        />
      </label>
      <datalist id="hold-types">
        {HOLDS.map(hold => (
          <option key={hold} value={hold} />
        ))}
      </datalist>
      <label htmlFor="profile" className={styles.label}>
        Profile
        <input
          {...register('profile')}
          className={styles.input}
          enterKeyHint="next"
          id="profile"
          list="profile-types"
          placeholder={`Route's profile (${PROFILES.slice(0, 2).join(', ')}, ...)`}
          required
          title="The main profile of the route or in the crux section"
          type="text"
        />
      </label>
      <datalist id="profile-types">
        {PROFILES.map(profile => (
          <option key={profile} value={profile} />
        ))}
      </datalist>
      <label htmlFor="height" className={styles.label}>
        Height (m)
        <input
          {...register('height')}
          className={styles.input}
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
      </label>
      <label htmlFor="rating" className={styles.label}>
        Rating
        <input
          {...register('rating')}
          className={styles.input}
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
      </label>
      <label htmlFor="comments" className={styles.label}>
        Comments
        <textarea
          {...register('comments')}
          autoComplete="off"
          className={`${styles.input} ${styles.textarea}`}
          enterKeyHint="send"
          id="comments"
          placeholder="Feelings, partners, betas..."
          spellCheck={true}
          title="Feelings, partners, betas..."
        />
      </label>
      <Spacer size={3} />
      <input
        type="submit"
        value="Send 📮"
        className={`contrast-color ${styles.submit}`}
      />
    </form>
  )
}
