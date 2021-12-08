import { model, Schema } from 'mongoose'
import { DescriptableSchema } from '../abstracts'
import { assignPostStatics } from '../statics'
import assignPostVirtuals from '../virtuals/post.virtuals'
import { postInterface, postModel } from './interfaces'

const PostSchema = new Schema<postInterface>(
  {
    type: {
      type: Schema.Types.ObjectId,
      ref: 'PostType',
    },
    commentsEnabled: {
      type: Boolean,
      default: true,
    },
    uploadDate: Date,
    releaseDate: Date,
    fileURL: String,
    previewImgURL: {
      type: String,
      default:
        'https://res.cloudinary.com/epylog/image/upload/v1637203709/defaultPost_yjpolu.png',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
).add(DescriptableSchema)

assignPostVirtuals(PostSchema)

assignPostStatics(PostSchema)

PostSchema.index({
  uploadDate: 1,
})

const Post = model<postInterface, postModel>('Post', PostSchema, 'posts')

export { Post, PostSchema }
