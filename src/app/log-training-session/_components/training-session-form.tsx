'use client'

import { useUser } from '@clerk/nextjs'
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

import { useRouter } from 'next/navigation'
import { recentDateOptions } from '~/app/log-ascent/_components/ascent-form'
import styles from '~/app/log-ascent/_components/ascent-form.module.css'
import { DataList } from '~/app/log-ascent/_components/data-list'
import { fromDateToStringDate } from '~/helpers/date'

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

export default function TrainingSessionForm() {
  const { user } = useUser()
  const router = useRouter()

  const result = trainingSessionSchema
    .omit({ id: true, load: true })
    .safeParse({
      date: stringifyDate(new Date()),
    } satisfies Omit<TrainingSession, 'id'>)

  if (!result.success) {
    globalThis.console.log(result.error)
  }

  const { data: allGymsOrCrags, isLoading: isLoadingGymsOrCrags } =
    api.training.getAllLocations.useQuery()

  const { data: defaultTrainingSession } = result

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: defaultTrainingSession,
  })

  if (isLoadingGymsOrCrags) return <Loader />

  return user?.fullName === 'Edouard' ? (
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
            pending: 'Submitting...',
            success: 'Training session submitted 🎉',
            error: 'Failed to submit ❌',
          })
          if (await promise) {
            router.push('/log-ascent')
          }
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
          max={fromDateToStringDate(new Date())}
          required={true}
          title="Date"
          type="date"
          list="date-list"
        />
        <DataList id="date-list" options={recentDateOptions} />
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
          placeholder="Out"
          title={sessionTypeFormattedList}
        />
        <DataList
          id="session-type-list"
          options={SESSION_TYPES.map(sessionType => ({
            value: sessionType,
            label: fromSessionTypeToLabel(sessionType),
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
          placeholder="Ceüse"
          title="The name of the gym or crag"
          type="text"
          list="gym-crag-list"
        />
        <DataList
          id="gym-crag-list"
          options={
            allGymsOrCrags?.map(gymOrCrag => ({
              value: gymOrCrag,
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
            value: discipline,
            label: `${fromClimbingDisciplineToEmoji(discipline)} ${discipline}`,
          }))}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="anatomical-region">Anatomical Region</label>
        <input
          {...register('anatomicalRegion')}
          className={styles.input}
          id="anatomical-region"
          enterKeyHint="next"
          list="anatomical-region-list"
          placeholder="Fi"
          title={`The anatomical region targeted during the training session (e.g. ${anatomicalRegionFormattedList})`}
        />
        <DataList
          id="anatomical-region-list"
          options={ANATOMICAL_REGIONS.map(region => ({
            value: region,
            label: `${fromAnatomicalRegionToEmoji(region)} ${fromAnatomicalRegionToLabel(region)}`,
          }))}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="energy-system">Energy System</label>
        <input
          {...register('energySystem')}
          className={styles.input}
          id="energy-system"
          enterKeyHint="next"
          list="energy-system-list"
          placeholder="AL"
          title={`The energy system targeted during the training session (e.g. ${energySystemFormattedList})`}
          type="text"
        />
        <DataList
          id="energy-system-list"
          options={ENERGY_SYSTEMS.map(system => ({
            value: system,
            label: `${fromEnergySystemToEmoji(system)} ${fromEnergySystemToLabel(system)}`,
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
          placeholder="50"
          title="The perceived intensity of the session (0 - 100%)"
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
          placeholder="80"
          title="The perceived volume of the session (0 - 100%)"
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
          placeholder="Felt great, but need to work on my footwork"
          spellCheck={true}
          title="Comments about the training session"
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
  ) : (
    <section className="flex-column gap">
      <p>You are not authorized to log an ascent.</p>
    </section>
  )
}
