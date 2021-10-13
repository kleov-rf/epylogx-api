import { Audiovisual } from '../../generic_interfaces'
import { Post, postInterface } from '../post.model'

interface videoInterface extends postInterface, Audiovisual {
  fileFormat: string
}

class Video extends Post implements videoInterface {
  fileFormat: string
  file_length: number
  timestamps: { time: number; title: string }[] = []
  quality: string
  constructor(data: videoInterface) {
    super(data)
    this.fileFormat = data.fileFormat
    this.file_length = data.file_length
    this.quality = data.quality
  }
}

export default Video
