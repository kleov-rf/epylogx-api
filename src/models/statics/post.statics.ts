import { Schema } from 'mongoose'
import { minifiedISOString } from '../../helpers/adjust-input'
import { isMongoId, isValidMongoLatLong } from '../../helpers/input-validators'

const assignPostStatics = (postSchema: Schema) => {
  // Retrieve psot by ObjectId
  postSchema.statics.getOnePostByObjectId = async function (objectId: string) {
    // First we check if our parameter is a valid ObjectId
    const { isValid, reason } = isMongoId(objectId)
    if (!isValid) {
      throw new Error(reason)
    }

    // Then we execute our query by Id
    const post = await this.findById(objectId)

    // Before returning our data we must check if we're returning any user results
    if (!post) {
      throw new Error(
        `Couldn't find any post results with objectId ${objectId}`
      )
    }

    return post
  }

  // Get posts that has been uploaded since date
  postSchema.statics.getManyPostsSinceUpload = async function (date: Date) {
    // First we check that the date passed by parameter is not after current date
    if (date.getTime() > new Date().getTime()) {
      throw new Error(
        `Can't search posts since uploadDate '${date.toLocaleString}' because it's from the future`
      )
    }

    // Then we execute our query
    const posts = await this.find({
      uploadDate: { $gte: minifiedISOString(date) },
    })

    // Before returning our data we must check if we're returning any user results
    if (!posts) {
      throw new Error(
        `Couldn't find any post since uploadDate ${date.toLocaleDateString}`
      )
    }

    return posts
  }

  // Get posts that has been uploaded before date
  postSchema.statics.getManyPostsBeforeUpload = async function (date: Date) {
    // First we check that the date passed by parameter is not after current date
    if (date.getTime() > new Date().getTime()) {
      throw new Error(
        `Can't search posts before uploadDate '${date.toLocaleString}' hasn't passed (yet)`
      )
    }

    // Then we execute our query
    const posts = await this.find({
      uploadDate: { $lte: minifiedISOString(date) },
    })

    // Before returning our data we must check if we're returning any user results
    if (!posts) {
      throw new Error(
        `Couldn't find any post before uploadDate ${date.toLocaleDateString}`
      )
    }

    return posts
  }

  // Get posts that has been published since date
  postSchema.statics.getManyPostsSinceRelease = async function (date: Date) {
    // First we check that the date passed by parameter is not after current date
    if (date.getTime() > new Date().getTime()) {
      throw new Error(
        `Can't search posts since releaseDate '${date.toLocaleString}' because it's from the future`
      )
    }

    // Then we execute our query
    const posts = await this.find({
      releaseDate: { $gte: minifiedISOString(date) },
    })

    // Before returning our data we must check if we're returning any user results
    if (!posts) {
      throw new Error(
        `Couldn't find any post since releaseDate ${date.toLocaleDateString}`
      )
    }

    return posts
  }

  // Get posts that has been released before date
  postSchema.statics.getManyPostsBeforeRelease = async function (date: Date) {
    // First we check that the date passed by parameter is not after current date
    if (date.getTime() > new Date().getTime()) {
      throw new Error(
        `Can't search posts before releaseDate '${date.toLocaleString}' hasn't passed (yet)`
      )
    }

    // Then we execute our query
    const posts = await this.find({
      releaseDate: { $lte: minifiedISOString(date) },
    })

    // Before returning our data we must check if we're returning any user results
    if (!posts) {
      throw new Error(
        `Couldn't find any post before releaseDate ${date.toLocaleDateString}`
      )
    }

    return posts
  }

  // Get posts that has been uploaded near lon, lat
  postSchema.statics.getManyPostsNear = async function (
    longitude: Number,
    latitude: Number,
    maxRadius: Number = 1000
  ) {
    // First we check if our parameter is a valid ObjectId
    const { isValid, reason } = isValidMongoLatLong(longitude, latitude)
    if (!isValid) {
      throw new Error(reason)
    }

    // We try to execute our query
    const posts = this.find({
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

    // Before returning our data we must check if we're returning any user results
    if (!posts) {
      throw new Error(
        `Couldn't find any post near long: ${longitude}, lat: ${latitude}  `
      )
    }

    return posts
  }

  postSchema.statics.getAuthors = async function () {}
  postSchema.statics.getAllCategories = async function () {}
  postSchema.statics.getMainCategories = async function () {}
  postSchema.statics.getSubCategories = async function () {}
  postSchema.statics.getMainComments = async function () {}
  postSchema.statics.getAllComments = async function () {}
}

export default assignPostStatics
