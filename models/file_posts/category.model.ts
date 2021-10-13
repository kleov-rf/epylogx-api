import { Descriptable } from '../generic_interfaces'
import Stats from '../social/stats.model'

interface categoryInterface extends Descriptable {
  ISCED: {
    level: number
    description: string
  }
  superCategory?: string /* Category */
  stats?: Stats
}

const DEFAULT_CATEGORY_PICTURE = ''

class Category implements categoryInterface {
  constructor(data: categoryInterface) {
    this.ISCED = data.ISCED
    this.superCategory = data.superCategory ?? this.toString()
    this.info = data.info
    this.pictureURL = data.pictureURL ?? DEFAULT_CATEGORY_PICTURE
  }
  ISCED: { level: number; description: string }
  superCategory: string
  stats: Stats = new Stats()
  info: { title: string; description: string }
  pictureURL: string
  isActive: boolean = true
}

export default Category
