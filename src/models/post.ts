import { model, Schema } from 'mongoose'
import { DescriptableInterface, DescriptableSchema } from './generic'
import assignPostStatics from './statics/post.statics'
import assignPostVirtuals from './virtuals/post.virtuals'

interface postInterface extends DescriptableInterface {
  type: string /* 'pdf' | 'podcast' | 'art' | 'video' */
  authors: string[] /* User[] N:M */
  categories: {
    mains: string[] /* Category[] N:M */
    subs: string[] /* Category[] N:M */
  }
  social?: {
    comments: string[] /* Comment[] 1:N */
    commentsEnabled: boolean
    likes: number
  }
  stats?: {}
  uploadDate: Date
  releaseDate?: Date
  fileURL: string
  location?: {
    type: {
      type: String
      enum: ['Point']
      required: true
    }
    coordinates: {
      type: [Number]
      required: true
    }
  }
}

const PostSchema = new Schema<postInterface>(
  {
    type: {
      type: String,
      required: true,
      enum: ['article', 'picture', 'audio', 'video'],
    },
    social: {
      commentsEnabled: {
        type: Boolean,
        default: true,
      },
      likes: {
        type: Number,
        default: 0,
      },
    },
    uploadDate: Date,
    releaseDate: Date,
    fileURL: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
).add(DescriptableSchema)

assignPostVirtuals(PostSchema)

assignPostStatics(PostSchema)

PostSchema.index({
  'info.title': 1,
  uploadDate: 1,
})

const Post = model('Post', PostSchema, 'posts')

export default Post
