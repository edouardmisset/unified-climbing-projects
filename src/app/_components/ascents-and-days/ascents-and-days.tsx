export async function AscentsAndDays({
  numberOfAscents,
  numberOfDays,
}: {
  numberOfAscents: number
  numberOfDays: number
}) {
  return (
    <>
      {numberOfAscents} ascents over {numberOfDays} days
    </>
  )
}
