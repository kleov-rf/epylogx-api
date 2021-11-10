import { model, Schema } from 'mongoose'
import { PostSchema } from '../post'
import { pictureInterface, pictureInterfaceModel } from './interfaces'

const PictureSchema = new Schema<pictureInterface>(
  {
    techInfo: {
      type: Object,
      default: {},
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
).add(PostSchema)

const Picture = model<pictureInterface, pictureInterfaceModel>(
  'Picture',
  PictureSchema,
  'posts'
)

export default Picture
