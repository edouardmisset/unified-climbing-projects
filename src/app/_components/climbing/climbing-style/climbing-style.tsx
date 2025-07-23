import type { ComponentProps } from 'react'
import type { Ascent } from '~/schema/ascent'
import styles from './climbing-style.module.css'

type InsensitiveStyle = Ascent['style'] | Lowercase<Ascent['style']>
type Suffix = 'ed' | 'ing'
type StyleWithSuffix = `${InsensitiveStyle}${Suffix | ''}`

interface ClimbingStyleProps {
  style: StyleWithSuffix
}

export function ClimbingStyle(
  props: ComponentProps<'em'> & ClimbingStyleProps,
) {
  const { style, className = '', ...otherProps } = props

  return (
    <em {...otherProps} className={`${styles.style} ${className}`}>
      {style}
    </em>
  )
}
