import { Schema, model } from 'mongoose'
import { metaUserInterface, metaUserSchema } from './generic'
import assignUserStatics from './statics/user.statics'
import assignUserVirtuals from './virtuals/user.virtuals'

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

const UserSchema = new Schema<userInterface>(
  {
    userId: {
      type: String,
      required: [true, 'userId is a required field'],
      unique: true,
    },
    pictureURL: 'URLFOTOUSER',
    social: {
      networks: [
        {
          icon: String,
          text: String,
        },
      ],
      location: String,
    },
    store: {
      cart: [String],
      wishlist: [String],
    },
    postsPreferences: {
      openedRecently: [String],
      mobileDataLoad: {
        type: Boolean,
        default: false,
      },
    },
    customization: {
      themeColor: String,
      bgPictureURL: String,
      pictureColor: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
).add(metaUserSchema)

assignUserVirtuals(UserSchema)

assignUserStatics(UserSchema)

UserSchema.index({
  userId: 1,
  givenName: 1,
  fullName: 1,
})

const User = model('User', UserSchema, 'users')

export default User
