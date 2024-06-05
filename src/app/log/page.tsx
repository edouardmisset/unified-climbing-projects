'use client'

import { useForm, type SubmitHandler } from 'react-hook-form'
import {
  ROUTE_GRADE_TO_NUMBER,
  convertGradeToNumber,
  convertNumberToGrade,
  type RouteGrade,
} from '~/helpers/converter'
import { GradeSlider } from '../_components/slider/slider'

type AscentDescription = {
  topoGrade: number
  routeName: string
  routeOrBoulder: 'route' | 'boulder'
  crag: string // pick from a look up in DB
  date: string // yyyy-mm-dd
  holds?: string // should be an enum : Jugs, crimps, pockets, slopers...
  height?: number // from 0 to 100 m
  rating?: number // from 0 to 5*
  profile?: string // should be an enum : Vertical, overhang, slab...
  comments?: string
}

export default function Log(): React.JSX.Element {
  const climberAverageGrade: RouteGrade = '7b'

  const defaultTopoGrade = convertGradeToNumber(climberAverageGrade)
  const now = new Date()
  const { handleSubmit, register, setValue, watch } =
    useForm<AscentDescription>({
      defaultValues: {
        topoGrade: defaultTopoGrade,
        date: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`,
        holds: 'crimps',
        routeOrBoulder: 'route',
        profile: 'vertical',
      },
    })

  const onSubmit: SubmitHandler<AscentDescription> = data => console.log(data)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ref: _ref, ...topoGradeRegister } = register('topoGrade')
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex-column">
        <h2 className="">Congrats 🎉</h2>
        <fieldset className="flex-column">
          The Basics
          <label htmlFor="date" className="flex-column">
            Date
            <input required {...register('date')} type="date" title="Date" />
          </label>
          <label htmlFor="routeName" className="flex-column">
            Route Name
            <input
              required
              id="routeName"
              autoComplete="off"
              {...register('routeName')}
              placeholder="The name of the route or boulder climbed"
              title="Route Name"
            />
          </label>
          <label htmlFor="routeName" className="flex-column">
            Route or Boulder
            <select
              id="routeOrBoulder"
              {...register('routeOrBoulder')}
              title="Route or Boulder"
            >
              <option value="route" defaultChecked>
                Route
              </option>
              <option value="boulder">Boulder</option>
            </select>
          </label>
          <label htmlFor="crag" className="flex-column">
            Crag
            <input
              required
              id="crag"
              {...register('crag')}
              placeholder="The name of the crag"
              title="Crag Name"
            />
          </label>
          <label htmlFor="topoGrade" className="">
            Topo Grade {convertNumberToGrade(watch('topoGrade'))}
            <GradeSlider
              {...topoGradeRegister}
              defaultValue={[defaultTopoGrade]}
              onValueChange={([value]) =>
                setValue('topoGrade', value ?? defaultTopoGrade)
              }
              min={1}
              max={ROUTE_GRADE_TO_NUMBER.size}
              step={1}
            />
          </label>
        </fieldset>
        The nitty gritty
        <fieldset className="flex-column">
          <label htmlFor="holds" className="flex-column">
            Holds
            <input
              {...register('holds')}
              type="text"
              name="holds"
              id="holds"
              placeholder="Hold types (crimps, jugs, underclings, pockets...)"
              title="Holds"
            />
          </label>
          <label htmlFor="profile" className="flex-column">
            profile
            <input
              {...register('profile')}
              type="text"
              name="profile"
              id="profile"
              placeholder="Route's profile (vertical, slab, overhang...)"
              title="profile"
            />
          </label>
          <label htmlFor="height" className="flex-column">
            Height
            <input
              {...register('height')}
              type="number"
              min={0}
              max={100}
              step={1}
              name="height"
              id="height"
              placeholder="Height of the route (no need for boulders)"
              title="height"
            />
          </label>
          <label htmlFor="rating" className="flex-column">
            Rating
            <input
              {...register('rating')}
              min={0}
              max={5}
              step={1}
              type="number"
              name="rating"
              id="rating"
              placeholder="/5*"
              title="rating"
            />
          </label>
          <label htmlFor="comments" className="flex-column">
            Comments
            <textarea
              {...register('comments')}
              name="comments"
              id="comments"
              placeholder="Feelings, partners, betas..."
              title="comments"
              autoComplete="off"
            />
          </label>
        </fieldset>
        <input type="submit" />
      </form>
    </div>
  )
}
