interface statsInterface {
  visits: number
  visitsPerWeek: number
}

class Stats implements statsInterface {
  constructor () {}
  visits: number = 0
  visitsPerWeek: number = 0
}

export default Stats