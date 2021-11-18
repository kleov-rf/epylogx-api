import { isValidObjectId, model, Schema } from 'mongoose'
import validator from 'validator'
import { userPodcastInterface, UserPodcastModel } from './interfaces'

const UserPodcastSchema = new Schema<userPodcastInterface>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    podcast: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Podcast'
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

  if (owner && validator.isMongoId(owner)) {
    Object.assign(query, { owner })
  }
  if (podcast && validator.isMongoId(podcast)) {
    Object.assign(query, { podcast })
  }

  const usersPodcast = await this.find(query)

  if (!usersPodcast) {
    throw new Error(
      `Couldn't find any usersPodcast results with data: ${query}`
    )
  }

  return usersPodcast
}

const UserPodcast = model<userPodcastInterface, UserPodcastModel>(
  'UserPodcast',
  UserPodcastSchema,
  'users_have_podcasts'
)

export default UserPodcast
