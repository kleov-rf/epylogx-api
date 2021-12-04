import { isValidObjectId, model, Schema } from 'mongoose'
import validator from 'validator'
import { authorshipInterface, authorshipModel } from './interfaces'

const AuthorshipSchema = new Schema<authorshipInterface>(
  {
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    post: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
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

  const authorship = await this.find(query)

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
