import { model, Schema } from 'mongoose'
import validator from 'validator'
import { postTypeInterface, postTypeModel } from './interfaces'

const postTypeSchema = new Schema<postTypeInterface>(
  {
    name: {
      type: String,
      required: true,
    },
    allowedExtensions: {
      type: [String],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

postTypeSchema.statics.getPostTypes = async function ({ isActive }) {
  const query = {}

  if (isActive != undefined) {
    Object.assign(query, { isActive })
  }

  const postTypes = await this.find(query)

  return postTypes
}

postTypeSchema.statics.getPostType = async function ({ id }) {
  const query = {}

  if (id && validator.isMongoId(id)) {
    Object.assign(query, { _id: id })
  }

  const postTypes = await this.findOne(query)

  return postTypes
}

const PostType = model<postTypeInterface, postTypeModel>(
  'PostType',
  postTypeSchema,
  'postTypes'
)

export default PostType
