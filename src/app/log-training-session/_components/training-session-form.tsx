'use client'

import { useUser } from '@clerk/nextjs'
import { stringifyDate } from '@edouardmisset/date/convert-string-date.ts'
import { useTransitionRouter } from 'next-view-transitions'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Spacer } from '~/app/_components/spacer/spacer.tsx'
import { recentDateOptions } from '~/app/log-ascent/_components/ascent-form'
import styles from '~/app/log-ascent/_components/ascent-form.module.css'
import { DataList } from '~/app/log-ascent/_components/data-list'
import { _0To100RegEx } from '~/constants/generic'
import { fromDateToStringDate } from '~/helpers/date'
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
  fromAnatomicalRegionToLabel,
  fromEnergySystemToLabel,
  fromSessionTypeToLabel,
  SESSION_TYPES,
  type TrainingSession,
  trainingSessionSchema,
} from '~/schema/training'
import { api } from '~/trpc/react'
import { onSubmit } from '../actions'
import { MAX_PERCENT, MIN_PERCENT } from '../constants'

const climbingDisciplineFormattedList = disjunctiveListFormatter(
  AVAILABLE_CLIMBING_DISCIPLINE,
)
const anatomicalRegionFormattedList = getFormattedList(
  ANATOMICAL_REGIONS,
  fromAnatomicalRegionToLabel,
)
const energySystemFormattedList = getFormattedList(
  ENERGY_SYSTEMS,
  fromEnergySystemToLabel,
)
const sessionTypeFormattedList = getFormattedList(
  SESSION_TYPES,
  fromSessionTypeToLabel,
)

function getFormattedList<T extends string>(
  list: readonly T[],
  transform: (item: T) => string,
) {
  return disjunctiveListFormatter(list.map(transform))
}

export default function TrainingSessionForm({
  allLocations,
}: {
  allLocations: string[]
}) {
  const { user } = useUser()
  const router = useTransitionRouter()
  const utils = api.useUtils()

  const result = trainingSessionSchema
    .omit({ id: true, load: true })
    .safeParse({
      date: stringifyDate(new Date()),
    } satisfies Omit<TrainingSession, 'id'>)

  if (!result.success) {
    globalThis.console.log(result.error)
  }

  const { data: defaultTrainingSession } = result

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: defaultTrainingSession,
  })

  return user?.fullName === 'Edouard' ? (
    <form
      aria-describedby="form-description"
      autoComplete="off"
      className={styles.form}
      name="training-session-form"
      onSubmit={handleSubmit(
        async data => {
          const promise = onSubmit(data)
          toast.promise(promise, {
            error: 'Failed to submit ❌',
            pending: 'Submitting...',
            success: 'Training session submitted 🎉',
          })
          if (!(await promise)) return

          await utils.training.invalidate()
          router.push('/log-ascent')
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
          className={styles.input}
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
        <label htmlFor="session-type">Session Type</label>
        <input
          {...register('sessionType')}
          className={styles.input}
          enterKeyHint="next"
          id="session-type"
          list="session-type-list"
          placeholder="Out"
          title={sessionTypeFormattedList}
          type="text"
        />
        <DataList
          id="session-type-list"
          options={SESSION_TYPES.map(sessionType => ({
            label: fromSessionTypeToLabel(sessionType),
            value: sessionType,
          }))}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="gymCrag">Location</label>
        <input
          {...register('gymCrag')}
          className={styles.input}
          enterKeyHint="next"
          id="gymCrag"
          list="gym-crag-list"
          placeholder="Ceüse"
          title="The name of the gym or crag"
          type="text"
        />
        <DataList
          id="gym-crag-list"
          options={
            allLocations.map(location => ({
              value: location,
            })) ?? []
          }
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="climbing-discipline">Climbing Discipline</label>
        <input
          {...register('climbingDiscipline')}
          className={styles.input}
          enterKeyHint="next"
          id="climbing-discipline"
          list="climbing-discipline-list"
          placeholder="Route"
          title={`The climbing discipline of the session (e.g. ${climbingDisciplineFormattedList})`}
        />
        <DataList
          id="climbing-discipline-list"
          options={CLIMBING_DISCIPLINE.map(discipline => ({
            label: `${fromClimbingDisciplineToEmoji(discipline)} ${discipline}`,
            value: discipline,
          }))}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="anatomical-region">Anatomical Region</label>
        <input
          {...register('anatomicalRegion')}
          className={styles.input}
          enterKeyHint="next"
          id="anatomical-region"
          list="anatomical-region-list"
          placeholder="Fi"
          title={`The anatomical region targeted during the training session (e.g. ${anatomicalRegionFormattedList})`}
        />
        <DataList
          id="anatomical-region-list"
          options={ANATOMICAL_REGIONS.map(region => ({
            label: `${fromAnatomicalRegionToEmoji(region)} ${fromAnatomicalRegionToLabel(region)}`,
            value: region,
          }))}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="energy-system">Energy System</label>
        <input
          {...register('energySystem')}
          className={styles.input}
          enterKeyHint="next"
          id="energy-system"
          list="energy-system-list"
          placeholder="AL"
          title={`The energy system targeted during the training session (e.g. ${energySystemFormattedList})`}
          type="text"
        />
        <DataList
          id="energy-system-list"
          options={ENERGY_SYSTEMS.map(system => ({
            label: `${fromEnergySystemToEmoji(system)} ${fromEnergySystemToLabel(system)}`,
            value: system,
          }))}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="intensity">Intensity (%)</label>
        <input
          {...register('intensity', { valueAsNumber: true })}
          className={styles.input}
          enterKeyHint="next"
          id="intensity"
          inputMode="numeric"
          max={MAX_PERCENT}
          min={MIN_PERCENT}
          pattern={_0To100RegEx.source}
          placeholder="50"
          step={5}
          title="The perceived intensity of the session (0 - 100%)"
          type="number"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="volume">Volume (%)</label>
        <input
          {...register('volume', { valueAsNumber: true })}
          className={styles.input}
          enterKeyHint="next"
          id="volume"
          inputMode="numeric"
          max={MAX_PERCENT}
          min={MIN_PERCENT}
          pattern={_0To100RegEx.source}
          placeholder="80"
          step={5}
          title="The perceived volume of the session (0 - 100%)"
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
          placeholder="Felt great, but need to work on my footwork"
          spellCheck
          title="Comments about the training session"
        />
      </div>
      <Spacer size={3} />
      <button
        className={`contrastColor ${styles.submit}`}
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Submitting...' : 'Submit 📮'}
      </button>
    </form>
  ) : (
    <section className="flexColumn gap">
      <p>You are not authorized to log an ascent.</p>
    </section>
  )
}
