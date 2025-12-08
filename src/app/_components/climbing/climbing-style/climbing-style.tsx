import type { ComponentProps } from 'react'
import type { Ascent } from '~/schema/ascent'
import styles from './climbing-style.module.css'

type InsensitiveStyle = Ascent['style'] | Lowercase<Ascent['style']>
type Suffix = 'ed' | 'ing'
type StyleWithSuffix = `${InsensitiveStyle}${Suffix}` | InsensitiveStyle

interface ClimbingStyleProps {
  climbingStyle: StyleWithSuffix
}

export function ClimbingStyle(
  props: Omit<ComponentProps<'em'>, 'children'> & ClimbingStyleProps,
) {
  const { climbingStyle, className = '', ...otherProps } = props

  return (
    <em {...otherProps} className={`${styles.climbingStyle} ${className}`}>
      {climbingStyle}
    </em>
  )
}
