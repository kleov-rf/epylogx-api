import { model, Schema } from 'mongoose'
import validator from 'validator'
import { userStoreOrderInterface, UserStoreOrderModel } from './interfaces'

const userStoreOrderSchema = new Schema<userStoreOrderInterface>({
  order: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'StoreOrder',
  },
  purchaser: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
})

userStoreOrderSchema.statics.getUserOrders = async function ({
  order,
  purchaser,
}: userStoreOrderInterface) {
  const query = {}
  if (order && validator.isMongoId(order)) {
    Object.assign(query, { order })
  }
  if (purchaser && validator.isMongoId(purchaser)) {
    Object.assign(query, { purchaser })
  }

  const userOrders = await this.find(query)

  if (!userOrders) {
    throw new Error(`Couldn't find any userOrders results with data: ${query}`)
  }

  return userOrders
}

const UserStoreOrder = model<userStoreOrderInterface, UserStoreOrderModel>(
  'UserStoreOrder',
  userStoreOrderSchema,
  'users_have_storeOrders'
)

export default UserStoreOrder
