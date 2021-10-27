import { Moment } from 'moment'

const minifiedISOString = (date: Date | Moment) => {
  return date.toISOString().split('T')[0]
}

export { minifiedISOString }
