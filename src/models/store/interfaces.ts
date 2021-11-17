import { Model, Schema } from 'mongoose'
import { DescriptableInterface } from '../interfaces'

interface storeItemInterface extends DescriptableInterface {
  price?: number
  stock?: number
  belowPrice?: number
  abovePrice?: number
  hasStock?: number
}

interface StoreItemModel extends Model<storeItemInterface> {
  getStoreItems(data: storeItemInterface): any
  getStoreItem(data: { id: string }): any
}

interface storeOrderItemInterface {
  storeOrder?: string
  storeItem?: string
}

interface StoreOrderItemModel extends Model<storeOrderItemInterface> {
  getOrdersItems(data: storeOrderItemInterface): any
}

interface storeOrderInterface {
  _id?: string
  ticket?: Array<{ item: string /* StoreItem.id */; units: number }>
  method?: string /* 'card' | 'cash' */
  address?: string
  purchasedDate?: Date
  state?: string /* 'pendant' | 'confirmed' | 'shipped' */
}

interface StoreOrderModel extends Model<storeOrderInterface> {
  getStoreOrders(data: storeOrderDataQuery): any
}

interface storeOrderDataQuery extends storeOrderInterface {
  hasItem: string
  beforeDate: Date
  afterDate: Date
}

interface userStoreOrderInterface {
  order?: string
  purchaser?: string
}

interface UserStoreOrderModel extends Model<userStoreOrderInterface> {
  getUserStoreOrders(data: userStoreOrderInterface): any
}

export {
  storeItemInterface,
  storeOrderInterface,
  storeOrderItemInterface,
  storeOrderDataQuery,
  StoreItemModel,
  StoreOrderItemModel,
  StoreOrderModel,
  userStoreOrderInterface,
  UserStoreOrderModel,
}
