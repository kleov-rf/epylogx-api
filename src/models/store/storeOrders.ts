import { isValidObjectId, model, Schema } from 'mongoose'
import validator from 'validator'
import { minifiedISOString } from '../../helpers/adjust-input'
import {
  storeOrderDataQuery,
  storeOrderInterface,
  StoreOrderModel,
} from './interfaces'

const storeOrderSchema = new Schema<storeOrderInterface>(
  {
    purchaser: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
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
      default: 'pendant',
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

storeOrderSchema.virtual('ticket', {
  ref: 'StoreOrderItem',
  localField: '_id',
  foreignField: 'storeOrder',
})

storeOrderSchema.statics.getStoreOrder = async function ({ id }) {
  const query = {}

  if (id && validator.isMongoId(id)) {
    Object.assign(query, { _id: id })
  }

  const storeOrder = await this.findOne(query).populate('purchaser').populate({
    path: 'ticket',
    populate: 'storeItem',
  })

  return storeOrder
}

storeOrderSchema.statics.getStoreOrders = async function ({
  purchaser,
  hasItem,
  method,
  purchasedDate,
  beforeDate,
  afterDate,
  state,
  isActive,
}: storeOrderDataQuery) {
  const query = {}

  if (purchaser && validator.isMongoId(purchaser)) {
    Object.assign(query, { purchaser })
  }
  if (hasItem && validator.isMongoId(hasItem)) {
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
  if (isActive != undefined) {
    Object.assign(query, { isActive })
  }

  const storeOrders = await this.find(query).populate('ticket')

  if (!storeOrders) {
    throw new Error(`Couldn't find any storeOrders results with data: ${query}`)
  }

  return storeOrders
}

const StoreOrder = model<storeOrderInterface, StoreOrderModel>(
  'StoreOrder',
  storeOrderSchema,
  'storeOrders'
)

export default StoreOrder
