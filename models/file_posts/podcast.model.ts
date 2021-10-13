import { Descriptable } from '../generic_interfaces'

interface podcastInterface extends Descriptable {
  owners: string[] /* User[] */
}

const DEFAULT_PODCAST_PICTURE = ''

class Podcast implements podcastInterface {
  owners: string[]
  info: { title: string; description: string }
  pictureURL: string
  isActive: boolean = true

  constructor(data: podcastInterface) {
    this.owners = data.owners
    this.info = data.info
    this.pictureURL = data.pictureURL ?? DEFAULT_PODCAST_PICTURE
  }
}

export default Podcast
