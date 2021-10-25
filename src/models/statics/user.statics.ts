import { Schema } from 'mongoose'
import { DEFAULT_RESULTS_LIMIT } from '../../database/config'
import {
  isMongoId,
  isSafeString,
  isValidEmail,
} from '../../helpers/input-validators'

const assignUserStatics = (userSchema: Schema) => {
  // Retrieve user by ObjectId
  userSchema.statics.getOneUserByObjectId = async function (objectId: string) {
    // First we check if our parameter is a valid ObjectId
    const { isValid, reason } = isMongoId(objectId)
    if (!isValid) {
      throw new Error(reason)
    }

    // Then we execute our query by Id
    const user = await this.findById(objectId)

    // Before returning our data we must check if we're returning any user results
    if (!user) {
      throw new Error(
        `Couldn't find any user results with objectId ${objectId}`
      )
    }

    return user
  }

  // Retrieve an user by its entire email
  userSchema.statics.getOneUserByUserId = async function (userId: string) {
    // First we test our String
    const { isValid, reason } = isSafeString(userId)
    if (!isValid) {
      throw new Error(reason)
    }

    // And then we use our literal for our query
    const user = await this.findOne({ userId })

    // Before returning our data we must check if we're returning any user results
    if (!user) {
      throw new Error(`Couldn't find any user results with userId ${userId}`)
    }

    return user
  }

  // Retrieve users list by userId
  userSchema.statics.getManyUsersByUserId = async function (userId: string) {
    // First we test our String
    const { isValid, reason } = isSafeString(userId)
    if (!isValid) {
      throw new Error(reason)
    }

    // Then we create our regex
    const userIdRegex = new RegExp(`${userId}`, 'i')

    // And then we use our previous regex for our query
    const users = await this.find({
      userId: userIdRegex,
      isActive: true,
    }).limit(DEFAULT_RESULTS_LIMIT)

    // Before returning our data we must check if we're returning any user results
    if (users.length == 0) {
      throw new Error(`Couldn't find any user results with userId ${userId}`)
    }

    return users
  }

  // Retrieve an user by its entire email
  userSchema.statics.getOneUserByEmail = async function (email: string) {
    // First we test our String
    const { isValid, reason } = isValidEmail(email)
    if (!isValid) {
      throw new Error(reason)
    }

    // And then we use our literal for our query
    const user = await this.findOne({ email })

    // Before returning our data we must check if we're returning any user results
    if (!user) {
      throw new Error(`Couldn't find any user results with email ${email}`)
    }

    return user
  }

  // Retrieve users by a portion of an email
  userSchema.statics.getManyUsersByEmail = async function (email: string) {
    // First we test our String
    const { isValid, reason } = isSafeString(email)
    if (!isValid) {
      throw new Error(reason)
    }

    // Then we create our regex
    const emailRegex = new RegExp(`${email}`, 'i')

    // And then we use our previous regex for our query
    const users = await this.find({ email: emailRegex, isActive: true }).limit(
      DEFAULT_RESULTS_LIMIT
    )

    // Before returning our data we must check if we're returning any user results
    if (users.length == 0) {
      throw new Error(`Couldn't find any user results with email ${email}`)
    }

    return users
  }

  // Retrieve users whose given or family name matches a String
  userSchema.statics.getManyUsersByName = async function (name: string) {
    // First we test our String
    const { isValid, reason } = isSafeString(name)
    if (!isValid) {
      throw new Error(reason)
    }

    // Then we create our regex
    const nameRegex = new RegExp(`${name}`, 'i')

    // And then we use our previous regex for our query
    const users = await this.find({
      fullName: nameRegex,
      isActive: true,
    }).limit(DEFAULT_RESULTS_LIMIT)

    // Before returning our data we must check if we're returning any user results
    if (users.length == 0) {
      throw new Error(`Couldn't find any user results with name ${name}`)
    }

    return users
  }

  userSchema.statics.getFollowers = async function () {}
  userSchema.statics.getFollowing = async function () {}
  userSchema.statics.getFollowNotify = async function () {}
  userSchema.statics.getStoreHistory = async function () {}
  userSchema.statics.getCategoryInterests = async function () {}
  userSchema.statics.getSavedPosts = async function () {}
  userSchema.statics.getLikedPosts = async function () {}
  userSchema.statics.getPosts = async function () {}
  userSchema.statics.getPodcasts = async function () {}
}

export default assignUserStatics
