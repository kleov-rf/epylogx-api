import { model, Schema } from 'mongoose'
import validator from 'validator'
import { DescriptableSchema } from '../abstracts'
import { storeItemInterface, StoreItemModel } from './interfaces'

const StoreItemSchema = new Schema<storeItemInterface>(
  {
    price: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
).add(DescriptableSchema)

StoreItemSchema.statics.getStoreItem = async function ({ id }) {
  const query = {}

  if (id && validator.isMongoId(id)) {
    Object.assign(query, { _id: id })
  }

  const storeItem = await this.findOne(query)

  if (!storeItem) {
    throw new Error(`Couldn't find any storeItems results with data: ${query}`)
  }

  return storeItem
}

StoreItemSchema.statics.getStoreItems = async function ({
  info: { title },
  price,
  abovePrice,
  belowPrice,
  hasStock,
  isActive,
}: storeItemInterface) {
  const query = {}
  if (title && validator.isAlphanumeric(title, 'es-ES', { ignore: ' -_' })) {
    const titleRegex = new RegExp(title)
    Object.assign(query, { 'info.title': titleRegex })
  }
  if (price) {
    Object.assign(query, { price: { $eq: price } })
  }
  if (belowPrice) {
    Object.assign(query, { price: { $lt: price } })
  }
  if (abovePrice) {
    Object.assign(query, { price: { $gt: price } })
  }
  if (isActive != undefined) {
    Object.assign(query, { isActive })
  }
  if (hasStock) {
    Object.assign(query, { stock: { $gt: 0 } })
  }
  if (!hasStock) {
    Object.assign(query, { stock: { $eq: 0 } })
  }

  const storeItems = this.find(query)

  if (!storeItems) {
    throw new Error(`Couldn't find any storeItems results with data: ${query}`)
  }

  return storeItems
}

const StoreItem = model<storeItemInterface, StoreItemModel>(
  'StoreItem',
  StoreItemSchema,
  'storeItems'
)

export default StoreItem
