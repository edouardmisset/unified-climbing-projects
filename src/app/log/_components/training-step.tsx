import { useFormContext, useWatch } from 'react-hook-form'
import { PlusIcon, XIcon } from 'lucide-react'
import formStyles from '~/app/_components/forms/form.module.css'
import {
  ANATOMICAL_REGIONS,
  ENERGY_SYSTEMS,
  TRAINING_SESSION_TYPES,
} from '~/domain/training-session'
import type { LogDraft } from '../draft'
import { Field } from './field'
import styles from './log-wizard.module.css'
import { SendButton } from './send-button'

export function TrainingStep({ isActive }: { isActive: boolean }) {
  const {
    control,
    formState: { isSubmitting },
    register,
    setValue,
  } = useFormContext<LogDraft>()
  const hasTraining = useWatch({ control, name: 'hasTraining' })
  const ascents = useWatch({ control, name: 'ascents' })

  return (
    <>
      <h2 className={formStyles.groupHeader}>Training details</h2>
      {hasTraining ? (
        <>
          <button
            aria-label='Remove training session'
            className={styles.removeButton}
            onClick={() => {
              setValue('hasTraining', false, { shouldDirty: true })
            }}
            type='button'
          >
            <XIcon aria-hidden='true' size={18} />
          </button>
          <Field htmlFor='training-type' label='Session type' required={isActive}>
            <select
              {...register('training.type')}
              className={formStyles.input}
              id='training-type'
              required={isActive}
            >
              {TRAINING_SESSION_TYPES.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>
          <div className={formStyles.row}>
            <Field htmlFor='intensity' label='Intensity (%)'>
              <input
                {...register('training.intensity')}
                className={formStyles.input}
                id='intensity'
                max={100}
                min={0}
                step={5}
                type='number'
                inputMode='numeric'
              />
            </Field>
            <Field htmlFor='volume' label='Volume (%)'>
              <input
                {...register('training.volume')}
                className={formStyles.input}
                id='volume'
                max={100}
                min={0}
                step={5}
                type='number'
                inputMode='numeric'
              />
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
          <Field clearName='training.comments' htmlFor='training-comments' label='Comments'>
            <textarea
              {...register('training.comments')}
              className={`${formStyles.input} ${formStyles.textarea}`}
              id='training-comments'
            />
          </Field>
        </>
      ) : (
        <button
          aria-label='Add training session'
          className={styles.addAscentButton}
          onClick={() => {
            setValue('hasTraining', true, { shouldDirty: true })
          }}
          type='button'
        >
          <PlusIcon aria-hidden='true' size={20} />
        </button>
      )}
      {isActive && (hasTraining || ascents.length > 0) ? (
        <SendButton isSubmitting={isSubmitting} />
      ) : undefined}
    </>
  )
}
