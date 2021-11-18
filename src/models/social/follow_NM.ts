import { isValidObjectId, model, Schema } from 'mongoose'
import validator from 'validator'
import { followInterface, FollowModel } from './interfaces'

const FollowSchema = new Schema<followInterface>(
  {
    follower: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    followed: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    notify: Boolean,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    _id: false,
  }
)

FollowSchema.statics.getFollows = async function ({
  follower,
  followed,
  notify,
}: followInterface) {
  const query = {}
  if (follower && validator.isMongoId(follower)) {
    Object.assign(query, { follower })
  }
  if (followed && validator.isMongoId(followed)) {
    Object.assign(query, { followed })
  }
  if (notify != undefined) {
    Object.assign(query, { notify })
  }

  const follows = await this.find(query)

  if (!follows) {
    throw new Error(`Couldn't find any follows results with data: ${query}`)
  }

  return follows
}

const Follow = model<followInterface, FollowModel>(
  'Follow',
  FollowSchema,
  'users_follow_users'
)

export default Follow
