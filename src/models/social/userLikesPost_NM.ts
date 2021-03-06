import { isValidObjectId, model, Schema } from 'mongoose'
import validator from 'validator'
import { userLikesPost, UserLikesPostModel } from './interfaces'

const UserLikesPostSchema = new Schema<userLikesPost>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    post: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Post'
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

UserLikesPostSchema.statics.getUserLikedPosts = async function ({
  user,
  post,
}: userLikesPost) {
  const query = {}
  if (user && validator.isMongoId(user)) {
    Object.assign(query, { user })
  }
  if (post && validator.isMongoId(post)) {
    Object.assign(query, { post })
  }

  const userLikedPosts = await this.find(query)

  if (!userLikedPosts) {
    throw new Error(
      `Couldn't find any userLikedPosts results with data: ${query}`
    )
  }

  return userLikedPosts
}

const UserLikedPost = model<userLikesPost, UserLikesPostModel>(
  'UserLikedPost',
  UserLikesPostSchema,
  'users_like_posts'
)

export default UserLikedPost
