'use client'

import { usePathname } from 'next/navigation'
import { useTransitionRouter } from 'next-view-transitions'
import {
  type ReactNode,
  Suspense,
  useCallback,
  useMemo,
  useTransition,
} from 'react'
import { AscentsTrainingSwitch } from '~/app/_components/ascents-training-switch/ascents-training-switch'
import GridLayout from '~/app/_components/grid-layout/grid-layout'
import { ToggleGroup } from '~/app/_components/toggle-group/toggle-group'
import { Loader } from '../_components/loader/loader'
import {
  PATH_TO_VISUALIZATION,
  visualizationPathSchema,
  visualizationSchema,
  visualizations,
} from './constants'
import styles from './page.module.css'

export default function Layout({ children }: { children: ReactNode }) {
  const router = useTransitionRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const activeVisualizationType = useMemo(() => {
    const visualizationTypeFromURL = pathname.split('/').at(-1)
    if (!visualizationTypeFromURL) return 'Calendar'

    const res = visualizationPathSchema.safeParse(visualizationTypeFromURL)
    if (!res.success) return 'Calendar'
    const visualizationType = res.data

    return PATH_TO_VISUALIZATION[visualizationType] ?? 'Calendar'
  }, [pathname])

  const isTraining = useMemo(
    () => pathname.includes('training-sessions'),
    [pathname],
  )

  const toggleAscentsOrTraining = useCallback(() => {
    startTransition(() => {
      router.push(
        isTraining
          ? `/visualization/ascents/${activeVisualizationType.toLowerCase().replaceAll(' ', '-')}`
          : `/visualization/training-sessions/${activeVisualizationType.toLowerCase().replaceAll(' ', '-')}`,
      )
    })
  }, [router, activeVisualizationType, isTraining])

  const handleVisualizationChange = useCallback(
    ([value]: unknown[]) => {
      const result = visualizationSchema.safeParse(value)
      if (!result.success) return
      const visualizationType = result.data

      const ascentsOrTraining: 'training-sessions' | 'ascents' = isTraining
        ? 'training-sessions'
        : 'ascents'

      const normalizedVisualizationType = visualizationType
        .split(' ')
        .join('-')
        .toLowerCase()

      startTransition(() => {
        router.push(
          `/visualization/${ascentsOrTraining}/${normalizedVisualizationType}`,
        )
      })
    },
    [router, isTraining],
  )

  return (
    <div className={`${styles.container} w100 flex-column gap`}>
      <GridLayout
        additionalContent={
          <div className={`flex-row padding space-evenly gap ${styles.header}`}>
            <ToggleGroup
              onValueChange={handleVisualizationChange}
              selectedValue={activeVisualizationType}
              values={visualizations}
            />
            <AscentsTrainingSwitch
              isTraining={isTraining}
              toggle={toggleAscentsOrTraining}
            />
          </div>
        }
        title="Visualization"
      >
        <Suspense fallback={<Loader />}>{children}</Suspense>
        {isPending && <div className={styles.overlay} />}
      </GridLayout>
    </div>
  )
}
