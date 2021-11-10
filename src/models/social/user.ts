import { Schema, model } from 'mongoose'

import assignUserVirtuals from '../virtuals/user.virtuals'
import { assignUserStatics } from '../statics'
import { metaUserSchema } from '../abstracts'
import { userInterface, UserModel } from './interfaces'

const UserSchema = new Schema<userInterface>(
  {
    userId: {
      type: String,
      required: [true, 'userId is a required field'],
      unique: true,
    },
    pictureURL: String,
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
      cart: { type: [String], default: [] },
      wishlist: { type: [String], default: [] },
    },
    postsPreferences: {
      openedRecently: { type: [String], default: [] },
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
})

const User = model<userInterface, UserModel>('User', UserSchema, 'users')

export default User