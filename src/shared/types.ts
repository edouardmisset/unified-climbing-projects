/** A date string in ISO format */
export type StringDate = { date: string }

export type Object_<T = unknown> = Record<string, T>

export type ValueAndLabel = {
  label: string
  value: string
}
