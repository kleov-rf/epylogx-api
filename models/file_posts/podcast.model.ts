import { Descriptable } from '../generic_interfaces'

interface podcastInterface extends Descriptable {
  podcastId: string
  owners: string[] /* User[] */
  // podcastAudios: PodcastAudios[] - N:M
}

const DEFAULT_PODCAST_PICTURE = ''

class Podcast implements podcastInterface {
  podcastId: string
  owners: string[]
  info: { title: string; description: string }
  pictureURL: string
  isActive: boolean = true

  constructor(data: podcastInterface) {
    this.podcastId = data.podcastId
    this.owners = data.owners
    this.info = data.info
    this.pictureURL = data.pictureURL ?? DEFAULT_PODCAST_PICTURE
  }
}

export default Podcast
