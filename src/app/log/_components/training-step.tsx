import { useFormContext, useWatch } from 'react-hook-form'
import formStyles from '~/app/_components/forms/form.module.css'
import { includesTraining } from '~/domain/climbing-log'
import {
  ANATOMICAL_REGIONS,
  ENERGY_SYSTEMS,
  TRAINING_SESSION_TYPES,
} from '~/domain/training-session'
import type { LogDraft } from '../draft'
import { Field } from './field'
import { SendButton } from './send-button'

export function TrainingStep() {
  const {
    control,
    formState: { isSubmitting },
    register,
  } = useFormContext<LogDraft>()
  const scope = useWatch({ control, name: 'scope' })

  return (
    <>
      <h2 className={formStyles.groupHeader}>Training details</h2>
      <Field htmlFor='training-type' label='Session type' required>
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
      <Field htmlFor='training-comments' label='Comments'>
        <textarea
          {...register('training.comments')}
          className={`${formStyles.input} ${formStyles.textarea}`}
          id='training-comments'
        />
      </Field>
      {includesTraining(scope) ? <SendButton isSubmitting={isSubmitting} /> : undefined}
    </>
  )
}
