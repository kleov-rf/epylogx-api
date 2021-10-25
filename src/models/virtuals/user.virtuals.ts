import { Schema } from 'mongoose'

const assignUserVirtuals = (UserSchema: Schema) => {
  // -------- FOLLOWS --------
  // _id | follower | followed

  UserSchema.virtual('social.followers', {
    ref: 'Follows',
    localField: '_id',
    foreignField: 'followed',
  })

  UserSchema.virtual('social.following', {
    ref: 'Follows',
    localField: '_id',
    foreignField: 'follower',
  })

  // -------- NOTIFICATIONS --------
  // _id | notified | notifier

  UserSchema.virtual('social.toNotify', {
    ref: 'Notifications',
    localField: '_id',
    foreignField: 'notified',
  })

  // -------- SHOP HISTORY --------
  // _id | customer (user) | storeOrder

  UserSchema.virtual('store.history', {
    ref: 'ShopHistory',
    localField: '_id',
    foreignField: 'customer',
  })

  // -------- CATEGORY INTEREST --------
  // _id | interested | category

  UserSchema.virtual('postsPreferences.interests', {
    ref: 'CategoryInterests',
    localField: '_id',
    foreignField: 'interested',
  })

  // -------- POSTS SAVED --------
  // _id | user | post

  UserSchema.virtual('postsPreferences.saved', {
    ref: 'PostsSaved',
    localField: '_id',
    foreignField: 'user',
  })

  // -------- POSTS LIKED --------
  // _id | user | post

  UserSchema.virtual('postsPreferences.liked', {
    ref: 'PostsLiked',
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
    ref: 'PodcastsOwners',
    localField: '_id',
    foreignField: 'owner',
  })
}

export default assignUserVirtuals
