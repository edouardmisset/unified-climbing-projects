import { useFormContext } from 'react-hook-form'
import formStyles from '~/app/_components/forms/form.module.css'
import { ASCENT_DISCIPLINES } from '~/domain/ascent'
import { createAscentDraft, type LogDraft } from '../draft'
import { type LogWizardBootstrap, inferEnergySystem, inferSessionType } from '../log-defaults'
import { Field } from './field'

export function GeneralStep({
  bootstrap,
  maximumDate,
}: {
  bootstrap: LogWizardBootstrap
  maximumDate: string
}) {
  const {
    formState: { dirtyFields },
    getValues,
    register,
    setValue,
  } = useFormContext<LogDraft>()
  const disciplineField = register('discipline')
  const locationField = register('location')
  const scopeField = register('scope')

  const ensureAscentDraft = () => {
    if (getValues('ascents').length > 0) return
    setValue('ascents', [
      createAscentDraft({
        defaultGrade: bootstrap.defaultGrade,
        discipline: getValues('discipline'),
        historyDefaults: bootstrap.latestAscent,
      }),
    ])
  }

  return (
    <>
      <h2 className={formStyles.groupHeader}>General details</h2>
      <div className={formStyles.row}>
        <Field htmlFor='date' label='Date' required>
          <input
            {...register('date')}
            // oxlint-disable-next-line jsx_a11y/no-autofocus
            autoFocus
            className={formStyles.input}
            id='date'
            max={maximumDate}
            required
            type='date'
          />
        </Field>
        <Field htmlFor='discipline' label='Discipline' required>
          <select
            {...disciplineField}
            className={formStyles.input}
            id='discipline'
            onChange={event => {
              void disciplineField.onChange(event)
              if (dirtyFields.training?.energySystem === true) return
              const discipline = event.target.value as LogDraft['discipline']
              setValue('training.energySystem', inferEnergySystem(discipline))
            }}
          >
            {ASCENT_DISCIPLINES.map(discipline => (
              <option key={discipline} value={discipline}>
                {discipline}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field htmlFor='scope' label='Log contents'>
        <select
          {...scopeField}
          className={formStyles.input}
          id='scope'
          onChange={event => {
            void scopeField.onChange(event)
            const scope = event.target.value as LogDraft['scope']
            if (scope === 'training') setValue('ascents', [])
            else ensureAscentDraft()
          }}
        >
          <option value='training'>Training</option>
          <option value='ascents'>Ascents</option>
          <option value='both'>Training & ascents</option>
        </select>
      </Field>
      <Field htmlFor='location' label='Location'>
        <input
          {...locationField}
          className={formStyles.input}
          id='location'
          list='location-list'
          onChange={event => {
            void locationField.onChange(event)
            const inferredType = inferSessionType(
              event.target.value,
              bootstrap.crags,
              bootstrap.previousSessionTypes,
            )
            if (inferredType !== undefined) setValue('training.type', inferredType)
          }}
          placeholder='Céüse, Arkose, etc.'
          type='text'
        />
        <datalist id='location-list'>
          {bootstrap.locations.map(location => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </datalist>
      </Field>
    </>
  )
}
