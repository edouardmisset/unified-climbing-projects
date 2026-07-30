import { redirect } from 'next/navigation'
import { LINKS } from '~/constants/links'

export default function LegacyAscentFormPage(): never {
  redirect(LINKS.log)
}
