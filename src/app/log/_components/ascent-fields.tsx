import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { XIcon } from 'lucide-react'
import formStyles from '~/app/_components/forms/form.module.css'
import { GradeInput } from '~/app/_components/grade-input/grade-input'
import { ASCENT_DISCIPLINES, ASCENT_HOLDS, ASCENT_PROFILES, ASCENT_STYLES } from '~/domain/ascent'
import { ascentRequiresRedpoint, REDPOINT_STYLE } from '~/domain/ascent-rules'
import { fromGradeToNumber, fromNumberToGrade } from '~/helpers/grade-converter'
import type { LogDraft } from '../draft'
import { Field } from './field'
import styles from './log-wizard.module.css'

export function AscentFields({
  index,
  isActive,
  onRemove,
}: {
  index: number
  isActive: boolean
  onRemove: VoidFunction
}) {
  const { control, register, setValue } = useFormContext<LogDraft>()
  const prefix = `ascents.${index}` as const
  const tries = useWatch({ control, name: `${prefix}.tries` })
  const requiresRedpoint = ascentRequiresRedpoint(tries)
  const triesField = register(`${prefix}.tries`)

  return (
    <>
      <header className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Ascent {index + 1}</h3>
        <button
          aria-label={`Remove ascent ${index + 1}`}
          className={styles.removeButton}
          onClick={onRemove}
          title={`Remove ascent ${index + 1}`}
          type='button'
        >
          <XIcon aria-hidden='true' size={18} />
        </button>
      </header>
      <div className={formStyles.row}>
        <Field htmlFor={`${prefix}.name`} label='Name' required={isActive}>
          <input
            {...register(`${prefix}.name`)}
            className={formStyles.input}
            id={`${prefix}.name`}
            required={isActive}
            type='text'
          />
        </Field>
        <Field htmlFor={`${prefix}.discipline`} label='Discipline' required={isActive}>
          <select
            {...register(`${prefix}.discipline`)}
            className={formStyles.input}
            id={`${prefix}.discipline`}
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
      <div className={styles.gradeFields}>
        <Controller
          control={control}
          name={`${prefix}.grade`}
          render={({ field }) => (
            <GradeInput
              className={formStyles.field}
              label='Grade'
              onValueChange={value => {
                if (value === null) return
                const grade = fromNumberToGrade(value)
                field.onChange(grade)
                setValue(`${prefix}.personalGrade`, grade, {
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }}
              required={isActive}
              value={fromGradeToNumber(field.value)}
            />
          )}
        />
        <Controller
          control={control}
          name={`${prefix}.personalGrade`}
          render={({ field }) => (
            <GradeInput
              className={formStyles.field}
              gradeType='Personal'
              label='Personal grade'
              onValueChange={value => {
                field.onChange(value === null ? '' : fromNumberToGrade(value))
              }}
              // oxlint-disable-next-line unicorn/no-null -- Base UI uses null for an empty controlled value.
              value={field.value === '' ? null : fromGradeToNumber(field.value)}
            />
          )}
        />
      </div>
      <div className={formStyles.row}>
        <Field htmlFor={`${prefix}.style`} label='Style' required={isActive}>
          <select
            {...register(`${prefix}.style`)}
            className={formStyles.input}
            id={`${prefix}.style`}
            required={isActive}
          >
            {ASCENT_STYLES.map(style => (
              <option
                disabled={requiresRedpoint && style !== REDPOINT_STYLE}
                key={style}
                value={style}
              >
                {style}
              </option>
            ))}
          </select>
        </Field>
        <Field htmlFor={`${prefix}.tries`} label='Tries' required={isActive}>
          <input
            {...triesField}
            className={formStyles.input}
            id={`${prefix}.tries`}
            min={1}
            onChange={event => {
              void triesField.onChange(event)
              if (ascentRequiresRedpoint(event.target.value))
                setValue(`${prefix}.style`, REDPOINT_STYLE, { shouldDirty: true })
            }}
            required={isActive}
            type='number'
          />
        </Field>
      </div>
      <div className={styles.ascentDetailsFields}>
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
        <Field htmlFor={`${prefix}.height`} label='Height (m)'>
          <input
            {...register(`${prefix}.height`)}
            className={formStyles.input}
            id={`${prefix}.height`}
            min={0}
            type='number'
          />
        </Field>
      </div>
      <div className={formStyles.row}>
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
      <Field htmlFor={`${prefix}.comments`} label='Comments'>
        <textarea
          {...register(`${prefix}.comments`)}
          className={`${formStyles.input} ${formStyles.textarea}`}
          id={`${prefix}.comments`}
        />
      </Field>
    </>
  )
}
