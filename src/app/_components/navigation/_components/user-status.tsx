import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs'

export function UserStatus({ userNameClassName }: { userNameClassName: string }) {
  const { user } = useUser()
  return (
    <>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton /> <span className={`ellipsis ${userNameClassName}`}>{user?.fullName}</span>
      </SignedIn>
    </>
  )
}
