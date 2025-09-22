'use client'

import { useUser } from '@clerk/nextjs'
import { useTransitionRouter } from 'next-view-transitions'
import { type ChangeEventHandler, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { ClimbingStyleToggleGroup } from '~/app/_components/climbing-style-toggle-group/climbing-style-toggle-group.tsx'
import { GradeInput } from '~/app/_components/grade-input/grade-input.tsx'
import { KeycapButton } from '~/app/_components/keycap-button/keycap-button.tsx'
import { Loader } from '~/app/_components/loader/loader.tsx'
import { Spacer } from '~/app/_components/spacer/spacer.tsx'
import { _0To100RegEx } from '~/constants/generic.ts'
import {
  fromDateToStringDate,
  getLastSaturday,
  getLastSunday,
  getYesterday,
} from '~/helpers/date.ts'
import { fromClimbingDisciplineToEmoji } from '~/helpers/formatters.ts'
import {
  fromGradeToNumber,
  fromNumberToGrade,
} from '~/helpers/grade-converter.ts'
import { disjunctiveListFormatter } from '~/helpers/list-formatter.ts'
import {
  type Ascent,
  AVAILABLE_CLIMBING_DISCIPLINE,
  ascentStyleSchema,
  GRADE_TO_NUMBER,
  type Grade,
  HOLDS,
  PROFILES,
} from '~/schema/ascent'
import { api } from '~/trpc/react.tsx'
import { onSubmit } from '../actions.ts'
import {
  _1To5RegEx,
  _1To9999RegEx,
  MAX_HEIGHT,
  MAX_RATING,
  MAX_TRIES,
  MIN_HEIGHT,
  MIN_RATING,
  MIN_TRIES,
} from '../constants.ts'
import { type AscentFormInput, ascentFormInputSchema } from '../types.ts'
import styles from './ascent-form.module.css'
import { DataList } from './data-list'

type HandleGradeChange = (value: number | null, event?: Event) => void

const numberOfGradesBelowMinimum = 6
const numberOfGradesAboveMaximum = 3

const climbingDisciplineFormattedList = disjunctiveListFormatter(
  AVAILABLE_CLIMBING_DISCIPLINE,
)

type AscentFormProps = {
  latestAscent?: Ascent
  minGrade: Grade
  maxGrade: Grade
  areas?: string[]
  crags?: string[]
}

const holdOptions = HOLDS.map(hold => ({ value: hold }))
const profileOptions = PROFILES.map(profile => ({ value: profile }))
export const recentDateOptions = [
  { label: 'Yesterday', value: fromDateToStringDate(getYesterday()) },
  {
    label: 'Last Saturday',
    value: fromDateToStringDate(getLastSaturday()),
  },
  {
    label: 'Last Sunday',
    value: fromDateToStringDate(getLastSunday()),
  },
]

export default function AscentForm(props: AscentFormProps) {
  'use no memo'
  const { latestAscent, maxGrade, minGrade, areas, crags } = props
  const { user, isLoaded: isUserLoaded } = useUser()
  const utils = api.useUtils()

  const router = useTransitionRouter()

  const defaultAscentToParse = {
    area: latestAscent?.area,
    climbingDiscipline: latestAscent?.climbingDiscipline,
    crag: latestAscent?.crag,
    date: new Date(),
    personalGrade: fromGradeToNumber(minGrade),
    routeName: '',
    style: latestAscent?.climbingDiscipline === 'Boulder' ? 'Flash' : 'Onsight',
    topoGrade: fromGradeToNumber(minGrade),
    tries: '1',
  } satisfies AscentFormInput

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
    Math.max(...Object.values(GRADE_TO_NUMBER)),
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

  const cragOptions = crags?.map(crag => ({ value: crag })) ?? []
  const areaOptions = areas?.map(area => ({ value: area })) ?? []
  return user?.fullName === 'Edouard' ? (
    <form
      aria-describedby="form-description"
      autoComplete="off"
      className={styles.form}
      name="ascent-form"
      onSubmit={handleSubmit(
        async data => {
          const promise = onSubmit(data)
          toast.promise(promise, {
            error: 'Submission failed, please try again.',
            pending: 'Submitting...',
            success: `You sent ${data.routeName} (${fromNumberToGrade(data?.topoGrade ?? 1)})`,
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
      )}
      spellCheck={false}
    >
      <div className={styles.field}>
        <label htmlFor="date">Date</label>
        <input
          {...register('date')}
          className={`${styles.input} contrastColor`}
          enterKeyHint="next"
          id="date"
          list="date-list"
          max={fromDateToStringDate(new Date())}
          required
          title="Date"
          type="date"
        />
        <DataList id="date-list" options={recentDateOptions} />
      </div>
      <div className={styles.field}>
        <label htmlFor="routeName">Route Name</label>
        <input
          {...register('routeName')}
          autoCapitalize="on"
          autoComplete="off"
          autoCorrect="off"
          className={`${styles.input} contrastColor`}
          enterKeyHint="next"
          id="routeName"
          placeholder="Biographie, La Dura Dura, etc."
          required
          title="The name of the route or boulder climbed (use `N/A` for routes without name)"
          type="text"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="climbingDiscipline">Climbing Discipline</label>
        <select
          {...register('climbingDiscipline')}
          className={`${styles.input} contrastColor`}
          enterKeyHint="next"
          id="climbingDiscipline"
          title={`The climbing discipline (e.g. ${climbingDisciplineFormattedList})`}
        >
          {AVAILABLE_CLIMBING_DISCIPLINE.map(discipline => (
            <option key={discipline} value={discipline}>
              {`${fromClimbingDisciplineToEmoji(discipline)} ${discipline}`}
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
          className={`${styles.input} contrastColor`}
          enterKeyHint="next"
          id="crag"
          list="crag-list"
          placeholder="Saint-Léger, Fontainebleau, etc."
          required
          title="The name of the crag"
          type="text"
        />
        <DataList id="crag-list" options={cragOptions} />
      </div>
      <div className={styles.field}>
        <label htmlFor="area">Area</label>
        <input
          {...register('area')}
          autoCapitalize="on"
          autoComplete="off"
          className={`${styles.input} contrastColor`}
          enterKeyHint="next"
          id="area"
          list="area-list"
          placeholder="Biographie"
          title="The name of the crag's sector (or area)"
          type="text"
        />
        <DataList id="area-list" options={areaOptions} />
      </div>
      <div className={styles.field}>
        <label className="required" htmlFor="tries">
          Tries & Style
        </label>
        <div className={styles.tries}>
          <input
            {...triesRegister}
            enterKeyHint="next"
            id="tries"
            inputMode="numeric"
            max={MAX_TRIES}
            min={MIN_TRIES}
            onChange={handleTriesChange}
            pattern={_1To9999RegEx.source}
            placeholder="1"
            required
            step={1}
            title="Total number of tries"
            type="number"
          />
          <ClimbingStyleToggleGroup
            display={Number(numberOfTries) === 1}
            isOnsightDisable={isBoulder}
            onValueChange={handleStyleChange}
            value={styleValue}
          />
        </div>
      </div>
      <div className={styles.field}>
        <label className="required" htmlFor="topoGrade">
          Topo Grade
        </label>
        <GradeInput
          {...topoGradeRegister}
          gradeType="Topo"
          max={adjustedMaxGrade}
          min={adjustedMinGrade}
          onValueChange={handleTopoGradeChange}
          required
          step={1}
          value={numberTopoGrade}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="personalGrade">Personal Grade</label>
        <GradeInput
          {...personalGradeRegister}
          gradeType="Personal"
          max={adjustedMaxGrade}
          min={adjustedMinGrade}
          onValueChange={handlePersonalGradeChange}
          step={1}
          value={personalNumberGrade}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="holds">Holds</label>
        <input
          {...register('holds')}
          className={`${styles.input} contrastColor`}
          enterKeyHint="next"
          id="holds"
          list="hold-types"
          placeholder="Crimp"
          title="The main hold type in the route or the holds of the crux section"
          type="text"
        />
        <DataList id="hold-types" options={holdOptions} />
      </div>
      <div className={styles.field}>
        <label htmlFor="profile">Profile</label>
        <input
          {...register('profile')}
          className={`${styles.input} contrastColor`}
          enterKeyHint="next"
          id="profile"
          list="profile-types"
          placeholder="Vertical"
          title={`The main profile of the route or the profile of the crux section (e.g. ${PROFILES.slice(0, 2).join(', ')}, ...)`}
          type="text"
        />
        <DataList id="profile-types" options={profileOptions} />
      </div>
      <div className={styles.field}>
        <label htmlFor="height">Height (m)</label>
        <input
          {...register('height')}
          className={`${styles.input} contrastColor ${isBoulder ? 'notAllowed' : ''}`}
          disabled={isBoulder}
          enterKeyHint="next"
          id="height"
          inputMode="numeric"
          max={MAX_HEIGHT}
          min={MIN_HEIGHT}
          pattern={_0To100RegEx.source}
          placeholder="25"
          step={5}
          title="Height of the route in meters (does not apply for boulders)"
          type="number"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="rating">Rating</label>
        <input
          {...register('rating')}
          className={`${styles.input} contrastColor`}
          enterKeyHint="next"
          id="rating"
          inputMode="numeric"
          max={MAX_RATING}
          min={MIN_RATING}
          pattern={_1To5RegEx.source}
          placeholder={(MAX_RATING - 1).toString()}
          step={1}
          title={`The climb's rating on a ${MAX_RATING} ⭐️ system`}
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
          placeholder="This was my first 9b+. I thought I was going to die at the crux. It's so far! Thank you Sam for the belay and the encouragements. I didn't use the tiny foothold, instead I jump to the jug directly..."
          spellCheck
          title="Feelings, partners, betas..."
        />
      </div>
      <Spacer size={3} />
      <KeycapButton
        className={`contrastColor ${styles.submit}`}
        disabled={isSubmitting}
        label={isSubmitting ? 'Sending...' : 'Send 📮'}
        type="submit"
      />
    </form>
  ) : (
    <section className="flexColumn gap">
      <p>You are not authorized to log an ascent.</p>
    </section>
  )
}
