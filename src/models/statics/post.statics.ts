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
      .populate('type')
      .populate({
        path: 'authors',
        populate: { path: 'author', select: '-store -postsPreferences' },
      })
      .populate({
        path: 'categories',
        populate: { path: 'category', populate: 'ISCED superCategory' },
      })

    if (!post) {
      throw new Error(
        `Couldn't find any post with data ${JSON.stringify(query)}`
      )
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
    isActive,
    isApproved,
  }: postDataQuery) {
    const query = {}

    if (type && validator.isMongoId(type)) {
      Object.assign(query, { type })
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

    if (isActive != undefined) {
      Object.assign(query, { isActive })
    }
    if (isApproved != undefined) {
      Object.assign(query, { isApproved })
    }

    const posts = await this.find(query)
      .populate('type')
      .populate({
        path: 'authors',
        populate: { path: 'author', select: '-store -postsPreferences' },
      })
      .populate({
        path: 'categories',
        populate: { path: 'category', populate: 'ISCED superCategory' },
      })

    if (!posts) {
      throw new Error(`Couldn't find any post with data: ${query}`)
    }

    return posts
  }
}

export default assignPostStatics
