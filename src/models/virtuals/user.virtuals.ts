import { Schema } from 'mongoose'

const assignUserVirtuals = (UserSchema: Schema) => {
  // -------- FOLLOWS --------
  // _id | follower | followed

  UserSchema.virtual('social.followers', {
    ref: 'Follow',
    localField: '_id',
    foreignField: 'followed',
  })

  UserSchema.virtual('social.following', {
    ref: 'Follow',
    localField: '_id',
    foreignField: 'follower',
  })

  // -------- CATEGORY INTEREST --------
  // _id | interested | category

  UserSchema.virtual('postsPreferences.interests', {
    ref: 'UserInterest',
    localField: '_id',
    foreignField: 'interested',
  })

  // -------- POSTS SAVED --------
  // _id | user | post

  UserSchema.virtual('postsPreferences.saved', {
    ref: 'UserSavedPost',
    localField: '_id',
    foreignField: 'user',
  })

  // -------- POSTS LIKED --------
  // _id | user | post

  UserSchema.virtual('postsPreferences.liked', {
    ref: 'UserLikedPost',
    localField: '_id',
    foreignField: 'user',
  })

  // -------- AUTHORSHIP --------
  // _id | author | post

  UserSchema.virtual('posts', {
    ref: 'Authorship',
    localField: '_id',
    foreignField: 'author',
  })

  // -------- PODCASTS OWNERS --------
  // _id | owner | podcast

  UserSchema.virtual('podcasts', {
    ref: 'UserPodcast',
    localField: '_id',
    foreignField: 'owner',
  })
}

export default assignUserVirtuals
