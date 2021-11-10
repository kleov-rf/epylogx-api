import { model, Schema } from 'mongoose'
import { DescriptableSchema } from '../abstracts'
import { assignPostStatics } from '../statics'
import assignPostVirtuals from '../virtuals/post.virtuals'
import { postInterface, postModel } from './interfaces'

const PostSchema = new Schema<postInterface>(
  {
    type: {
      type: Schema.Types.ObjectId,
      ref: 'PostTypes',
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

const Post = model<postInterface, postModel>('Post', PostSchema, 'posts')

export { Post, PostSchema }