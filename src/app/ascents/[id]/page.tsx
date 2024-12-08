import { createAscentTooltip } from '~/helpers/tooltips'
import { api } from '~/trpc/server'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const isError = (data: any): data is { error: string } => {
  return 'error' in data
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  const data = await api.ascents.getById({ id: Number(id) })

  if (isError(data)) {
    return <div>Not found</div>
  }

  return (
    <div>
      <h1>{data?.routeName}</h1>
      {createAscentTooltip(data, { showDetails: true })
        .split('\n')
        .filter(line => line !== '')
        .map(line => (
          <p key={line}>{line}</p>
        ))}
    </div>
  )
}
