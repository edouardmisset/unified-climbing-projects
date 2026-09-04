import { type LogStep, LOG_STEP_VALUES } from '../draft'
import styles from './log-wizard.module.css'

const STEP_LABELS = {
  ascents: 'Ascents',
  general: 'General',
  training: 'Training',
} as const satisfies Record<LogStep, string>

export function WizardHeader({
  activeStep,
  onDiscard,
  onNavigate,
}: {
  activeStep: LogStep
  onDiscard: VoidFunction
  onNavigate: (step: LogStep) => void
}) {
  return (
    <header className={styles.wizardHeader}>
      <ol aria-label='Logging progress' className={styles.progress}>
        {LOG_STEP_VALUES.map((step, index) => (
          <li className={styles.progressItem} key={step}>
            <button
              aria-current={step === activeStep ? 'step' : undefined}
              aria-label={`Step ${index + 1}: ${STEP_LABELS[step]}`}
              className={`${styles.stepButton} ${step === activeStep ? styles.activeStep : ''}`}
              onClick={() => {
                onNavigate(step)
              }}
              type='button'
            >
              {index + 1}. {STEP_LABELS[step]}
            </button>
          </li>
        ))}
      </ol>
      <button className={styles.resetButton} onClick={onDiscard} type='button'>
        Discard draft
      </button>
    </header>
  )
}
