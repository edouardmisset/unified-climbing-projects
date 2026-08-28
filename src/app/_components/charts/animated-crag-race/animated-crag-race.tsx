'use client'

// oxlint-disable react/no-multi-comp -- PlaybackControls is a focused local subcomponent.

import {
  GaugeIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  StepBackIcon,
  StepForwardIcon,
} from 'lucide-react'
import { type ChangeEvent, useEffect, useRef, useState } from 'react'
import { ChartContainer } from '../chart-container/chart-container'
import { TanStackBarChart, type ChartSeries } from '../tanstack-chart'
import { ASCENT_GRADE_TO_COLOR, ASCENT_STYLE_TO_COLOR } from '~/constants/ascents'
import { fromGradeToBackgroundColor } from '~/helpers/ascent-converter'
import { formatEnglishYearMonthDay } from '~/helpers/date'
import { formatCountWithEnglishNoun } from '~/helpers/format-plurals'
import { ASCENT_STYLE } from '~/schema/ascent'
import { createAscentPyramidTimeline, type AnimatedPyramidDatum } from './ascent-pyramid-timeline'
import {
  createTimelineDates,
  createCragRaceTimeline,
  type AnimatedAscent,
  type CragRaceDatum,
} from './crag-race-timeline'
import styles from './animated-crag-race.module.css'

const TIMELINE_DURATION_MS = 60_000
const PYRAMID_SERIES = ASCENT_STYLE.map(key => ({
  key,
  color: ASCENT_STYLE_TO_COLOR[key],
})) satisfies ChartSeries[]
const CHART_ANIMATION_DURATION_MS = 550
const ANIMATION_FRAME_FRACTION = 0.9
const ANIMATION = {
  easing: 'ease-in-out',
  respectReducedMotion: true,
} as const
const HALF_SPEED = 0.5
const FIVE_X_SPEED = 5
const TEN_X_SPEED = 10
const TOUCH_CONTROLS_TIMEOUT_MS = 3_000
const SPEEDS = [HALF_SPEED, 1, 2, FIVE_X_SPEED, TEN_X_SPEED] as const

type Playback = ReturnType<typeof useTimelinePlayback>

function baseFrameDuration(frameCount: number): number {
  return TIMELINE_DURATION_MS / Math.max(frameCount - 1, 1)
}

function frameDuration(frameCount: number, speed: number): number {
  return baseFrameDuration(frameCount) / speed
}

function createChartAnimation(frameCount: number, speed: number) {
  return {
    ...ANIMATION,
    duration: Math.max(
      1,
      Math.min(
        CHART_ANIMATION_DURATION_MS,
        frameDuration(frameCount, speed) * ANIMATION_FRAME_FRACTION,
      ),
    ),
  }
}

function useTimelinePlayback(frameCount: number) {
  const lastFrameIndex = Math.max(frameCount - 1, 0)
  const [currentFrameIndex, setCurrentFrameIndex] = useState(lastFrameIndex)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const elapsedTimelineMs = useRef(0)
  const lastAnimationTimestamp = useRef(0)
  const safeFrameIndex = Math.min(currentFrameIndex, lastFrameIndex)

  useEffect(() => {
    if (!isPlaying || safeFrameIndex >= lastFrameIndex) return

    const duration = baseFrameDuration(frameCount)
    let animationFrame = 0
    const advance = (timestamp: number) => {
      const previousTimestamp = lastAnimationTimestamp.current
      lastAnimationTimestamp.current = timestamp

      if (previousTimestamp > 0) {
        elapsedTimelineMs.current += (timestamp - previousTimestamp) * speed
        const nextFrameIndex = Math.min(
          Math.floor(elapsedTimelineMs.current / duration),
          lastFrameIndex,
        )
        if (nextFrameIndex !== safeFrameIndex) setCurrentFrameIndex(nextFrameIndex)
        if (nextFrameIndex === lastFrameIndex) {
          setIsPlaying(false)
          return
        }
      }

      animationFrame = globalThis.requestAnimationFrame(advance)
    }

    animationFrame = globalThis.requestAnimationFrame(advance)

    return () => {
      globalThis.cancelAnimationFrame(animationFrame)
      lastAnimationTimestamp.current = 0
    }
  }, [frameCount, isPlaying, lastFrameIndex, safeFrameIndex, speed])

  return {
    currentFrameIndex: safeFrameIndex,
    hasInteracted,
    isPlaying,
    lastFrameIndex,
    handlePause: () => {
      setHasInteracted(true)
      setIsPlaying(false)
    },
    handlePlay: () => {
      setHasInteracted(true)
      if (lastFrameIndex === 0) {
        setIsPlaying(false)
        return
      }
      const nextFrameIndex = safeFrameIndex >= lastFrameIndex ? 0 : safeFrameIndex
      elapsedTimelineMs.current = nextFrameIndex * baseFrameDuration(frameCount)
      lastAnimationTimestamp.current = 0
      setCurrentFrameIndex(nextFrameIndex)
      setIsPlaying(true)
    },
    handlePrevious: () => {
      setHasInteracted(true)
      setIsPlaying(false)
      setCurrentFrameIndex(index => {
        const nextFrameIndex = Math.max(Math.min(index, lastFrameIndex) - 1, 0)
        elapsedTimelineMs.current = nextFrameIndex * baseFrameDuration(frameCount)
        return nextFrameIndex
      })
    },
    handleNext: () => {
      setHasInteracted(true)
      setIsPlaying(false)
      setCurrentFrameIndex(index => {
        const nextFrameIndex = Math.min(Math.min(index, lastFrameIndex) + 1, lastFrameIndex)
        elapsedTimelineMs.current = nextFrameIndex * baseFrameDuration(frameCount)
        return nextFrameIndex
      })
    },
    handleRestart: () => {
      setHasInteracted(true)
      setIsPlaying(false)
      elapsedTimelineMs.current = 0
      setCurrentFrameIndex(0)
    },
    handleSeek: (event: ChangeEvent<HTMLInputElement>) => {
      setHasInteracted(true)
      setIsPlaying(false)
      const nextFrameIndex = Number(event.currentTarget.value)
      elapsedTimelineMs.current = nextFrameIndex * baseFrameDuration(frameCount)
      setCurrentFrameIndex(nextFrameIndex)
    },
    handleSpeedChange: (event: ChangeEvent<HTMLSelectElement>) => {
      setHasInteracted(true)
      setSpeed(Number(event.currentTarget.value))
    },
    speed,
  }
}

