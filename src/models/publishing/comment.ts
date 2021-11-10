import { model, Schema } from 'mongoose'
import { assignCommentStatics } from '../statics'
import { commentInterface, commentModel } from './interfaces'

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

const Comment = model<commentInterface, commentModel>('Comment', CommentSchema, 'comments')

export default Comment
