import { isValidObjectId, model, Schema } from 'mongoose'
import validator from 'validator'
import { storeOrderItemInterface, StoreOrderItemModel } from './interfaces'

const StoreOrderItemSchema = new Schema<storeOrderItemInterface>(
  {
    storeOrder: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    storeItem: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    _id: false,
  }
)

StoreOrderItemSchema.statics.getOrdersItems = async function ({
  storeOrder,
  storeItem,
}: storeOrderItemInterface) {
  const query = {}
  if (storeOrder && validator.isMongoId(storeOrder)) {
    Object.assign(query, { storeOrder })
  }
  if (storeItem && validator.isMongoId(storeItem)) {
    Object.assign(query, { storeItem })
  }

  const ordersItems = this.find(query)

  if (!ordersItems) {
    throw new Error(`Couldn't find any orderItems results with data: ${query}`)
  }

  return ordersItems
}

const StoreOrderItem = model<storeOrderItemInterface, StoreOrderItemModel>(
  'StoreOrderItem',
  StoreOrderItemSchema,
  'storeOrders_have_storeItems'
)

export default StoreOrderItem
