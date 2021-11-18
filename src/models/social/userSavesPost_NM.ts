import { isValidObjectId, model, Schema } from 'mongoose'
import validator from 'validator'
import { userSavesPostInterface, UserSavesPostModel } from './interfaces'

const UserSavesPostSchema = new Schema<userSavesPostInterface>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    post: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    _id: true,
  }
)

UserSavesPostSchema.statics.getUsersSavedPosts = async function ({
  user,
  post,
}: userSavesPostInterface) {
  const query = {}

  if (user && validator.isMongoId(user)) {
    Object.assign(query, { user })
  }
  if (post && validator.isMongoId(post)) {
    Object.assign(query, { post })
  }

  const userSavedPosts = await this.find(query)

  if (!userSavedPosts) {
    throw new Error(
      `Couldn't find any userSavedPosts results with data: ${query}`
    )
  }

  return userSavedPosts
}

const UserSavedPost = model<userSavesPostInterface, UserSavesPostModel>(
  'UserSavedPost',
  UserSavesPostSchema,
  'users_save_posts'
)

export default UserSavedPost
