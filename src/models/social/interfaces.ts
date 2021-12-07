import { Model, Schema } from 'mongoose'
import { metaUserInterface } from '../interfaces'
import { entriesDataQuery, usersDataQuery } from '../statics/interfaces'

interface chatEntryInterface {
  transmitter: Schema.Types.ObjectId /* User */
  text: string
  receiver: Schema.Types.ObjectId /* User */
  sentDate: Date
  isLiked?: boolean
  isHidden: boolean
  isEdited: boolean
}

interface ChatEntryModel extends Model<chatEntryInterface> {
  getRecentChatsToId(metaUserId: string, days: number): any
  getEntries(data: entriesDataQuery): any
}

interface followInterface {
  follower?: string
  followed?: string
  notify?: boolean
}

interface FollowModel extends Model<followInterface> {
  getFollows(data: followInterface): any
}

interface userInterface extends metaUserInterface {
  userId: string
  social?: {
    networks: Array<{ icon: string; text: string }>
    location: string
    // followers: User[] - N:M
    // following: User[] - N:M
    // toNotify: User[] - N:M
  }
  store?: {
    cart: string[] /* StoreItem[] */
    wishlist: string[] /* StoreItem[] */
    // history: storeOrder[] N:M
  }
  postsPreferences?: {
    openedRecently: string[] /* Post[] */ /* Máx 5 Posts */
    mobileDataLoad: boolean
    // interests: Category[] - N:M
    // saved?: Post[] - N:M
    // liked?: Post[] - N:M
  }
  customization?: {
    themeColor: string
    bgPictureURL: string
    pictureColor: string
  }
  // posts: Post[] - N:M
  // podcasts: Podcast [] - N:M
  stats?: {} /* Stats */
}

interface UserModel extends Model<userInterface> {
  getUser(data: usersDataQuery): any
  getUsers(data: usersDataQuery): any
}

interface userInterestsInterface {
  interested?: string
  category?: string
}

interface UserInterestModel extends Model<userInterestsInterface> {
  getUserInterests(data: userInterestsInterface): any
}

interface userLikesPost {
  user?: string
  post?: string
}

interface UserLikesPostModel extends Model<userLikesPost> {
  getUserLikedPosts(data: userLikesPost): any
}

interface userPodcastInterface {
  owner?: string
  podcast?: string
}

interface UserPodcastModel extends Model<userPodcastInterface> {
  getUsersPodcasts(data: userPodcastInterface): any
}

interface userSavesPostInterface {
  user?: string
  post?: string
}

interface UserSavesPostModel extends Model<userSavesPostInterface> {
  getUsersSavedPosts(data: userSavesPostInterface): any
}

export {
  chatEntryInterface,
  followInterface,
  userInterface,
  userInterestsInterface,
  userLikesPost,
  userPodcastInterface,
  userSavesPostInterface,
  ChatEntryModel,
  FollowModel,
  UserModel,
  UserInterestModel,
  UserLikesPostModel,
  UserPodcastModel,
  UserSavesPostModel,
}
