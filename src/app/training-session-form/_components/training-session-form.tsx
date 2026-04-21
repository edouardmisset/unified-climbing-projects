'use client'

import { useUser } from '@clerk/nextjs'
import { stringifyDate } from '@edouardmisset/date/convert-string-date.ts'
import { useTransitionRouter } from 'next-view-transitions'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import styles from '~/shared/components/forms/form.module.css'
import { KeycapButton } from '~/shared/components/ui/keycap-button/keycap-button'
import { Spacer } from '~/shared/components/ui/spacer/spacer.tsx'
import { DataList } from '~/app/ascent-form/_components/data-list'
import { _0To100RegEx } from '~/shared/constants/generic'
import { LINKS } from '~/shared/constants/links'
import { createValueAndLabel } from '~/shared/helpers/create-value-and-label'
import { createRecentDateOptions, fromDateToStringDate } from '~/shared/helpers/date'
import {
  fromAnatomicalRegionToEmoji,
  fromClimbingDisciplineToEmoji,
  fromEnergySystemToEmoji,
} from '~/shared/helpers/formatters'
import { CLIMBING_DISCIPLINE } from '~/ascents/schema'
import {
  ANATOMICAL_REGIONS,
  ENERGY_SYSTEMS,
  fromAnatomicalRegionToLabel,
  fromEnergySystemToLabel,
  fromSessionTypeToLabel,
  SESSION_TYPES,
  type TrainingSessionForm as TrainingSessionFormType,
} from '~/training/schema'
import { onSubmit } from '../actions'
import { MAX_PERCENT, MIN_PERCENT } from '../constants'
import {
  anatomicalRegionFormattedList,
  climbingDisciplineFormattedList,
  energySystemFormattedList,
  sessionTypeFormattedList,
} from './constants'

