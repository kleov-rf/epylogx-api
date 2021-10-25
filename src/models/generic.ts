import { Schema } from 'mongoose'

/* -------- DESCRIPTABLE -------- */

interface DescriptableInterface {
  info: {
    title: string
    description: string
  }
  pictureURL?: string
  isActive?: boolean
}

// We create our Descriptable Schema so we can use
// inheritance on Mongoose Schema metaUser, Category,
// Podcast, Post and StoreItem definitions.

const DescriptableSchema = new Schema<DescriptableInterface>({
  info: {
    title: {
      type: String,
      unique: true,
    },
    description: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
})

/* -------- METAUSER -------- */

interface metaUserInterface extends DescriptableInterface {
  givenName: string
  familyName: string
  email: string
  password: string
  birthDate: Date
}

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
    },
    password: {
      type: String,
      unique: true,
    },
    birthDate: Date,
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

interface AudiovisualInterface {
  file_length: number
  timestamps?: Array<{ time: number; title: string }>
  quality: string
}

// We create our Audiovisal Schema so we can use
// inheritance on Mongoose Schema Audio and Video
// Post definitions.

const AudioVisualSchema = new Schema<AudiovisualInterface>({
  file_length: Number,
  timestamps: [{ time: Number, title: String }],
  quality: String,
})

export {
  DescriptableInterface,
  DescriptableSchema,
  metaUserSchema,
  metaUserInterface,
  AudioVisualSchema,
  AudiovisualInterface,
}
