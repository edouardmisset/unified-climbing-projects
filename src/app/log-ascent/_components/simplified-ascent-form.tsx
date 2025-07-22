'use client'

import { useUser } from '@clerk/nextjs'
import { ClimbingStyleToggleGroup } from '~/app/_components/climbing-style-toggle-group/climbing-style-toggle-group.tsx'
import { GradeInput } from '~/app/_components/grade-input/grade-input.tsx'
import { Loader } from '~/app/_components/loader/loader.tsx'
import { Spacer } from '~/app/_components/spacer/spacer.tsx'
import { _0To100RegEx } from '~/constants/generic.ts'
import { fromDateToStringDate } from '~/helpers/date.ts'
import { fromClimbingDisciplineToEmoji } from '~/helpers/formatters.ts'
import { fromGradeToNumber } from '~/helpers/grade-converter.ts'
import { disjunctiveListFormatter } from '~/helpers/list-formatter.ts'
import {
  type Ascent,
  AVAILABLE_CLIMBING_DISCIPLINE,
  GRADE_TO_NUMBER,
  type Grade,
  HOLDS,
  PROFILES,
} from '~/schema/ascent'
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
import styles from './ascent-form.module.css'
import { DataList } from './data-list'
import {
  buildRecentDateOptions,
  NUMBER_OF_GRADES_ABOVE_MAXIMUM,
  NUMBER_OF_GRADES_BELOW_MINIMUM,
} from './form-constants.ts'
import { SelectField, TextAreaField, TextField } from './form-fields.tsx'
import { useAscentForm } from './use-ascent-form.ts'

const climbingDisciplineFormattedList = disjunctiveListFormatter(
  AVAILABLE_CLIMBING_DISCIPLINE,
)
const MAX_NUMBER_GRADE = Math.max(...Object.values(GRADE_TO_NUMBER))
const MIN_NUMBER_GRADE = Math.min(...Object.values(GRADE_TO_NUMBER))

type SimplifiedAscentFormProps = {
  latestAscent?: Ascent
  minGrade: Grade
  maxGrade: Grade
  areas?: string[]
  crags?: string[]
}

