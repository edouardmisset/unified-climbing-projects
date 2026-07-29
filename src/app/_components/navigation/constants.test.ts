import { describe, expect, it } from 'vite-plus/test'
import { NAVIGATION_ITEMS } from './constants'

describe('navigation items', () => {
  it('links to Settings without exposing a standalone Import route', () => {
    const hrefs = NAVIGATION_ITEMS.flatMap((item): string[] => {
      if (item.type === 'link') return [item.href]
      if (item.type === 'group') return item.links.map((link) => link.href)
      return []
    })

    expect(hrefs).toContain('/settings')
    expect(hrefs).not.toContain('/import')
  })
})
