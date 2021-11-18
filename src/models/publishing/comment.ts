import { model, Schema } from 'mongoose'
import { assignCommentStatics } from '../statics'
import { commentInterface, commentModel } from './interfaces'

const CommentSchema = new Schema<commentInterface>(
  {
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    text: {
      type: String,
      required: true,
    },
    likes: Number,
    superComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
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

const Comment = model<commentInterface, commentModel>(
  'Comment',
  CommentSchema,
  'comments'
)

export default Comment
