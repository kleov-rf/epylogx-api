import { ESTALE } from 'constants'
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
    pictureURL: {
      type: String,
      default:
        'https://res.cloudinary.com/epylog/image/upload/v1637203709/defaultStoreItem_vs07iy.png',
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
  info,
  price,
  abovePrice,
  belowPrice,
  hasStock,
  isActive,
}: storeItemInterface) {
  const query = {}
  if (
    info &&
    info?.title &&
    validator.isAlphanumeric(info?.title, 'es-ES', { ignore: ' -_' })
  ) {
    const titleRegex = new RegExp(info?.title)
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
  if (hasStock != undefined) {
    if (hasStock) Object.assign(query, { stock: { $gt: 0 } })
    else Object.assign(query, { stock: { $eq: 0 } })
  }

  const storeItems = await this.find(query)

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
