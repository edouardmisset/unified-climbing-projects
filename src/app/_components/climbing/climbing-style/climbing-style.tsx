import type { ComponentProps } from 'react'
import { ASCENT_STYLE } from '~/schema/ascent'
import styles from './climbing-style.module.css'

type RawAscentStyle = (typeof ASCENT_STYLE)[number]
type InsensitiveStyle = RawAscentStyle | Lowercase<RawAscentStyle>
type Suffix = 'ed' | 'ing'
type StyleWithSuffix = `${InsensitiveStyle}${Suffix}` | InsensitiveStyle

type ClimbingStyleProps = {
  climbingStyle: StyleWithSuffix
}

export function ClimbingStyle(props: Omit<ComponentProps<'em'>, 'children'> & ClimbingStyleProps) {
  const { climbingStyle, className = '', ...otherProps } = props

  return (
    <em {...otherProps} className={`${styles.climbingStyle} ${className}`}>
      {climbingStyle}
    </em>
  )
}
