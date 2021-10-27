import { isValidObjectId, model, Schema } from 'mongoose'

interface userSavesPostInterface {
  user?: Schema.Types.ObjectId
  post?: Schema.Types.ObjectId
}

const UserSavesPostSchema = new Schema<userSavesPostInterface>(
  {
    user: { type: Schema.Types.ObjectId, required: true },
    post: { type: Schema.Types.ObjectId, required: true },
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

  if (user && isValidObjectId(user)) {
    Object.assign(query, { user })
  }
  if (post && isValidObjectId(post)) {
    Object.assign(query, { post })
  }

  const userSavedPosts = this.find(query)

  if (!userSavedPosts) {
    throw new Error(
      `Couldn't find any userSavedPosts results with data: ${query}`
    )
  }

  return userSavedPosts
}

const UserSavedPost = model(
  'UserSavedPost',
  UserSavesPostSchema,
  'users_save_posts'
)

export default UserSavedPost
