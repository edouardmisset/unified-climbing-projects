export default async function Visualization(props: {
  params: Promise<{ year: string }>
}) {
  const params = await props.params

  const { year: _year } = params

  return <div>Coming soon</div>
}