export default function TrainingSessionForm({ allLocations }: { allLocations: string[] }) {
  'use no memo'
  const { user } = useUser()
  const router = useTransitionRouter()

  const defaultDate = stringifyDate(new Date())

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm<TrainingSessionFormType>({
    defaultValues: {
      date: defaultDate,
    },
  })

  return user?.fullName === 'Edouard' ? (
    <form
      aria-describedby='form-description'
      autoComplete='off'
      className={styles.form}
      name='training-session-form'
      onSubmit={handleSubmit(
        async data => {
          const promise = onSubmit(data)
          await toast.promise(promise, {
            error: 'Failed to submit ❌',
            pending: 'Submitting...',
            success: 'Training session submitted 🎉',
          })
          if (!(await promise)) return

          reset()
          router.refresh()

          if (data.sessionType === 'Out') router.push(LINKS.ascentForm)
        },
        error => {
          console.error(error)
          toast.error('Something went wrong')
        },
      )}
      spellCheck={false}
    >
      <div aria-hidden='true' className={styles.groupHeader}>
        <span />
        Location
        <span />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor='date'>Date</label>
          <input
            {...register('date')}
            // oxlint-disable-next-line jsx_a11y/no-autofocus
            autoFocus
            className={styles.input}
            enterKeyHint='next'
            id='date'
            list='date-list'
            max={fromDateToStringDate(new Date())}
            required
            title='Date'
            type='date'
          />
          <DataList id='date-list' options={createRecentDateOptions()} />
        </div>

        <div className={styles.field}>
          <label htmlFor='session-type'>Session Type</label>
          <input
            {...register('sessionType')}
            className={styles.input}
            enterKeyHint='next'
            id='session-type'
            list='session-type-list'
            placeholder='Out'
            title={sessionTypeFormattedList}
            type='text'
          />
          <DataList
            id='session-type-list'
            options={SESSION_TYPES.map(sessionType => ({
              label: fromSessionTypeToLabel(sessionType),
              value: sessionType,
            }))}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor='gymCrag'>Location</label>
          <input
            {...register('gymCrag')}
            className={styles.input}
            enterKeyHint='next'
            id='gymCrag'
            list='gym-crag-list'
            placeholder='Ceüse'
            title='The name of the gym or crag'
            type='text'
          />
          <DataList id='gym-crag-list' options={createValueAndLabel(allLocations)} />
        </div>

        <div className={styles.field}>
          <label htmlFor='climbing-discipline'>Climbing Discipline</label>
          <input
            {...register('climbingDiscipline')}
            className={styles.input}
            enterKeyHint='next'
            id='climbing-discipline'
            list='climbing-discipline-list'
            placeholder='Route'
            title={`The climbing discipline of the session (e.g. ${climbingDisciplineFormattedList})`}
            type='text'
          />
          <DataList
            id='climbing-discipline-list'
            options={CLIMBING_DISCIPLINE.map(discipline => ({
              label: `${fromClimbingDisciplineToEmoji(discipline)} ${discipline}`,
              value: discipline,
            }))}
          />
        </div>
      </div>

      <div aria-hidden='true' className={styles.groupHeader}>
        <span />
        Focus
        <span />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor='anatomical-region'>Anatomical Region</label>
          <input
            {...register('anatomicalRegion')}
            className={styles.input}
            enterKeyHint='next'
            id='anatomical-region'
            list='anatomical-region-list'
            placeholder='Fi'
            title={`The anatomical region targeted during the training session (e.g. ${anatomicalRegionFormattedList})`}
            type='text'
          />
          <DataList
            id='anatomical-region-list'
            options={ANATOMICAL_REGIONS.map(region => ({
              label: `${fromAnatomicalRegionToEmoji(region)} ${fromAnatomicalRegionToLabel(region)}`,
              value: region,
            }))}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor='energy-system'>Energy System</label>
          <input
            {...register('energySystem')}
            className={styles.input}
            enterKeyHint='next'
            id='energy-system'
            list='energy-system-list'
            placeholder='AL'
            title={`The energy system targeted during the training session (e.g. ${energySystemFormattedList})`}
            type='text'
          />
          <DataList
            id='energy-system-list'
            options={ENERGY_SYSTEMS.map(system => ({
              label: `${fromEnergySystemToEmoji(system)} ${fromEnergySystemToLabel(system)}`,
              value: system,
            }))}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor='intensity'>Intensity (%)</label>
          <input
            {...register('intensity')}
            className={styles.input}
            enterKeyHint='next'
            id='intensity'
            inputMode='numeric'
            max={MAX_PERCENT}
            min={MIN_PERCENT}
            pattern={_0To100RegEx.source}
            placeholder='50'
            step={5}
            title='The perceived intensity of the session (0 - 100%)'
            type='number'
          />
        </div>

        <div className={styles.field}>
          <label htmlFor='volume'>Volume (%)</label>
          <input
            {...register('volume')}
            className={styles.input}
            enterKeyHint='next'
            id='volume'
            inputMode='numeric'
            max={MAX_PERCENT}
            min={MIN_PERCENT}
            pattern={_0To100RegEx.source}
            placeholder='80'
            step={5}
            title='The perceived volume of the session (0 - 100%)'
            type='number'
          />
        </div>
      </div>

      <div aria-hidden='true' className={styles.groupHeader}>
        <span />
        Wrap Up
        <span />
      </div>

      <div className={styles.field}>
        <label htmlFor='comments'>Comments</label>
        <textarea
          {...register('comments')}
          autoComplete='off'
          autoCorrect='on'
          className={`${styles.input} ${styles.textarea}`}
          enterKeyHint='send'
          id='comments'
          placeholder='Felt great, but need to work on my footwork'
          spellCheck
          title='Comments about the training session'
        />
      </div>

      <Spacer size={3} />
      <div className={styles.footer}>
        <KeycapButton
          disabled={isSubmitting}
          label={isSubmitting ? 'Submitting...' : 'Submit 📮'}
          type='submit'
        />
      </div>
    </form>
  ) : (
    <section className='flexColumn gap'>
      <p>You are not authorized to log a training session.</p>
    </section>
  )
}
