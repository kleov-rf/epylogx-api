import { isValidObjectId, model, Schema } from 'mongoose'
import validator from 'validator'
import { authorshipInterface, authorshipModel } from './interfaces'

const AuthorshipSchema = new Schema<authorshipInterface>(
  {
    author: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    _id: false,
  }
)

AuthorshipSchema.statics.getAuthorships = async function ({
  author,
  post,
}: authorshipInterface) {
  const query = {}
  if (author && validator.isMongoId(author)) {
    Object.assign(query, { author })
  }
  if (post && validator.isMongoId(post)) {
    Object.assign(query, { post })
  }

  const authorship = this.find(query)

  if (!authorship) {
    throw new Error(`Couldn't find any authorship results with data: ${query}`)
  }

  return authorship
}

const Authorship = model<authorshipInterface, authorshipModel>(
  'Authorship',
  AuthorshipSchema,
  'users_have_posts'
)

export default Authorship