import { isValidObjectId, model, Schema } from 'mongoose'

interface authorshipInterface {
  author?: Schema.Types.ObjectId
  post?: Schema.Types.ObjectId
}

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
  if (author && isValidObjectId(author)) {
    Object.assign(query, { author })
  }
  if (post && isValidObjectId(post)) {
    Object.assign(query, { post })
  }

  const authorship = this.find(query)

  if (!authorship) {
    throw new Error(`Couldn't find any authorship results with data: ${query}`)
  }

  return authorship
}

const Authorship = model('Authorship', AuthorshipSchema, 'users_have_posts')
