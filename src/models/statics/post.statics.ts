import { isValidObjectId, Schema } from 'mongoose'
import validator from 'validator'
import { isValidMongoLatLong } from '../../helpers/input-validators'
import { postDataQuery } from './interfaces'

const assignPostStatics = (postSchema: Schema) => {
  postSchema.statics.getPost = async function ({ id }: postDataQuery) {
    const query = {}
    if (id && validator.isMongoId(id)) {
      Object.assign(query, { _id: id })
    }

    const post = await this.findOne(query)

    if (!post) {
      throw new Error(`Couldn't find any post with data ${query}`)
    }

    return post
  }

  postSchema.statics.getPosts = async function ({
    type,
    title,
    sinceUpload,
    beforeUpload,
    sinceRelease,
    beforeRelease,
    coords,
  }: postDataQuery) {
    const types = ['article', 'picture', 'audio', 'video']
    const query = {}

    if (type && validator.isAlpha(type) && validator.isIn(type, types)) {
      Object.assign(query, { type: type })
    }

    if (title && validator.isAlphanumeric(title, 'es-ES', { ignore: ' -' })) {
      const regexTitle = new RegExp(title)
      Object.assign(query, { 'info.title': regexTitle })
    }

    if (sinceUpload && validator.isISO8601(sinceUpload)) {
      Object.assign(query, { uploadDate: { $gte: sinceUpload } })
    }

    if (beforeUpload && validator.isISO8601(beforeUpload)) {
      Object.assign(query, { uploadDate: { $lte: beforeUpload } })
    }

    if (sinceRelease && validator.isISO8601(sinceRelease)) {
      Object.assign(query, { releaseDate: { $gte: sinceRelease } })
    }

    if (beforeRelease && validator.isISO8601(beforeRelease)) {
      Object.assign(query, { releaseDate: { $lte: beforeRelease } })
    }

    if (
      coords &&
      isValidMongoLatLong(coords.longitude, coords.latitude).isValid
    ) {
      const { longitude, latitude, maxRadius = 1000 } = coords
      Object.assign(query, {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: maxRadius,
          },
        },
      })
    }

    const posts = await this.find(query)

    if (!posts) {
      throw new Error(`Couldn't find any post with data: ${query}`)
    }

    return posts
  }
}

export default assignPostStatics
