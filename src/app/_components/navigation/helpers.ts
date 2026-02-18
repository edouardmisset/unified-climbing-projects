import type { NavigationElement } from './constants'

export function createNavigationElementKey(item: NavigationElement, index: number): string {
  if (item.type === 'link') return item.href
  if (item.type === 'group') return item.label
  return `separator-${index}`
}