export default function SimplifiedAscentForm(props: SimplifiedAscentFormProps) {
  const { latestAscent, maxGrade, minGrade, areas, crags } = props
  const { user, isLoaded: isUserLoaded } = useUser()

  const {
    form,
    formState,
    handlers: {
      onSubmit,
      onTopoGradeChange,
      onPersonalGradeChange,
      onTriesChange,
      onStyleChange,
    },
  } = useAscentForm({
    latestAscent,
    minGrade,
  })

  const {
    register,
    watch,
    formState: { isSubmitting },
  } = form
  const { numberOfTries, isBoulder } = formState

  // Prepare grade ranges
  const adjustedMinGrade = Math.max(
    fromGradeToNumber(minGrade) - NUMBER_OF_GRADES_BELOW_MINIMUM,
    MIN_NUMBER_GRADE,
  )
  const adjustedMaxGrade = Math.min(
    fromGradeToNumber(maxGrade) + NUMBER_OF_GRADES_ABOVE_MAXIMUM,
    MAX_NUMBER_GRADE,
  )

  // Watch current values for controlled components
  const currentTopoGrade = watch('topoGrade')
  const currentPersonalGrade = watch('personalGrade')
  const currentStyle = watch('style')

  // Prepare options
  const cragOptions = crags?.map(crag => ({ value: crag })) ?? []
  const areaOptions = areas?.map(area => ({ value: area })) ?? []
  const holdOptions = HOLDS.map(hold => ({ value: hold }))
  const profileOptions = PROFILES.map(profile => ({ value: profile }))

  if (!isUserLoaded) return <Loader />

  if (user?.fullName !== 'Edouard') {
    return (
      <section className="flex-column gap">
        <p>You are not authorized to log an ascent.</p>
      </section>
    )
  }

  return (
    <form
      aria-describedby="form-description"
      autoComplete="off"
      className={styles.form}
      name="ascent-form"
      onSubmit={onSubmit}
      spellCheck={false}
    >
      <TextField
        {...register('date')}
        id="date"
        label="Date"
        list="date-list"
        max={fromDateToStringDate(new Date())}
        required
        title="Date"
        type="date"
      />
      <DataList id="date-list" options={buildRecentDateOptions()} />

      <TextField
        {...register('routeName')}
        autoCapitalize="on"
        autoComplete="off"
        autoCorrect="off"
        id="routeName"
        label="Route Name"
        placeholder="Biographie"
        required
        title="The name of the route or boulder climbed (use `N/A` for routes without name)"
      />

      <SelectField
        {...register('climbingDiscipline')}
        id="climbingDiscipline"
        label="Climbing Discipline"
        title={`The climbing discipline (e.g. ${climbingDisciplineFormattedList})`}
      >
        {AVAILABLE_CLIMBING_DISCIPLINE.map(discipline => (
          <option key={discipline} value={discipline}>
            {`${fromClimbingDisciplineToEmoji(discipline)} ${discipline}`}
          </option>
        ))}
      </SelectField>

      <TextField
        {...register('crag')}
        autoCapitalize="on"
        autoComplete="off"
        id="crag"
        label="Crag"
        list="crag-list"
        placeholder="Ceüse"
        required
        title="The name of the crag"
      />
      <DataList id="crag-list" options={cragOptions} />

      <TextField
        {...register('area')}
        autoCapitalize="on"
        autoComplete="off"
        id="area"
        label="Area"
        list="area-list"
        placeholder="Biographie"
        title="The name of the crag's sector (or area)"
      />
      <DataList id="area-list" options={areaOptions} />

      <div className={styles.field}>
        <label className="required" htmlFor="tries">
          Tries & Style
        </label>
        <div className={styles.tries}>
          <input
            {...register('tries', {
              onChange: e => onTriesChange(e.target.value),
            })}
            id="tries"
            inputMode="numeric"
            max={MAX_TRIES}
            min={MIN_TRIES}
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
            onValueChange={values => values[0] && onStyleChange(values[0])}
            value={currentStyle}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className="required" htmlFor="topoGrade">
          Topo Grade
        </label>
        <GradeInput
          gradeType="Topo"
          max={adjustedMaxGrade}
          min={adjustedMinGrade}
          onValueChange={onTopoGradeChange}
          required
          step={1}
          value={currentTopoGrade}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="personalGrade">Personal Grade</label>
        <GradeInput
          gradeType="Personal"
          max={adjustedMaxGrade}
          min={adjustedMinGrade}
          onValueChange={onPersonalGradeChange}
          step={1}
          value={currentPersonalGrade}
        />
      </div>

      <TextField
        {...register('holds')}
        id="holds"
        label="Holds"
        list="hold-types"
        placeholder="Crimp"
        title="The main hold type in the route or the holds of the crux section"
      />
      <DataList id="hold-types" options={holdOptions} />

      <TextField
        {...register('profile')}
        id="profile"
        label="Profile"
        list="profile-types"
        placeholder="Vertical"
        title={`The main profile of the route or the profile of the crux section (e.g. ${PROFILES.slice(0, 2).join(', ')}, ...)`}
      />
      <DataList id="profile-types" options={profileOptions} />

      <TextField
        {...register('height')}
        disabled={isBoulder}
        id="height"
        inputMode="numeric"
        label="Height (m)"
        max={MAX_HEIGHT}
        min={MIN_HEIGHT}
        pattern={_0To100RegEx.source}
        placeholder="25"
        step={5}
        style={isBoulder ? { cursor: 'not-allowed' } : undefined}
        title="Height of the route in meters (does not apply for boulders)"
        type="number"
      />

      <TextField
        {...register('rating')}
        id="rating"
        inputMode="numeric"
        label="Rating"
        max={MAX_RATING}
        min={MIN_RATING}
        pattern={_1To5RegEx.source}
        placeholder={(MAX_RATING - 1).toString()}
        step={1}
        title={`The climb's rating on a ${MAX_RATING} ⭐️ system`}
        type="number"
      />

      <TextAreaField
        {...register('comments')}
        autoComplete="off"
        autoCorrect="on"
        id="comments"
        label="Comments"
        placeholder="This was my first 9b+. I thought I was going to die at the crux. It's so far! Thank you Sam for the belay and the encouragements. I didn't use the tiny foothold, instead I jump to the jug directly..."
        spellCheck
        title="Feelings, partners, betas..."
      />

      <Spacer size={3} />
      <button
        className={`contrast-color ${styles.submit}`}
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Sending...' : 'Send 📮'}
      </button>
    </form>
  )
}
