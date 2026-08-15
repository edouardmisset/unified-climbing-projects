import {
  ArrowRight,
  BarChart3,
  Check,
  CloudDownload,
  FileText,
  LockKeyhole,
  Mountain,
  Upload,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import styles from '../designs.module.css'

const designs = ['1', '2', '3', '4', '5'] as const

const designNames = {
  '1': 'Alpine editorial',
  '2': 'Topo lines',
  '3': 'Data at altitude',
  '4': 'Field journal',
  '5': 'Sunset glass',
} as const

type Design = (typeof designs)[number]

export function generateStaticParams() {
  return designs.map(design => ({ design }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { design } = await params

  return designs.includes(design as Design)
    ? { title: `Design ${design} · ${designNames[design as Design]}` }
    : {}
}

export default async function DesignPage({ params }: PageProps) {
  const { design } = await params

  if (!designs.includes(design as Design)) notFound()

  const activeDesign = design as Design

  return (
    <div className={styles.canvas} data-design={activeDesign}>
      <header className={styles.header}>
        <Link className={styles.brand} href='/'>
          <Mountain aria-hidden='true' />
          <span>Climbing Log</span>
          <small>Beta</small>
        </Link>
        <nav aria-label='Preview sections' className={styles.primaryNav}>
          <a href='#features'>Features</a>
          <a href='#settings'>Settings</a>
          <a href='#terms'>Terms</a>
        </nav>
        <Link className={styles.headerAction} href='/sign-in'>
          Sign in
        </Link>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Private climbing journal · Invitation only</p>
            <h1>Every climb tells a story. Keep yours.</h1>
            <p className={styles.lede}>
              One considered home for your ascents, training and seasons outside—private by default,
              portable forever, and designed for reflection.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryAction} href='/sign-in'>
                Open your log <ArrowRight aria-hidden='true' />
              </Link>
              <a className={styles.textAction} href='mailto:edouardmisset@gmail.com'>
                Request access
              </a>
            </div>
            <p className={styles.trust}>
              <LockKeyhole aria-hidden='true' /> Your records remain yours.
            </p>
          </div>

          <div aria-label='Example climbing season summary' className={styles.heroVisual}>
            <div className={styles.visualTopline}>
              <span>2026 season</span>
              <span>Updated today</span>
            </div>
            <strong className={styles.bigNumber}>128</strong>
            <span className={styles.bigNumberLabel}>ascents recorded</span>
            <div className={styles.mountainGraphic} aria-hidden='true'>
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <dl className={styles.metrics}>
              <div>
                <dt>Days out</dt>
                <dd>42</dd>
              </div>
              <div>
                <dt>Vertical</dt>
                <dd>6.8 km</dd>
              </div>
              <div>
                <dt>Top grade</dt>
                <dd>7c+</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className={styles.features} id='features'>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Made for the long view</p>
            <h2>Less admin. More perspective.</h2>
          </div>
          <div className={styles.featureGrid}>
            <article>
              <LockKeyhole aria-hidden='true' />
<span aria-hidden='true'>01</span>
              <h3>Private by default</h3>
              <p>Every operation is scoped to your signed-in identity.</p>
            </article>
            <article>
              <CloudDownload aria-hidden='true' />
              <span>02</span>
              <h3>Always portable</h3>
              <p>Import canonical CSV files and export clean copies at any time.</p>
            </article>
            <article>
              <BarChart3 aria-hidden='true' />
              <span>03</span>
              <h3>Built for reflection</h3>
              <p>See calendars, indicators and yearly wrap-ups come to life.</p>
            </article>
          </div>
        </section>

        <section className={styles.settings} id='settings'>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Settings</p>
            <h2>Your data, clearly managed.</h2>
            <p>Simple controls and plain-language explanations keep every action understandable.</p>
          </div>
          <div className={styles.settingsCards}>
            <article>
              <div className={styles.cardIcon}>
                <Upload aria-hidden='true' />
              </div>
              <div>
                <p className={styles.kicker}>Bring your history</p>
                <h3>Import climbing data</h3>
                <p>
                  Files are parsed in your browser. Preview every record before anything is saved.
                </p>
              </div>
              <button type='button'>
                Choose a file <ArrowRight aria-hidden='true' />
              </button>
            </article>
            <article>
              <div className={styles.cardIcon}>
                <CloudDownload aria-hidden='true' />
              </div>
              <div>
                <p className={styles.kicker}>Keep a copy</p>
                <h3>Export your log</h3>
                <p>Download complete, readable CSV or JSON files without internal identifiers.</p>
              </div>
              <button type='button'>
                Export data <ArrowRight aria-hidden='true' />
              </button>
            </article>
          </div>
        </section>

        <section className={styles.terms} id='terms'>
          <aside>
            <FileText aria-hidden='true' />
            <p className={styles.eyebrow}>The essentials</p>
            <h2>
              Beta terms,
              <br />
              without the fog.
            </h2>
          </aside>
          <div className={styles.termsCopy}>
            <h3>What you should know</h3>
            <ul>
              <li>
                <Check aria-hidden='true' />
                <span>
                  <strong>Keep your exports.</strong> This is a beta and the service may change.
                </span>
              </li>
              <li>
                <Check aria-hidden='true' />
                <span>
                  <strong>Only import your data.</strong> You remain responsible for the records you
                  add.
                </span>
              </li>
              <li>
                <Check aria-hidden='true' />
                <span>
                  <strong>Climb kindly.</strong> Abuse or attempts to access another account will
                  remove access.
                </span>
              </li>
            </ul>
            <a href='mailto:edouardmisset@gmail.com'>
              Questions? Talk to a human <ArrowRight aria-hidden='true' />
            </a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>Climbing Log · Restricted beta</span>
        <nav aria-label='Design previews'>
          {designs.map(item => (
            <Link
              aria-current={item === activeDesign ? 'page' : undefined}
              href={`/designs/${item}`}
              key={item}
            >
              <span>{item}</span>
              <small>{designNames[item]}</small>
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  )
}

type PageProps = { params: Promise<{ design: string }> }
