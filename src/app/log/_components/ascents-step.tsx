import { Activity } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { PlusIcon } from 'lucide-react'
import formStyles from '~/app/_components/forms/form.module.css'
import { createAscentDraft, type LogDraft } from '../draft'
import type { LogWizardBootstrap } from '../log-defaults'
import { AscentFields } from './ascent-fields'
import styles from './log-wizard.module.css'
import { SendButton } from './send-button'

export function AscentsStep({
  bootstrap,
  isActive,
}: {
  bootstrap: LogWizardBootstrap
  isActive: boolean
}) {
  const {
    control,
    formState: { isSubmitting },
    getValues,
  } = useFormContext<LogDraft>()
  const { append, fields, remove } = useFieldArray({ control, name: 'ascents' })
  const hasTraining = useWatch({ control, name: 'hasTraining' })
  const appendAscent = () => {
    append(
      createAscentDraft({
        defaultGrade: bootstrap.defaultGrade,
        discipline: getValues('discipline'),
        historyDefaults: bootstrap.latestAscent,
      }),
    )
  }

  return (
    <Activity mode={isActive ? 'visible' : 'hidden'}>
      <>
        <h2 className={formStyles.groupHeader}>Ascents</h2>
        <datalist id='area-list'>
          {bootstrap.areas.map(area => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </datalist>
        {fields.map((field, index) => (
          <section className={styles.entityCard} key={field.id}>
            <AscentFields
              index={index}
              isActive={isActive}
              onRemove={() => {
                remove(index)
              }}
            />
            {index === fields.length - 1 ? (
              <button
                aria-label='Add ascent'
                className={styles.addAscentButton}
                onClick={appendAscent}
                title='Add ascent'
                type='button'
              >
                <PlusIcon aria-hidden='true' size={20} />
              </button>
            ) : undefined}
          </section>
        ))}
        {fields.length === 0 ? (
          <button className={styles.emptyAddButton} onClick={appendAscent} type='button'>
            <PlusIcon aria-hidden='true' size={20} />
            Add ascent
          </button>
        ) : undefined}
        {isActive && (fields.length > 0 || hasTraining) ? (
          <SendButton isSubmitting={isSubmitting} />
        ) : undefined}
      </>
    </Activity>
  )
}
