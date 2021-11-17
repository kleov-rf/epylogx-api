import { isValidObjectId, model, Schema } from 'mongoose'
import validator from 'validator'
import { DescriptableSchema } from '../abstracts'
import { podcastDataQuery, podcastInterface, podcastModel } from './interfaces'

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

PodcastSchema.statics.getPodcast = async function ({ id }) {
  const query = {}

  if (id && validator.isMongoId(id)) {
    Object.assign(query, { _id: id })
  }

  const podcast = await this.findOne(query)

  if (!podcast) {
    throw new Error(`Couldn't find any podcast results with data: ${query}`)
  }

  return podcast
}

PodcastSchema.statics.getPodcasts = async function ({
  podcastId,
  title,
}: podcastDataQuery) {
  const query = {}

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

const Podcast = model<podcastInterface, podcastModel>(
  'Podcast',
  PodcastSchema,
  'podcasts'
)

export default Podcast
