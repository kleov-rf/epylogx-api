import { isValidObjectId, model, Schema } from 'mongoose'

interface userPodcastInterface {
  owner?: Schema.Types.ObjectId
  podcast?: Schema.Types.ObjectId
}

const UserPodcastSchema = new Schema<userPodcastInterface>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    podcast: {
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

UserPodcastSchema.statics.getUsersPodcasts = async function ({
  owner,
  podcast,
}: userPodcastInterface) {
  const query = {}

  if(owner && isValidObjectId(owner)) {
    Object.assign(query, {owner})
  }
  if(podcast && isValidObjectId(podcast)) {
    Object.assign(query, {podcast})
  }

  const usersPodcast = this.find(query)

  if (!usersPodcast) {
    throw new Error(
      `Couldn't find any usersPodcast results with data: ${query}`
    )
  }

  return usersPodcast
}

const UserPodcast = model(
  'UserPodcast',
  UserPodcastSchema,
  'users_have_podcasts'
)

export default UserPodcast