function PlaybackControls({
  chartLabel,
  playback,
  totalAscents,
  date,
}: {
  chartLabel: string
  playback: Playback
  totalAscents: number
  date: string
}) {
  return (
    <div className={styles.controls}>
      <div className={styles.controlRow}>
        <fieldset className={styles.buttonGroup}>
          <legend className={styles.visuallyHidden}>{chartLabel} playback controls</legend>
          {playback.isPlaying ? (
            <button
              aria-label={`Pause: ${chartLabel}`}
              className={styles.iconButton}
              onClick={playback.handlePause}
              title={`Pause ${chartLabel}`}
              type='button'
            >
              <PauseIcon aria-hidden='true' size={18} />
            </button>
          ) : (
            <button
              aria-label={`Play: ${chartLabel}`}
              className={styles.iconButton}
              onClick={playback.handlePlay}
              title={`Play ${chartLabel}`}
              type='button'
            >
              <PlayIcon aria-hidden='true' size={18} />
            </button>
          )}
          <button
            aria-label={`Previous day: ${chartLabel}`}
            className={styles.iconButton}
            disabled={playback.currentFrameIndex === 0}
            onClick={playback.handlePrevious}
            title={`Previous day on ${chartLabel}`}
            type='button'
          >
            <StepBackIcon aria-hidden='true' size={18} />
          </button>
          <button
            aria-label={`Next day: ${chartLabel}`}
            className={styles.iconButton}
            disabled={playback.currentFrameIndex === playback.lastFrameIndex}
            onClick={playback.handleNext}
            title={`Next day on ${chartLabel}`}
            type='button'
          >
            <StepForwardIcon aria-hidden='true' size={18} />
          </button>
          <button
            aria-label={`Restart: ${chartLabel}`}
            className={styles.iconButton}
            onClick={playback.handleRestart}
            title={`Restart ${chartLabel}`}
            type='button'
          >
            <RotateCcwIcon aria-hidden='true' size={18} />
          </button>
        </fieldset>

        <label className={styles.rangeGroup}>
          <span className={styles.visuallyHidden}>{chartLabel} timeline</span>
          <input
            aria-label={`${chartLabel} timeline day`}
            className={styles.range}
            max={playback.lastFrameIndex}
            min={0}
            onChange={playback.handleSeek}
            type='range'
            value={playback.currentFrameIndex}
          />
        </label>

        <label className={styles.speedControl} title={`Playback speed for ${chartLabel}`}>
          <GaugeIcon aria-hidden='true' size={18} />
          <span className={styles.visuallyHidden}>Playback speed</span>
          <select
            aria-label={`${chartLabel} playback speed`}
            className={styles.select}
            onChange={playback.handleSpeedChange}
            value={playback.speed}
          >
            {SPEEDS.map(value => (
              <option key={value} value={value}>
                {value}×
              </option>
            ))}
          </select>
        </label>
      </div>

      {playback.hasInteracted ? (
        <p aria-live='polite' className={styles.status}>
          <span>{formatEnglishYearMonthDay(date)}</span>
          <span>
            {formatCountWithEnglishNoun(totalAscents, { one: 'ascent', other: 'ascents' })}
          </span>
        </p>
      ) : undefined}
    </div>
  )
}

