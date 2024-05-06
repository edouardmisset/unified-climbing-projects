import { type SubmitHandler, useForm } from 'react-hook-form'
import './app.css'
import {
  BOULDER_GRADE_TO_NUMBER,
  ROUTE_GRADE_TO_NUMBER,
  type RouteGrade,
  convertGradeToNumber,
  convertNumberToGrade,
} from '~/helpers/converter'

const routeNumberGrades = [...ROUTE_GRADE_TO_NUMBER.values()]
const boulderNumberGrades = [...BOULDER_GRADE_TO_NUMBER.values()]

const ascentTypes = ['route', 'boulder'] as const
type AscentType = (typeof ascentTypes)[number]

type AscentDescription = {
  topoGrade: number
  name: string
  ascentType: AscentType
  tries: number
}

export default function Form() {
  const climberAverageGrade: RouteGrade = '7b'
  const climberHighestGrade: RouteGrade = '8b+'
  const climberHighestGradeNumber = convertGradeToNumber(climberHighestGrade)
  const numberOfGradeFromWarmUpToMax = 8

  const { register, handleSubmit, watch } = useForm<AscentDescription>({
    defaultValues: {
      name: '',
      topoGrade: convertGradeToNumber(climberAverageGrade),
      ascentType: 'route',
      tries: 1,
    },
  })
  const onSubmit: SubmitHandler<AscentDescription> = data => console.log(data)

  return (
    <form name="ascent" onSubmit={handleSubmit(onSubmit)}>
      <h1>Congrats 🎉</h1>

      {/* ROUTE NAME */}
      <label htmlFor="ascent-name">Ascent Name</label>
      <input type="text" id="ascent-name" {...register('name')} />

      {/* ROUTE OR BOULDER */}
      <label htmlFor="routeOrBoulder">Ascent Type</label>

      <label htmlFor="route">
        <input
          type="radio"
          id="route"
          value={'route'}
          {...register('ascentType')}
        />
        Route
      </label>

      <label htmlFor="boulder">
        <input
          type="radio"
          id="boulder"
          value={'boulder'}
          {...register('ascentType')}
        />
        Boulder
      </label>

      {/* TOPO GRADE */}
      <label htmlFor="topoGrade">
        Topo Grade
        <select {...register('topoGrade')}>
          {(watch('ascentType') === 'boulder'
            ? boulderNumberGrades
            : routeNumberGrades
          ).map(numberGrade => {
            const grade = convertNumberToGrade(numberGrade)
            return (
              <option value={numberGrade} key={numberGrade}>
                {watch('ascentType') === 'boulder'
                  ? grade.toLocaleUpperCase()
                  : grade}
              </option>
            )
          })}
        </select>
      </label>
      {/* TRIES */}
      <label htmlFor="tries">
        Tries
        <input type="number" id="tries" {...register('tries')} />
      </label>

      <input type="submit">Save</input>
    </form>
  )
}
