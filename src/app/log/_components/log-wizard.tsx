'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { flushSync } from 'react-dom'
import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import formStyles from '~/app/_components/forms/form.module.css'
import { KeycapButton } from '~/app/_components/ui/keycap-button/keycap-button'
import { GradeInput } from '~/app/_components/grade-input/grade-input'
import {
  ASCENT_DISCIPLINES,
  ASCENT_HOLDS,
  ASCENT_PROFILES,
  ASCENT_STYLES,
  type AscentRecord,
} from '~/domain/ascent'
import {
  ANATOMICAL_REGIONS,
  ENERGY_SYSTEMS,
  TRAINING_SESSION_TYPES,
} from '~/domain/training-session'
import { fromGradeToNumber, fromNumberToGrade } from '~/helpers/grade-converter'
import { submitClimbingLog } from '../actions'
import {
  createAscentDraft,
  createInitialLogDraft,
  type LogDraft,
  type LogStep,
  LOG_STEP_VALUES,
} from '../draft'
import { Field } from './field'
import styles from './log-wizard.module.css'
import { usePersistedLogDraft } from './use-persisted-log-draft'

type LogWizardProps = {
  areas: string[]
  latestAscent?: AscentRecord
  locations: string[]
}

const STEP_LABELS = {
  ascents: 'Ascents',
  common: 'Common',
  training: 'Training',
} as const satisfies Record<LogStep, string>

