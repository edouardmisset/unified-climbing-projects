export default async function AscentCalendar(props: {
  params: Promise<{ year: string }>
}) {
  const { year: _year } = await props.params

  return <div>Coming soon</div>
}
