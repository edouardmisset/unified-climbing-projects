import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/privacy',
  '/terms',
  '/sign-in(.*)',
  '/sign-up(.*)',
  ...(process.env.NODE_ENV === 'development' ? ['/skeleton-catalog'] : []),
  // Blank CSV templates for the (auth-required) import flow. Listed
  // explicitly here rather than via a blanket file-extension bypass in
  // `config.matcher`, so a future protected route that happens to end in
  // `.csv`/`.zip`/etc. isn't silently skipped by the middleware.
  '/templates(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) await auth.protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and static assets, unless found in search params.
    // Intentionally narrow: only genuine static-asset extensions are exempt
    // from auth. Do not add document/archive extensions (csv, zip, docx,
    // xlsx, ...) here — any current or future route serving those needs its
    // own explicit entry in `isPublicRoute` above so auth isn't bypassed by
    // accident.
    // oxlint-disable-next-line unicorn/prefer-string-raw
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|webmanifest)).*)',
    // Always run for API routes
    '/api(.*)',
  ],
}
