import { isValidObjectId, model, Schema } from 'mongoose'

interface followInterface {
  follower?: Schema.Types.ObjectId
  followed?: Schema.Types.ObjectId
  notify?: boolean
}

const FollowSchema = new Schema<followInterface>(
  {
    follower: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    followed: {
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

FollowSchema.statics.getFollows = async function ({follower, followed, notify}: followInterface) {
  const query = {}
  if(follower && isValidObjectId(follower)) {
    Object.assign(query, {follower})
  }
  if(followed && isValidObjectId(followed)) {
    Object.assign(query, {followed})
  }
  if(notify != undefined) {
    Object.assign(query, {notify})
  }

  const follows = this.find(query)

  if (!follows) {
    throw new Error(
      `Couldn't find any follows results with data: ${query}`
    )
  }

  return follows
}

const Follow = model('Follow', FollowSchema, 'users_follow_users')

export default Follow
