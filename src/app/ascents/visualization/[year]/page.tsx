export default async function Visualization(props: {
  params: Promise<{ year: string }>
}) {
  const { year: _year } = await props.params

  return <div>Coming soon</div>
}
