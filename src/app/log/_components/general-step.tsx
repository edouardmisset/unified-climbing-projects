import { useLayoutEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import formStyles from '~/app/_components/forms/form.module.css'
import { ASCENT_DISCIPLINES } from '~/domain/ascent'
import { createAscentDraft, type LogDraft } from '../draft'
import {
  inferEnergySystem,
  inferLogContents,
  inferSessionType,
  type LogWizardBootstrap,
} from '../log-defaults'
import { Field } from './field'

export function GeneralStep({
  bootstrap,
  isActive,
  maximumDate,
}: {
  bootstrap: LogWizardBootstrap
  isActive: boolean
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
  const dateField = register('date')
  const dateInputRef = useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    if (isActive) dateInputRef.current?.focus()
  }, [isActive])

  const inferDefaultContents = (location: string) => {
    const inferredContents = inferLogContents(
      location,
      bootstrap.indoorLocations,
      bootstrap.outdoorLocations,
    )

    if (inferredContents.hasTraining && !getValues('hasTraining'))
      setValue('hasTraining', true, { shouldDirty: true })

    if (inferredContents.hasAscents && getValues('ascents').length === 0)
      setValue('ascents', [
        createAscentDraft({
          defaultGrade: bootstrap.defaultGrade,
          discipline: getValues('discipline'),
          historyDefaults: bootstrap.latestAscent,
        }),
      ])
  }

  const syncAscentDisciplines = (
    discipline: LogDraft['discipline'],
    previousDiscipline: LogDraft['discipline'],
  ) => {
    const ascents = getValues('ascents')
    const nextAscents = ascents.map((ascent, index) =>
      dirtyFields.ascents?.[index]?.discipline === true && ascent.discipline !== previousDiscipline
        ? ascent
        : { ...ascent, discipline },
    )
    if (nextAscents.some((ascent, index) => ascent !== ascents[index]))
      setValue('ascents', nextAscents)
  }

  return (
    <>
      <h2 className={formStyles.groupHeader}>General details</h2>
      <div className={formStyles.row}>
        <Field htmlFor='date' label='Date' required={isActive}>
          <input
            {...dateField}
            className={formStyles.input}
            id='date'
            max={maximumDate}
            ref={element => {
              dateField.ref(element)
              dateInputRef.current = element
            }}
            required={isActive}
            type='date'
          />
        </Field>
        <Field htmlFor='discipline' label='Discipline' required={isActive}>
          <select
            {...disciplineField}
            className={formStyles.input}
            id='discipline'
            onChange={event => {
              const previousDiscipline = getValues('discipline')
              void disciplineField.onChange(event)
              const discipline = event.target.value as LogDraft['discipline']
              syncAscentDisciplines(discipline, previousDiscipline)
              if (dirtyFields.training?.energySystem === true) return
              setValue('training.energySystem', inferEnergySystem(discipline))
            }}
            required={isActive}
          >
            {ASCENT_DISCIPLINES.map(discipline => (
              <option key={discipline} value={discipline}>
                {discipline}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field clearName='location' htmlFor='location' label='Location'>
        <input
          {...locationField}
          className={formStyles.input}
          id='location'
          list='location-list'
          onChange={event => {
            void locationField.onChange(event)
            inferDefaultContents(event.target.value)
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
