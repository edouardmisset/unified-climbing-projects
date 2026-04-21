import Link from 'next/link'

import { LINKS } from '~/shared/constants/links'

export default function NotFound() {
  return (
    <div className='h100 w100 flexColumn justifyCenter alignCenter'>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href={LINKS.home}>Return Home</Link>
    </div>
  )
}
