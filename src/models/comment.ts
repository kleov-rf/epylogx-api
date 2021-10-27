import { model, Schema } from 'mongoose'
import assignCommentStatics from './statics/comment.statics'

interface commentInterface {
  author: string /* User.id */
  post: string
  text: string
  likes?: number
  superComment?: string /* Comment */
  isHidden?: boolean
}

const CommentSchema = new Schema<commentInterface>(
  {
    author: {
      type: String,
      required: true,
    },
    post: Schema.Types.ObjectId,
    text: {
      type: String,
      required: true,
    },
    likes: Number,
    superComment: Schema.Types.ObjectId,
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

assignCommentStatics(CommentSchema)

const Comment = model('Comment', CommentSchema, 'comments')

export default Comment
