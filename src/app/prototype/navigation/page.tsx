'use client'

// Prototype question: which of five structurally different navigation rails makes the
// collapsed state feel most intentional? Switch with `?variant=1..5` and test the toggle.

import {
  BarChart3,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardList,
  Dumbbell,
  House,
  Mountain,
  PanelLeftClose,
  PanelLeftOpen,
  Settings2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './page.module.css'

type VariantId = '1' | '2' | '3' | '4' | '5'
type VariantProps = { expanded: boolean; onToggle: () => void }

const variants: { id: VariantId; name: string; note: string }[] = [
  { id: '1', name: 'Quiet rail', note: 'A focused, balanced sidebar with a single strong active state.' },
  { id: '2', name: 'Floating island', note: 'A softer navigation card that gives the content more breathing room.' },
  { id: '3', name: 'Sectioned map', note: 'Clear groups and a compact rail make the information architecture visible.' },
  { id: '4', name: 'Profile shelf', note: 'A calmer hierarchy that treats your climbing focus as the primary control.' },
  { id: '5', name: 'Command dock', note: 'A dense icon dock that opens into a wider command panel.' },
]

const primaryItems: { label: string; icon: LucideIcon }[] = [
  { label: 'Home', icon: House },
  { label: 'Log', icon: ClipboardList },
  { label: 'Sessions', icon: Dumbbell },
  { label: 'Calendar', icon: CalendarDays },
  { label: 'Dashboard', icon: BarChart3 },
]

const insightItems: { label: string; icon: LucideIcon }[] = [
  { label: 'Visuals', icon: Sparkles },
  { label: 'Indicators', icon: ChartNoAxesCombined },
]

function Avatar({ small = false }: { small?: boolean }) {
  return (
    <span aria-hidden='true' className={`${styles.avatar} ${small ? styles.avatarSmall : ''}`}>
      <span>EM</span>
    </span>
  )
}

function Toggle({ expanded, onToggle, className = '' }: VariantProps & { className?: string }) {
  return (
    <button
      aria-expanded={expanded}
      aria-label={expanded ? 'Collapse navigation drawer' : 'Expand navigation drawer'}
      className={`${styles.toggle} ${className}`}
      onClick={onToggle}
      type='button'
    >
      {expanded ? <PanelLeftClose size={19} /> : <PanelLeftOpen size={19} />}
      <span className={styles.srOnly}>{expanded ? 'Collapse' : 'Expand'} navigation</span>
    </button>
  )
}

function DomainSwitch({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${styles.domainSwitch} ${compact ? styles.domainSwitchCompact : ''}`}>
      <button className={styles.domainButton} type='button'>
        <Mountain aria-hidden='true' size={17} />
        <span>Ascents</span>
      </button>
      <button className={`${styles.domainButton} ${styles.domainButtonSelected}`} type='button'>
        <Dumbbell aria-hidden='true' size={17} />
        <span>Training</span>
      </button>
    </div>
  )
}

function NavItem({
  item,
  active = false,
  numbered = false,
  className = '',
}: {
  item: { label: string; icon: LucideIcon }
  active?: boolean
  numbered?: boolean
  className?: string
}) {
  const Icon = item.icon
  return (
    <button
      aria-current={active ? 'page' : undefined}
      className={`${styles.navItem} ${active ? styles.navItemActive : ''} ${className}`}
      type='button'
    >
      <span className={styles.iconSlot}>
        <Icon aria-hidden='true' size={19} strokeWidth={active ? 2.4 : 1.9} />
      </span>
      <span className={styles.navLabel}>{item.label}</span>
      {numbered ? <span className={styles.itemNumber}>0{primaryItems.indexOf(item) + 1}</span> : null}
    </button>
  )
}

function Footer({ expanded, shelf = false }: { expanded: boolean; shelf?: boolean }) {
  return (
    <div className={`${styles.footer} ${shelf ? styles.footerShelf : ''}`}>
      <div className={styles.profile} title={expanded ? 'Edouard Misset' : 'Edouard Misset'}>
        <Avatar small={!expanded} />
        <div className={styles.profileCopy}>
          <strong>Edouard</strong>
          <span>Climber profile</span>
        </div>
      </div>
      <button aria-label='Open settings' className={styles.settingsButton} type='button'>
        <Settings2 aria-hidden='true' size={18} />
        <span className={styles.navLabel}>Settings</span>
      </button>
      <button aria-label='Toggle light and dark mode' className={styles.themeButton} type='button'>
        <span aria-hidden='true'>◐</span>
        <span className={styles.navLabel}>Theme</span>
      </button>
    </div>
  )
}

function QuietRail({ expanded, onToggle }: VariantProps) {
  return (
    <aside className={`${styles.sidebar} ${styles.quietRail}`}>
      <div className={styles.sidebarTop}>
        <div className={styles.brandMark}>C</div>
        <Toggle expanded={expanded} onToggle={onToggle} />
      </div>
      <DomainSwitch compact={!expanded} />
      <div className={styles.itemList}>
        {primaryItems.map(item => (
          <NavItem active={item.label === 'Sessions'} item={item} key={item.label} />
        ))}
      </div>
      <div className={styles.quietDivider} />
      <div className={styles.itemList}>
        {insightItems.map(item => (
          <NavItem item={item} key={item.label} />
        ))}
      </div>
      <Footer expanded={expanded} />
    </aside>
  )
}

function FloatingIsland({ expanded, onToggle }: VariantProps) {
  return (
    <aside className={`${styles.sidebar} ${styles.floatingIsland}`}>
      <div className={styles.islandHeader}>
        <div className={styles.brandLockup}>
          <span className={styles.brandMark}>C</span>
          <span className={styles.brandText}>Climbing log</span>
        </div>
        <Toggle expanded={expanded} onToggle={onToggle} />
      </div>
      <div className={styles.islandBody}>
        <p className={styles.kicker}>Current focus</p>
        <DomainSwitch compact={!expanded} />
        <div className={styles.islandItems}>
          {primaryItems.map(item => (
            <NavItem active={item.label === 'Sessions'} item={item} key={item.label} />
          ))}
        </div>
        <div className={styles.islandRule} />
        {insightItems.map(item => (
          <NavItem item={item} key={item.label} />
        ))}
      </div>
      <Footer expanded={expanded} shelf />
    </aside>
  )
}

function SectionedMap({ expanded, onToggle }: VariantProps) {
  return (
    <aside className={`${styles.sidebar} ${styles.sectionedMap}`}>
      <div className={styles.mapHeader}>
        <Toggle expanded={expanded} onToggle={onToggle} />
        <span className={`${styles.brandText} ${styles.mapBrand}`}>FIELD NOTES</span>
      </div>
      <nav className={styles.mapNav}>
        <div className={styles.mapGroup}>
          <p className={styles.sectionLabel}>Explore</p>
          {primaryItems.slice(0, 2).map(item => (
            <NavItem item={item} key={item.label} />
          ))}
        </div>
        <div className={styles.mapGroup}>
          <p className={styles.sectionLabel}>Review</p>
          {primaryItems.slice(2).map(item => (
            <NavItem active={item.label === 'Sessions'} item={item} key={item.label} numbered />
          ))}
        </div>
        <div className={styles.mapGroup}>
          <p className={styles.sectionLabel}>Insights</p>
          {insightItems.map(item => (
            <NavItem item={item} key={item.label} />
          ))}
        </div>
      </nav>
      <div className={styles.mapBottom}>
        <Footer expanded={expanded} />
      </div>
    </aside>
  )
}

function ProfileShelf({ expanded, onToggle }: VariantProps) {
  return (
    <aside className={`${styles.sidebar} ${styles.profileShelf}`}>
      <div className={styles.shelfTop}>
        <Toggle expanded={expanded} onToggle={onToggle} />
        <div className={styles.shelfGreeting}>
          <span className={styles.eyebrow}>YOUR LOG</span>
          <strong>Good evening, Edouard</strong>
        </div>
      </div>
      <DomainSwitch compact={!expanded} />
      <button className={styles.featuredItem} type='button'>
        <span className={styles.featuredIcon}><Dumbbell aria-hidden='true' size={21} /></span>
        <span className={styles.featuredCopy}>
          <strong>Sessions</strong>
          <span>Training history</span>
        </span>
        <span className={styles.featuredArrow}>↗</span>
      </button>
      <div className={styles.shelfLinks}>
        {primaryItems.filter(item => item.label !== 'Sessions').map(item => (
          <NavItem item={item} key={item.label} />
        ))}
      </div>
      <div className={styles.shelfRule} />
      <div className={styles.shelfLinks}>
        {insightItems.map(item => (
          <NavItem item={item} key={item.label} />
        ))}
      </div>
      <Footer expanded={expanded} shelf />
    </aside>
  )
}

function CommandDock({ expanded, onToggle }: VariantProps) {
  return (
    <aside className={`${styles.sidebar} ${styles.commandDock}`}>
      <div className={styles.dockHeader}>
        <div className={styles.dockLogo}>C<span>+</span></div>
        <Toggle expanded={expanded} onToggle={onToggle} />
      </div>
      <div className={styles.dockMode}>
        <span className={styles.modeDot} />
        <span className={styles.navLabel}>Training mode</span>
      </div>
      <div className={styles.dockGrid}>
        {primaryItems.map(item => (
          <NavItem active={item.label === 'Sessions'} item={item} key={item.label} />
        ))}
      </div>
      <div className={styles.dockInsight}>
        <p className={styles.sectionLabel}>See more</p>
        {insightItems.map(item => (
          <NavItem item={item} key={item.label} />
        ))}
      </div>
      <Footer expanded={expanded} />
    </aside>
  )
}

function Variant({ id, ...props }: { id: VariantId } & VariantProps) {
  if (id === '1') return <QuietRail {...props} />
  if (id === '2') return <FloatingIsland {...props} />
  if (id === '3') return <SectionedMap {...props} />
  if (id === '4') return <ProfileShelf {...props} />
  return <CommandDock {...props} />
}

export default function NavigationPrototypePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(true)
  const requestedVariant = searchParams.get('variant')
  const currentVariant: VariantId = variants.some(variant => variant.id === requestedVariant)
    ? (requestedVariant as VariantId)
    : '1'
  const currentIndex = variants.findIndex(variant => variant.id === currentVariant)
  const current = variants[currentIndex] ?? variants[0]!

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && (event.target.matches('input, textarea, [contenteditable]'))) return
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      event.preventDefault()
      const direction = event.key === 'ArrowRight' ? 1 : -1
      const nextIndex = (currentIndex + direction + variants.length) % variants.length
      const next = variants[nextIndex]
      if (next) router.replace(`${pathname}?variant=${next.id}`, { scroll: false })
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, pathname, router])

  const setVariant = (id: VariantId) => router.replace(`${pathname}?variant=${id}`, { scroll: false })

  return (
    <div className={styles.page}>
      <section className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>Navigation prototype · 5 directions</p>
          <h1>Make the rail feel intentional.</h1>
          <p className={styles.introCopy}>Use the controls below to compare collapsed and expanded states. The content panel is deliberately quiet so the nav rhythm stays in focus.</p>
        </div>
        <div className={styles.stateReadout}>
          <span className={styles.stateDot} />
          <span>Live prototype</span>
          <strong>{current.name}</strong>
          <span aria-live='polite'>{expanded ? 'Expanded' : 'Collapsed'}</span>
        </div>
      </section>

      <section className={styles.stage}>
        <div className={styles.stageMeta}>
          <div>
            <span className={styles.variantNumber}>0{current.id}</span>
            <span className={styles.variantName}>{current.name}</span>
          </div>
          <span className={styles.stageHint}>{current.note}</span>
        </div>
        <div className={styles.mockShell} data-expanded={expanded}>
          <div className={styles.mockNavSlot}>
            <div className={styles.mockNav} data-expanded={expanded}>
              <Variant expanded={expanded} onToggle={() => setExpanded(value => !value)} id={currentVariant} />
            </div>
          </div>
          <div className={styles.mockContent}>
            <div className={styles.contentTopline}>
              <span className={styles.contentPulse} />
              <span>Training / Sessions</span>
              <span className={styles.contentDate}>September 03, 2026</span>
            </div>
            <div className={styles.contentHero}>
              <span className={styles.contentKicker}>THIS WEEK</span>
              <h2>Keep the good work visible.</h2>
              <p>A low-noise surface for the next page in your climbing log.</p>
              <div className={styles.contentBars} aria-hidden='true'><span /><span /><span /><span /><span /><span /></div>
            </div>
            <div className={styles.contentCards}>
              <div><span>Sessions</span><strong>12</strong><small>+3 this month</small></div>
              <div><span>Volume</span><strong>4.8k</strong><small>meters moved</small></div>
              <div><span>Best effort</span><strong>7c+</strong><small>one step further</small></div>
            </div>
          </div>
        </div>
      </section>

      {process.env.NODE_ENV !== 'production' ? (
        <nav aria-label='Navigation prototype variants' className={styles.switcher}>
          <button
            aria-label='Previous prototype'
            onClick={() => setVariant(variants[(currentIndex - 1 + variants.length) % variants.length]?.id ?? '1')}
            type='button'
          >
            ←
          </button>
          <div className={styles.switcherLabel}>
            <span>VARIANT {current.id} / {variants.length}</span>
            <strong>{current.name}</strong>
          </div>
          <div className={styles.variantPills}>
            {variants.map(variant => (
              <button
                aria-label={`Show ${variant.name}`}
                aria-pressed={variant.id === currentVariant}
                className={variant.id === currentVariant ? styles.variantPillActive : ''}
                key={variant.id}
                onClick={() => setVariant(variant.id)}
                type='button'
              >
                {variant.id}
              </button>
            ))}
          </div>
          <button
            aria-label='Next prototype'
            onClick={() => setVariant(variants[(currentIndex + 1) % variants.length]?.id ?? '1')}
            type='button'
          >
            →
          </button>
        </nav>
      ) : null}
    </div>
  )
}
