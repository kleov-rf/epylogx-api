import { Descriptable } from '../generic_interfaces'
import Stats from '../social/stats.model'

interface postInterface extends Descriptable {
  type: string /* 'pdf' | 'podcast' | 'art' | 'video' */
  authors: string[] /* User[] */
  categories: {
    mains: string[] /* Category[] */
    subs: string[] /* Category[] */
  }
  social?: {
    comments: string[] /* Comment[] */
    commentsEnabled: boolean
    likes: number
  }
  stats?: Stats
  uploadDate: Date
  releaseDate?: Date
  fileURL: string
  location?: string
}

const DEFAULT_POST_PICTURE = ""

class Post implements postInterface {
  type: string
  authors: string[]
  categories: { mains: string[]; subs: string[] }
  social: { comments: []; commentsEnabled: true; likes: 0 }
  stats: Stats = new Stats
  uploadDate: Date
  releaseDate: Date
  fileURL: string
  location: string = ''
  info: { title: string; description: string }
  pictureURL: string
  isActive: boolean = true

  constructor (data: postInterface) {
    this.type = data.type
    this.authors = data.authors
    this.categories = data.categories
    this.uploadDate = data.uploadDate
    this.releaseDate = data.releaseDate ?? data.uploadDate
    this.fileURL = data.fileURL
    this.info = data.info
    this.pictureURL = data.pictureURL ?? DEFAULT_POST_PICTURE
  }
}

export { Post, postInterface }

