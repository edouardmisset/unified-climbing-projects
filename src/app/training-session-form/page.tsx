import { redirect } from 'next/navigation'
import { LINKS } from '~/constants/links'

export default function LegacyTrainingSessionFormPage(): never {
  redirect(LINKS.log)
}