function ChartPanel({
  chartLabel,
  children,
  date,
  playback,
  totalAscents,
}: {
  chartLabel: string
  children: React.ReactNode
  date: string
  playback: Playback
  totalAscents: number
}) {
  const [isTouchActive, setIsTouchActive] = useState(false)
  const [isPointerActive, setIsPointerActive] = useState(false)
  const touchResetTimeout = useRef<{ id?: ReturnType<typeof setTimeout> }>({})
  const isControlsActive = isTouchActive || isPointerActive

  useEffect(
    () => () => {
      const timeoutId = touchResetTimeout.current.id
      if (timeoutId !== undefined) globalThis.clearTimeout(timeoutId)
    },
    [],
  )

  const clearTouchActive = () => {
    const timeoutId = touchResetTimeout.current.id
    if (timeoutId !== undefined) {
      globalThis.clearTimeout(timeoutId)
      delete touchResetTimeout.current.id
    }
    setIsTouchActive(false)
  }

  return (
    <div className={styles.chartPanel}>
      <div
        className={styles.chartViewport}
        data-controls-active={isControlsActive ? 'true' : undefined}
        onPointerEnter={event => {
          if (event.pointerType === 'mouse') setIsPointerActive(true)
        }}
        onPointerLeave={event => {
          if (event.pointerType === 'mouse') setIsPointerActive(false)
        }}
        onPointerCancel={clearTouchActive}
        onPointerDown={event => {
          if (event.pointerType === 'mouse') return
          setIsTouchActive(true)
          const timeoutId = touchResetTimeout.current.id
          if (timeoutId !== undefined) globalThis.clearTimeout(timeoutId)
          touchResetTimeout.current.id = globalThis.setTimeout(() => {
            delete touchResetTimeout.current.id
            setIsTouchActive(false)
          }, TOUCH_CONTROLS_TIMEOUT_MS)
        }}
      >
        <div className={styles.controlsContainer}>
          <div className={styles.controlsBackground} />
          <div className={styles.controlsEdge} />
          <div className={styles.controlsContent}>
            <PlaybackControls
              chartLabel={chartLabel}
              date={date}
              playback={playback}
              totalAscents={totalAscents}
            />
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

function createGradeSeries(grades: readonly string[]): ChartSeries[] {
  return grades.map(grade => ({
    key: grade,
    color:
      grade in ASCENT_GRADE_TO_COLOR
        ? fromGradeToBackgroundColor(grade as AnimatedAscent['grade'])
        : 'var(--gray-5)',
  }))
}

export function AnimatedCragRace({ ascents }: { ascents: AnimatedAscent[] }) {
  const timeline = createCragRaceTimeline(ascents)
  const playback = useTimelinePlayback(timeline.frames.length)
  const currentFrame = timeline.frames[playback.currentFrameIndex]
  const animation = createChartAnimation(timeline.frames.length, playback.speed)

  if (currentFrame === undefined) return false

  return (
    <ChartContainer caption='Ascents By Grades Per Crag'>
      <ChartPanel
        chartLabel='Crag race'
        date={currentFrame.date}
        playback={playback}
        totalAscents={currentFrame.totalAscents}
      >
        <TanStackBarChart<CragRaceDatum>
          animation={animation}
          ariaLabel='Ascents by grades per crag over time'
          data={currentFrame.data}
          getCategory={datum => datum.crag}
          orientation='horizontal'
          series={createGradeSeries(timeline.grades)}
          totalLabels
          x={{ domain: [0, timeline.maximumCount], label: '# Ascents' }}
          y={{ label: 'Crag' }}
        />
      </ChartPanel>
    </ChartContainer>
  )
}

export function AnimatedAscentPyramid({ ascents }: { ascents: AnimatedAscent[] }) {
  const pyramidTimeline = createAscentPyramidTimeline(ascents, createTimelineDates(ascents))
  const playback = useTimelinePlayback(pyramidTimeline.frames.length)
  const currentPyramidFrame = pyramidTimeline.frames[playback.currentFrameIndex]
  const animation = createChartAnimation(pyramidTimeline.frames.length, playback.speed)

  if (currentPyramidFrame === undefined) return false

  return (
    <ChartContainer caption='Ascent Pyramid'>
      <ChartPanel
        chartLabel='Ascent pyramid'
        date={currentPyramidFrame.date}
        playback={playback}
        totalAscents={currentPyramidFrame.totalAscents}
      >
        <TanStackBarChart<AnimatedPyramidDatum>
          animation={animation}
          ariaLabel='Ascent pyramid over time'
          data={currentPyramidFrame.data}
          getCategory={datum => datum.grade}
          series={PYRAMID_SERIES}
          totalLabels
          y={{ domain: [0, pyramidTimeline.maximumCount], label: '# Ascents' }}
        />
      </ChartPanel>
    </ChartContainer>
  )
}
