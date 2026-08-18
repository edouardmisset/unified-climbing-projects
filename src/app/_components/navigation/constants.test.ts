import { describe, expect, it } from 'vite-plus/test'
import { getNavigationItems } from './constants'

describe('navigation items', () => {
  it('keeps a compact set of routes for each domain', () => {
    const items = getNavigationItems('ascents')
    const hrefs = items.flatMap((item): string[] => {
      if (item.type === 'link') return [item.href]
      if (item.type === 'disclosure') return item.links.map(link => link.href)
      return []
    })

    expect(hrefs).toContain('/ascents/settings')
    expect(hrefs).toContain('/ascents/log')
    expect(hrefs).toContain('/ascents/visuals/qr-code')
    expect(hrefs).not.toContain('/ascents/top-ten')
    expect(hrefs).not.toContain('/ascent-form')
    expect(hrefs).not.toContain('/training-session-form')
    expect(hrefs).not.toContain('/import')
    expect(items.filter(item => item.type !== 'separator').map(item => item.label)).not.toContain(
      'Browse',
    )
  })
})
