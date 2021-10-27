import { isValidObjectId, model, Schema } from 'mongoose'
import validator from 'validator'
import { minifiedISOString } from '../helpers/adjust-input'

interface storeOrderInterface {
  _id?: Schema.Types.ObjectId
  ticket?: Array<{ item: string /* StoreItem.id */; units: number }>
  method?: string /* 'card' | 'cash' */
  address?: string
  purchasedDate?: Date
  state?: string /* 'pendant' | 'confirmed' | 'shipped' */
}

const storeOrderSchema = new Schema<storeOrderInterface>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    ticket: {
      type: [
        {
          item: Schema.Types.ObjectId,
          units: Number,
        },
      ],
      required: true,
    },
    method: {
      type: String,
      required: true,
      enum: ['card', 'cash'],
    },
    address: {
      type: String,
      required: true,
    },
    purchasedDate: {
      type: Date,
      required: true,
    },
    state: {
      type: String,
      required: true,
      enum: ['pendant', 'confirmed', 'shipped'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

interface storeOrderDataQuery extends storeOrderInterface {
  hasItem: Schema.Types.ObjectId
  beforeDate: Date
  afterDate: Date
}

storeOrderSchema.statics.getStoreOrders = async function ({
  _id,
  hasItem,
  method,
  purchasedDate,
  beforeDate,
  afterDate,
  state,
}: storeOrderDataQuery) {
  const query = {}

  if (_id && isValidObjectId(_id)) {
    Object.assign(query, { _id })
  }
  if (hasItem && isValidObjectId(hasItem)) {
    Object.assign(query, { ticket: { item: hasItem } })
  }
  if (method && validator.isIn(method, ['card', 'cash'])) {
    Object.assign(query, { method })
  }
  if (purchasedDate) {
    Object.assign(query, { purchasedDate: minifiedISOString(purchasedDate) })
  }
  if (beforeDate) {
    Object.assign(query, {
      purchasedDate: { $lte: minifiedISOString(beforeDate) },
    })
  }
  if (afterDate) {
    Object.assign(query, {
      purchasedDate: { $gte: minifiedISOString(afterDate) },
    })
  }
  if (state && validator.isIn(state, ['pendant', 'confirmed', 'shipped'])) {
    Object.assign(query, { state })
  }

  const storeOrders = this.find(query)

  if (!storeOrders) {
    throw new Error(`Couldn't find any storeOrders results with data: ${query}`)
  }

  return storeOrders
}

const StoreOrder = model('StoreOrder', storeOrderSchema, 'storeOrders')

export default StoreOrder
