import Link from 'next/link'
import type { ReactNode } from 'react'
import { PublicPageShell } from '../public-page-shell/public-page-shell'
import styles from '../../legal.module.css'

type LegalSection = {
  body: ReactNode
  heading: string
}

type LegalContact = {
  body: ReactNode
  eyebrow: string
  title: string
}

type LegalPageProps = {
  contact: LegalContact
  eyebrow: string
  sections: readonly LegalSection[]
  title: string
  titleContinuation: string
  updated: ReactNode
}

export function LegalPage({
  contact,
  eyebrow,
  sections,
  title,
  titleContinuation,
  updated,
}: LegalPageProps) {
  return (
    <PublicPageShell layout='prose'>
      <article className={`${styles.article} glassPanel`}>
        <header className={styles.articleHeader}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          <p className={styles.titleContinuation}>{titleContinuation}</p>
          <p>{updated}</p>
        </header>
        {sections.map((section, index) => (
          <section key={section.heading}>
            <span aria-hidden='true' className={styles.number}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h2>{section.heading}</h2>
              {section.body}
            </div>
          </section>
        ))}
        <aside className={styles.contact}>
          <p className={styles.eyebrow}>{contact.eyebrow}</p>
          <h2>{contact.title}</h2>
          {contact.body}
        </aside>
        <Link className={styles.backLink} href='/'>
          ← Return home
        </Link>
      </article>
    </PublicPageShell>
  )
}
