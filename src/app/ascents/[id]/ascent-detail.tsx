import { AscentCard } from '~/app/_components/ascent-card/ascent-card'
import { getAscentById } from '~/services/ascents'

type AscentDetailProps = {
  ascentId: string
}

export async function AscentDetail(props: AscentDetailProps) {
  const { ascentId } = props
  const ascent = await getAscentById(ascentId)

  if (!ascent) {
    return <p>Ascent not found</p>
  }

  return (
    <div className='superCenter w100 h100'>
      <AscentCard ascent={ascent} />
    </div>
  )
}
