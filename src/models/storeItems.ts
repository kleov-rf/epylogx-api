import { model, Schema } from 'mongoose'
import validator from 'validator'
import { DescriptableInterface, DescriptableSchema } from './generic'

interface storeItemInterface extends DescriptableInterface {
  price?: number
  belowPrice?: number
  abovePrice?: number
}

const StoreItemSchema = new Schema<storeItemInterface>(
  {
    price: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
).add(DescriptableSchema)

StoreItemSchema.statics.getStoreItems = async function ({
  info: { title },
  price,
  abovePrice,
  belowPrice,
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

  const storeItems = this.find(query)

  if (!storeItems) {
    throw new Error(`Couldn't find any storeItems results with data: ${query}`)
  }

  return storeItems
}

const StoreItem = model('StoreItem', StoreItemSchema, 'storeItems')

export default StoreItem
