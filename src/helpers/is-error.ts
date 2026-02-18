import type { CustomError } from '~/schema/generic'

export const isError = <T>(data: CustomError | T): data is CustomError =>
  typeof data === 'object' && data !== null && 'error' in data && data.error !== undefined
