import { isValidObjectId, model, Schema } from 'mongoose'

interface userLikesPost {
  user?: Schema.Types.ObjectId
  post?: Schema.Types.ObjectId
}

const UserLikesPostSchema = new Schema<userLikesPost>(
  {
    user: {
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

UserLikesPostSchema.statics.getUserLikedPosts = async function ({
  user,
  post,
}: userLikesPost) {
  const query = {}
  if (user && isValidObjectId(user)) {
    Object.assign(query, { user })
  }
  if (post && isValidObjectId(post)) {
    Object.assign(query, { post })
  }

  const userLikedPosts = this.find(query)

  if (!userLikedPosts) {
    throw new Error(
      `Couldn't find any userLikedPosts results with data: ${query}`
    )
  }

  return userLikedPosts
}

const UserLikedPost = model(
  'UserLikedPost',
  UserLikesPostSchema,
  'users_like_posts'
)

export default UserLikedPost
