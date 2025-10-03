import type { NavigationElement } from './constants'

export function createNavigationElementKey(
  item: NavigationElement,
  index: number,
): string {
  return item.type === 'link'
    ? item.href
    : item.type === 'group'
      ? item.label
      : `separator-${index}`
}
