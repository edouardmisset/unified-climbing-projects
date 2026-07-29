import { LINKS } from '~/constants/links'
import { Link } from '../link/link'
import { SignInButton } from '../sign-in-button/sign-in-button'

export function UnauthorizedAccess() {
  return (
    <section className='flexColumn gap justifyCenter alignCenter h100'>
      <h2>Unauthorized</h2>
      <p>You need to be signed in to log a training session.</p>
      <SignInButton />
      <p>
        Go{' '}
        <Link className='link' href={LINKS.home}>
          <strong>home</strong>
        </Link>
      </p>
    </section>
  )
}
