import { Link } from 'next-view-transitions'

export default function NotFound() {
  return (
    <div className="h100 w100 flex-column justify-center align-center">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}
