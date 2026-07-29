import { notFound } from 'next/navigation'
import { SkeletonCatalog } from './skeleton-catalog'

export default async function SkeletonCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>
}) {
  if (process.env.NODE_ENV !== 'development') notFound()
  const awaitedSearchParams = await searchParams

  return <SkeletonCatalog preview={awaitedSearchParams.preview === 'true'} />
}
