import { Schema } from 'mongoose'
import {
  AudiovisualInterface,
  DescriptableInterface,
  metaUserInterface,
} from './interfaces'

/* -------- DESCRIPTABLE -------- */

// We create our Descriptable Schema so we can use
// inheritance on Mongoose Schema metaUser, Category,
// Podcast, Post and StoreItem definitions.

const DescriptableSchema = new Schema<DescriptableInterface>({
  info: {
    title: {
      type: String,
      default: '',
    },
    description: { type: String, default: '' },
  },
  pictureURL: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
})

/* -------- METAUSER -------- */

// We create our metaUser Schema so we can use
// inheritance on Mongoose Schema User and Admin
// definitions.

const metaUserSchema = new Schema<metaUserInterface>(
  {
    givenName: {
      type: String,
      required: [true, 'First name is a required field'],
    },
    familyName: {
      type: String,
      required: [true, 'Last name is a required field'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'email is required'],
    },
    password: {
      type: String,
      required: [true, 'password is required'],
    },
    birthDate: Date,
    googleSignIn: Boolean,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
).add(DescriptableSchema)

// Then we assign to our Schema the virtual field
// of fullName so we can retrieve both given and
// family names.

metaUserSchema.virtual('fullName').get(function (this: metaUserInterface) {
  return `${this.givenName} ${this.familyName}`
})

/* -------- AUDIOVISUAL -------- */

// We create our Audiovisal Schema so we can use
// inheritance on Mongoose Schema Audio and Video
// Post definitions.

const AudioVisualSchema = new Schema<AudiovisualInterface>({
  file_length: Number,
  timestamps: [{ time: Number, title: String }],
  quality: String,
})

export { DescriptableSchema, metaUserSchema, AudioVisualSchema }
