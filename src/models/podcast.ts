import { isValidObjectId, model, Schema } from 'mongoose'
import validator from 'validator'
import { DescriptableInterface, DescriptableSchema } from './generic'

interface podcastInterface extends DescriptableInterface {
  podcastId: string
}

const PodcastSchema = new Schema<podcastInterface>(
  {
    podcastId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
).add(DescriptableSchema)

PodcastSchema.virtual('owners', {
  ref: 'UserPodcast',
  localField: '_id',
  foreignField: 'podcast',
})

interface podcastDataQuery {
  _id: string
  podcastId: string
  title: string
}

PodcastSchema.statics.getPodcasts = async function ({
  _id,
  podcastId,
  title,
}: podcastDataQuery) {
  const query = {}

  if (_id && isValidObjectId(_id)) {
    Object.assign(query, { _id })
  }
  if (podcastId && validator.isAlphanumeric(podcastId)) {
    const podcastIdRegex = new RegExp(podcastId)
    Object.assign(query, { podcastId: podcastIdRegex })
  }
  if (title && validator.isAlphanumeric(title, 'es-ES', { ignore: ' ' })) {
    const titleRegex = new RegExp(title)
    Object.assign(query, { 'info.title': titleRegex })
  }

  const podcasts = this.find(query)

  if (!podcasts) {
    throw new Error(`Couldn't find any podcasts results with data: ${query}`)
  }

  return podcasts
}

const Podcast = model('Podcast', PodcastSchema, 'podcasts')

export default Podcast
