'use client'

import { useRouter } from 'next/navigation'
import { Activity, useState } from 'react'
import { flushSync } from 'react-dom'
import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { type FieldPath, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import formStyles from '~/app/_components/forms/form.module.css'
import { Dialog } from '~/app/_components/ui/dialog/dialog'
import { submitClimbingLog } from '../actions'
import { createInitialLogDraft, type LogDraft, type LogStep, LOG_STEP_VALUES } from '../draft'
import {
  inferEnergySystem,
  inferLogContents,
  inferSessionType,
  type LogWizardBootstrap,
} from '../log-defaults'
import { AscentsStep } from './ascents-step'
import { GeneralStep } from './general-step'
import styles from './log-wizard.module.css'
import { TrainingStep } from './training-step'
import { usePersistedLogDraft } from './use-persisted-log-draft'
import { WizardHeader } from './wizard-header'

type LogWizardProps = {
  bootstrap: LogWizardBootstrap
  defaultScope?: 'ascents' | 'training' | 'both'
}

export default function LogWizard({ bootstrap, defaultScope }: LogWizardProps) {
  'use no memo'
  const router = useRouter()
  const defaultDiscipline = bootstrap.latestAscent?.discipline ?? 'Sport'
  const defaultLocation = bootstrap.latestLocation ?? bootstrap.latestAscent?.crag ?? ''
  const inferredContents = inferLogContents(
    defaultLocation,
    bootstrap.indoorLocations,
    bootstrap.outdoorLocations,
  )
  const initialDraft = createInitialLogDraft({
    defaultGrade: bootstrap.defaultGrade,
    defaultHasAscent: inferredContents.hasAscents,
    defaultHasTraining: inferredContents.hasTraining,
    defaultLocation,
    defaultScope,
    defaultTrainingEnergySystem: inferEnergySystem(defaultDiscipline),
    defaultTrainingType:
      inferSessionType(defaultLocation, bootstrap.crags, bootstrap.previousSessionTypes) ??
      'Outdoor',
    historyDefaults: bootstrap.latestAscent,
  })
  const methods = useForm<LogDraft>({ defaultValues: initialDraft })
  const {
    formState: { isDirty },
    handleSubmit,
    reset,
    setError,
    subscribe,
  } = methods
  const [step, setStep] = useQueryState(
    'step',
    parseAsStringLiteral(LOG_STEP_VALUES).withDefault('general').withOptions({ history: 'push' }),
  )
  const [submissionError, setSubmissionError] = useState('')
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const { resetDraft } = usePersistedLogDraft({ initialDraft, reset, subscribe })

  const goToStep = (next: LogStep, options?: Parameters<typeof setStep>[1]) => {
    const update = () => {
      void setStep(next, options)
    }
    if (typeof document !== 'undefined' && 'startViewTransition' in document)
      document.startViewTransition(() => {
        flushSync(update)
      })
    else update()
  }

  const submit = handleSubmit(async draft => {
    setSubmissionError('')
    const result = await submitClimbingLog(draft)
    if (!result.success) {
      setSubmissionError(result.error)
      if (result.field !== undefined && result.field !== '') {
        setError(result.field as FieldPath<LogDraft>, { message: result.error, type: 'server' })
        if (result.field.startsWith('training.')) goToStep('training')
        else if (result.field.startsWith('ascents')) goToStep('ascents')
        else goToStep('general')
      }
      toast.error(result.error)
      return
    }

    toast.success('Climbing log saved 🎉')
    resetDraft()
    goToStep('general', { history: 'replace' })
    router.refresh()
  })

  const handleReset = () => {
    setSubmissionError('')
    resetDraft()
    goToStep('general', { history: 'replace' })
  }

  const requestReset = () => {
    if (isDirty) setIsResetDialogOpen(true)
    else handleReset()
  }

  return (
    <FormProvider {...methods}>
      <form
        aria-describedby='form-description'
        autoComplete='off'
        className={formStyles.form}
        name='climbing-log-form'
        onSubmit={event => {
          void submit(event)
        }}
        spellCheck={false}
      >
        <WizardHeader activeStep={step} onDiscard={requestReset} onNavigate={goToStep} />
        <Dialog
          content={
            <div className={styles.resetDialogContent}>
              <p>Discard all unsaved changes to this log?</p>
              <div className={styles.resetDialogActions}>
                <button
                  onClick={() => {
                    setIsResetDialogOpen(false)
                  }}
                  type='button'
                >
                  Keep editing
                </button>
                <button
                  className={styles.dangerButton}
                  onClick={() => {
                    setIsResetDialogOpen(false)
                    handleReset()
                  }}
                  type='button'
                >
                  Discard
                </button>
              </div>
            </div>
          }
          onOpenChange={setIsResetDialogOpen}
          open={isResetDialogOpen}
          title='Discard draft?'
        />
        {submissionError ? (
          <p aria-live='polite' className={styles.error}>
            {submissionError}
          </p>
        ) : undefined}
        <div className={styles.stepContent}>
          <Activity mode={step === 'general' ? 'visible' : 'hidden'}>
            <GeneralStep
              bootstrap={bootstrap}
              isActive={step === 'general'}
              maximumDate={initialDraft.date}
            />
          </Activity>
          <Activity mode={step === 'training' ? 'visible' : 'hidden'}>
            <TrainingStep isActive={step === 'training'} />
          </Activity>
          <AscentsStep bootstrap={bootstrap} isActive={step === 'ascents'} />
        </div>
      </form>
    </FormProvider>
  )
}
