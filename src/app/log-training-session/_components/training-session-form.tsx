'use client'

import { stringifyDate } from '@edouardmisset/date/convert-string-date.ts'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Loader } from '~/app/_components/loader/loader'
import { Spacer } from '~/app/_components/spacer/spacer.tsx'
import { _0To100RegEx } from '~/constants/generic'
import {
  fromAnatomicalRegionToEmoji,
  fromClimbingDisciplineToEmoji,
  fromEnergySystemToEmoji,
} from '~/helpers/formatters'
import { disjunctiveListFormatter } from '~/helpers/list-formatter'
import {
  AVAILABLE_CLIMBING_DISCIPLINE,
  CLIMBING_DISCIPLINE,
} from '~/schema/ascent'
import {
  ANATOMICAL_REGIONS,
  ENERGY_SYSTEMS,
  SESSION_TYPES,
  type TrainingSession,
  fromAnatomicalRegionToLabel,
  fromEnergySystemToLabel,
  fromSessionTypeToLabel,
  trainingSessionSchema,
} from '~/schema/training'
import { api } from '~/trpc/react'
import { onSubmit } from '../actions'
import { MAX_PERCENT, MIN_PERCENT } from '../constants'

import styles from '~/app/log-ascent/_components/ascent-form.module.css'

export default function TrainingSessionForm() {
  const result = trainingSessionSchema
    .omit({ id: true, load: true })
    .safeParse({
      date: stringifyDate(new Date()),
    } satisfies Omit<TrainingSession, 'id'>)

  if (!result.success) {
    globalThis.console.log(result.error)
  }

  const { data: allGymsOrCrags, isLoading: isLoadingGymsOrCrags } =
    api.training.getAllTrainingGymOrCrag.useQuery()

  const { data: defaultTrainingSession } = result

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: defaultTrainingSession,
  })

  const climbingDisciplineFormattedList = disjunctiveListFormatter(
    AVAILABLE_CLIMBING_DISCIPLINE,
  )
  const anatomicalRegionFormattedList =
    disjunctiveListFormatter(ANATOMICAL_REGIONS)
  const energySystemFormattedList = disjunctiveListFormatter(ENERGY_SYSTEMS)
  const sessionTypeFormattedList = disjunctiveListFormatter(SESSION_TYPES)

  if (isLoadingGymsOrCrags) return <Loader />

  return (
    <form
      aria-describedby="form-description"
      autoComplete="off"
      className={styles.form}
      name="training-session-form"
      spellCheck={false}
      onSubmit={handleSubmit(
        async data => {
          const promise = onSubmit(data)
          toast.promise(promise, {
            pending: 'Sending...',
            success: 'Training session successfully sent 🎉',
            error: '❌ Failed to send',
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
          className={styles.input}
          enterKeyHint="next"
          id="date"
          max={new Date().toISOString().split('T')[0]}
          required={true}
          title="Date"
          type="date"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="session-type">Session Type</label>
        <input
          {...register('sessionType')}
          className={styles.input}
          enterKeyHint="next"
          type="text"
          id="session-type"
          list="session-type-list"
          title={sessionTypeFormattedList}
        />
        <datalist id="session-type-list">
          {SESSION_TYPES.map(sessionType => (
            <option key={sessionType} value={sessionType}>
              {fromSessionTypeToLabel(sessionType)}
            </option>
          ))}
        </datalist>
      </div>
      <div className={styles.field}>
        <label htmlFor="gymCrag">Gym / Crag</label>
        <input
          {...register('gymCrag')}
          className={styles.input}
          enterKeyHint="next"
          id="gymCrag"
          placeholder="Gym or Crag name"
          title="Gym or Crag name"
          type="text"
          list="gym-crag-list"
        />
      </div>
      <datalist id="gym-crag-list">
        {allGymsOrCrags?.map(gymOrCrag => (
          <option key={gymOrCrag} value={gymOrCrag}>
            {gymOrCrag}
          </option>
        ))}
      </datalist>
      <div className={styles.field}>
        <label htmlFor="climbing-discipline">Climbing Discipline</label>
        <input
          {...register('climbingDiscipline')}
          className={styles.input}
          enterKeyHint="next"
          id="climbing-discipline"
          list="climbing-discipline-list"
          title={climbingDisciplineFormattedList}
        />
        <datalist id="climbing-discipline-list">
          {CLIMBING_DISCIPLINE.map(discipline => (
            <option key={discipline} value={discipline}>
              {`${fromClimbingDisciplineToEmoji(discipline)} ${discipline}`}
            </option>
          ))}
        </datalist>
      </div>
      <div className={styles.field}>
        <label htmlFor="anatomical-region">Anatomical Region</label>
        <input
          {...register('anatomicalRegion')}
          className={styles.input}
          id="anatomical-region"
          enterKeyHint="next"
          list="anatomical-region-list"
          title={anatomicalRegionFormattedList}
        />
        <datalist id="anatomical-region-list">
          {ANATOMICAL_REGIONS.map(region => (
            <option key={region} value={region}>
              {`${fromAnatomicalRegionToEmoji(region)} ${fromAnatomicalRegionToLabel(region)}`}
            </option>
          ))}
        </datalist>
      </div>
      <div className={styles.field}>
        <label htmlFor="energy-system">Energy System</label>
        <input
          {...register('energySystem')}
          className={styles.input}
          id="energy-system"
          enterKeyHint="next"
          list="energy-system-list"
          title={energySystemFormattedList}
          type="text"
        />
        <datalist id="energy-system-list">
          {ENERGY_SYSTEMS.map(system => (
            <option key={system} value={system}>
              {`${fromEnergySystemToEmoji(system)} ${fromEnergySystemToLabel(system)}`}
            </option>
          ))}
        </datalist>
      </div>
      <div className={styles.field}>
        <label htmlFor="intensity">Intensity (%)</label>
        <input
          {...register('intensity', { valueAsNumber: true })}
          className={styles.input}
          enterKeyHint="next"
          id="intensity"
          placeholder="50%"
          title="The perceived intensity of the session (0 - 100)"
          type="number"
          inputMode="numeric"
          max={MAX_PERCENT}
          min={MIN_PERCENT}
          step={5}
          pattern={_0To100RegEx.source}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="volume">Volume (%)</label>
        <input
          {...register('volume', { valueAsNumber: true })}
          className={styles.input}
          enterKeyHint="next"
          id="volume"
          placeholder="50%"
          title="The perceived volume of the session (0 - 100)"
          type="number"
          inputMode="numeric"
          max={MAX_PERCENT}
          min={MIN_PERCENT}
          step={5}
          pattern={_0To100RegEx.source}
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
          placeholder="Comments about the training session"
          spellCheck={true}
          title="Comments"
        />
      </div>
      <Spacer size={3} />
      <button
        type="submit"
        disabled={isSubmitting}
        className={`contrast-color ${styles.submit}`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit 📮'}
      </button>
    </form>
  )
}