export default function LogWizard({ areas, latestAscent, locations }: LogWizardProps) {
  'use no memo'
  const router = useRouter()
  const initialDraft = createInitialLogDraft(latestAscent)
  const [step, setStep] = useQueryState(
    'step',
    parseAsStringLiteral(LOG_STEP_VALUES).withDefault('common').withOptions({ history: 'push' }),
  )
  const [submissionError, setSubmissionError] = useState('')
  const {
    control,
    getValues,
    handleSubmit,
    register,
    reset,
    setValue,
    subscribe,
    formState: { isSubmitting },
  } = useForm<LogDraft>({
    defaultValues: initialDraft,
  })
  const { append, fields, remove, replace } = useFieldArray({ control, name: 'ascents' })
  const { resetDraft } = usePersistedLogDraft({ initialDraft, reset, subscribe })

  const goToStep = (next: LogStep, options?: Parameters<typeof setStep>[1]) => {
    const update = async () => setStep(next, options)
    if (typeof document !== 'undefined' && 'startViewTransition' in document)
      document.startViewTransition(async () => flushSync(update))
    else void update()
  }

  const goToAscents = () => {
    if (fields.length === 0) append(createAscentDraft(getValues('discipline'), latestAscent))
    goToStep('ascents')
  }

  const showAscents = (includeTraining: boolean) => {
    setValue('includeTraining', includeTraining)
    goToAscents()
  }

  const navigateToStep = (target: LogStep) => {
    if (target === 'ascents') {
      goToAscents()
      return
    }
    if (target === 'training') setValue('includeTraining', true)
    goToStep(target)
  }

  const submit = handleSubmit(async draft => {
    setSubmissionError('')
    const result = await submitClimbingLog(draft)
    if (!result.success) {
      setSubmissionError(result.error)
      toast.error(result.error)
      return
    }
    toast.success('Climbing log saved 🎉')

    resetDraft()
    replace([])
    goToStep('common', { history: 'replace' })
    router.refresh()
  })

  const handleReset = () => {
    setSubmissionError('')
    resetDraft()
    replace([])
    goToStep('common', { history: 'replace' })
  }

  return (
    <form
      aria-describedby='form-description'
      autoComplete='off'
      className={`${formStyles.form} ${styles.formPanel}`}
      name='climbing-log-form'
      onSubmit={submit}
      spellCheck={false}
    >
      <ol aria-label='Logging progress' className={styles.progress}>
        {LOG_STEP_VALUES.map((stepValue, index) => (
          <li className={styles.progressItem} key={stepValue}>
            <button
              aria-current={stepValue === step ? 'step' : undefined}
              className={`${styles.stepButton} ${stepValue === step ? styles.activeStep : ''}`}
              onClick={() => {
                navigateToStep(stepValue)
              }}
              type='button'
            >
              {index + 1}. {STEP_LABELS[stepValue]}
            </button>
          </li>
        ))}
      </ol>
      {submissionError && (
        <p aria-live='polite' className={styles.error}>
          {submissionError}
        </p>
      )}

      {step === 'common' && (
        <>
          <div aria-hidden='true' className={formStyles.groupHeader}>
            Common details
          </div>
          <div className={formStyles.row}>
            <Field htmlFor='date' label='Date'>
              <input
                {...register('date')}
                // oxlint-disable-next-line jsx_a11y/no-autofocus
                autoFocus
                className={formStyles.input}
                id='date'
                max={initialDraft.date}
                required
                type='date'
              />
            </Field>
            <Field htmlFor='discipline' label='Default discipline'>
              <select {...register('discipline')} className={formStyles.input} id='discipline'>
                {ASCENT_DISCIPLINES.map(discipline => (
                  <option key={discipline} value={discipline}>
                    {discipline}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field htmlFor='location' label='Location'>
            <input
              {...register('location')}
              className={formStyles.input}
              id='location'
              list='location-list'
              placeholder='Céüse, Arkose, etc.'
              type='text'
            />
            <datalist id='location-list'>
              {locations.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </datalist>
          </Field>
          <div aria-hidden='true' className={styles.divider} />
          <div className={styles.actions}>
            <button
              className={styles.button}
              onClick={() => {
                navigateToStep('training')
              }}
              type='button'
            >
              Training
            </button>
            <button
              className={styles.button}
              onClick={() => {
                showAscents(false)
              }}
              type='button'
            >
              Skip
            </button>
          </div>
        </>
      )}

      {step === 'training' && (
        <>
          <div aria-hidden='true' className={formStyles.groupHeader}>
            Training details
          </div>
          <div className={formStyles.row}>
            <Field htmlFor='training-type' label='Session type'>
              <select
                {...register('training.type')}
                className={formStyles.input}
                id='training-type'
                required
              >
                {TRAINING_SESSION_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>
            <Field htmlFor='anatomical-region' label='Anatomical region'>
              <select
                {...register('training.anatomicalRegion')}
                className={formStyles.input}
                id='anatomical-region'
              >
                <option value=''>—</option>
                {ANATOMICAL_REGIONS.map(region => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className={formStyles.row}>
            <Field htmlFor='energy-system' label='Energy system'>
              <select
                {...register('training.energySystem')}
                className={formStyles.input}
                id='energy-system'
              >
                <option value=''>—</option>
                {ENERGY_SYSTEMS.map(system => (
                  <option key={system} value={system}>
                    {system}
                  </option>
                ))}
              </select>
            </Field>
            <Field htmlFor='intensity' label='Intensity (%)'>
              <input
                {...register('training.intensity')}
                className={formStyles.input}
                id='intensity'
                max={100}
                min={0}
                step={5}
                type='number'
              />
            </Field>
          </div>
          <Field htmlFor='volume' label='Volume (%)'>
            <input
              {...register('training.volume')}
              className={formStyles.input}
              id='volume'
              max={100}
              min={0}
              step={5}
              type='number'
            />
          </Field>
          <Field htmlFor='training-comments' label='Comments'>
            <textarea
              {...register('training.comments')}
              className={`${formStyles.input} ${formStyles.textarea}`}
              id='training-comments'
            />
          </Field>
          <div aria-hidden='true' className={styles.divider} />
          <div className={styles.actions}>
            <button
              className={styles.button}
              onClick={() => {
                goToStep('common')
              }}
              type='button'
            >
              Back
            </button>
            <button
              className={styles.button}
              onClick={() => {
                showAscents(true)
              }}
              type='button'
            >
              Continue
            </button>
            <KeycapButton
              disabled={isSubmitting}
              label={isSubmitting ? 'Submitting...' : 'Submit'}
              type='submit'
            />
          </div>
        </>
      )}

      {step === 'ascents' && (
        <>
          <div aria-hidden='true' className={formStyles.groupHeader}>
            Ascents
          </div>
          <datalist id='area-list'>
            {areas.map(area => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </datalist>
          {fields.map((field, index) => {
            const prefix = `ascents.${index}` as const
            return (
              <section className={styles.ascentCard} key={field.id}>
                <header className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Ascent {index + 1}</h2>
                  {fields.length > 1 && (
                    <button
                      className={styles.removeButton}
                      onClick={() => {
                        remove(index)
                      }}
                      type='button'
                    >
                      Remove
                    </button>
                  )}
                </header>
                <div className={formStyles.row}>
                  <Field htmlFor={`${prefix}.name`} label='Name'>
                    <input
                      {...register(`${prefix}.name`)}
                      className={formStyles.input}
                      id={`${prefix}.name`}
                      required
                      type='text'
                    />
                  </Field>
                  <Field htmlFor={`${prefix}.area`} label='Area'>
                    <input
                      {...register(`${prefix}.area`)}
                      className={formStyles.input}
                      id={`${prefix}.area`}
                      list='area-list'
                      type='text'
                    />
                  </Field>
                </div>
                <div className={styles.gradeFields}>
                  <Field htmlFor={`${prefix}.discipline`} label='Discipline'>
                    <select
                      {...register(`${prefix}.discipline`)}
                      className={formStyles.input}
                      id={`${prefix}.discipline`}
                    >
                      {ASCENT_DISCIPLINES.map(discipline => (
                        <option key={discipline} value={discipline}>
                          {discipline}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Controller
                    control={control}
                    name={`${prefix}.grade`}
                    render={({ field: gradeField }) => (
                      <GradeInput
                        className={formStyles.field}
                        label='Grade'
                        onValueChange={value => {
                          if (value === null) return

                          const grade = fromNumberToGrade(value)
                          gradeField.onChange(grade)
                          setValue(`${prefix}.personalGrade`, grade, {
                            shouldDirty: true,
                            shouldTouch: true,
                          })
                        }}
                        value={fromGradeToNumber(gradeField.value)}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`${prefix}.personalGrade`}
                    render={({ field: personalGradeField }) => (
                      <GradeInput
                        className={formStyles.field}
                        gradeType='Personal'
                        label='Personal grade'
                        onValueChange={value => {
                          personalGradeField.onChange(
                            value === null ? '' : fromNumberToGrade(value),
                          )
                        }}
                        value={
                          personalGradeField.value === ''
                            ? undefined
                            : fromGradeToNumber(personalGradeField.value)
                        }
                      />
                    )}
                  />
                </div>
                <div className={formStyles.row}>
                  <Field htmlFor={`${prefix}.tries`} label='Tries'>
                    <input
                      {...register(`${prefix}.tries`)}
                      className={formStyles.input}
                      id={`${prefix}.tries`}
                      min={1}
                      required
                      type='number'
                    />
                  </Field>
                  <Field htmlFor={`${prefix}.style`} label='Style'>
                    <select
                      {...register(`${prefix}.style`)}
                      className={formStyles.input}
                      id={`${prefix}.style`}
                    >
                      {ASCENT_STYLES.map(style => (
                        <option key={style} value={style}>
                          {style}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className={formStyles.row}>
                  <Field htmlFor={`${prefix}.holds`} label='Holds'>
                    <select
                      {...register(`${prefix}.holds`)}
                      className={formStyles.input}
                      id={`${prefix}.holds`}
                    >
                      <option value=''>—</option>
                      {ASCENT_HOLDS.map(holds => (
                        <option key={holds} value={holds}>
                          {holds}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field htmlFor={`${prefix}.profile`} label='Profile'>
                    <select
                      {...register(`${prefix}.profile`)}
                      className={formStyles.input}
                      id={`${prefix}.profile`}
                    >
                      <option value=''>—</option>
                      {ASCENT_PROFILES.map(profile => (
                        <option key={profile} value={profile}>
                          {profile}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className={formStyles.row}>
                  <Field htmlFor={`${prefix}.height`} label='Height (m)'>
                    <input
                      {...register(`${prefix}.height`)}
                      className={formStyles.input}
                      id={`${prefix}.height`}
                      min={0}
                      type='number'
                    />
                  </Field>
                  <Field htmlFor={`${prefix}.rating`} label='Rating'>
                    <input
                      {...register(`${prefix}.rating`)}
                      className={formStyles.input}
                      id={`${prefix}.rating`}
                      max={5}
                      min={0}
                      type='number'
                    />
                  </Field>
                </div>
                <Field htmlFor={`${prefix}.comments`} label='Comments'>
                  <textarea
                    {...register(`${prefix}.comments`)}
                    className={`${formStyles.input} ${formStyles.textarea}`}
                    id={`${prefix}.comments`}
                  />
                </Field>
              </section>
            )
          })}
          <div aria-hidden='true' className={styles.divider} />
          <div className={styles.actions}>
            <button
              className={styles.button}
              onClick={() => {
                append(createAscentDraft(getValues('discipline'), latestAscent))
              }}
              type='button'
            >
              Add ascent
            </button>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.button}
              onClick={() => {
                goToStep(getValues('includeTraining') ? 'training' : 'common')
              }}
              type='button'
            >
              Back
            </button>
            <KeycapButton
              disabled={isSubmitting}
              label={isSubmitting ? 'Sending...' : 'Send'}
              type='submit'
            />
          </div>
        </>
      )}

      <div className={styles.actions}>
        <button className={styles.button} onClick={handleReset} type='button'>
          Reset
        </button>
      </div>
    </form>
  )
}
