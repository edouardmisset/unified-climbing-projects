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
  VISUALIZATION_TO_PATH,
  type VisualizationType,
  visualizationPathSchema,
  visualizationSchema,
  visualizations,
} from './constants'
import styles from './page.module.css'

export default function Layout({ children }: { children: ReactNode }) {
  const router = useTransitionRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const activeVisualizationType = useMemo<VisualizationType>(() => {
    const visualizationTypeFromURL = pathname.split('/').at(-1)
    if (!visualizationTypeFromURL) return 'Calendar'

    const parsedVisualizationPath = visualizationPathSchema.safeParse(visualizationTypeFromURL)
    if (!parsedVisualizationPath.success) return 'Calendar'
    const visualizationType = parsedVisualizationPath.data

    return PATH_TO_VISUALIZATION[visualizationType] ?? 'Calendar'
  }, [pathname])

  const isTraining = useMemo(
    () => pathname.includes('training-sessions'),
    [pathname],
  )

  const toggleAscentsOrTraining = useCallback(() => {
    startTransition(() => {
      router.push(
        getVisualizationPath({
          isTraining: !isTraining,
          visualizationType: activeVisualizationType,
        }),
      )
    })
  }, [router, activeVisualizationType, isTraining])

  const handleVisualizationChange = useCallback(
    ([value]: unknown[]) => {
      const parsedVisualization = visualizationSchema.safeParse(value)
      if (!parsedVisualization.success) return
      const visualizationType = parsedVisualization.data

      startTransition(() => {
        router.push(
          getVisualizationPath({
            isTraining,
            visualizationType,
          }),
        )
      })
    },
    [router, isTraining],
  )

  return (
    <div className={`${styles.container} w100 flexColumn gap`}>
      <GridLayout
        additionalContent={
          <div className={styles.header}>
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

function getVisualizationPath({
  isTraining,
  visualizationType,
}: {
  isTraining: boolean
  visualizationType: VisualizationType
}): string {
  const path = VISUALIZATION_TO_PATH[visualizationType]
  return isTraining
    ? `/visualization/training-sessions/${path}`
    : `/visualization/ascents/${path}`
}
