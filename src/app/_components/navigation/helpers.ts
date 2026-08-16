import type { NavigationElement } from './constants'

export function splitNavigationLabel(label: string) {
  const [icon = label, ...labelParts] = label.trim().split(/\s+/u)
  return {
    icon,
    text: labelParts.join(' ') || label,
  }
}

export function createNavigationElementKey(item: NavigationElement, index: number): string {
  if (item.type === 'link') return item.href
  if (item.type === 'group' || item.type === 'disclosure') return item.label
  return `separator-${index}`
}
