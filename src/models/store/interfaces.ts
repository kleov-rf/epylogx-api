import { Model, Schema } from 'mongoose'
import { DescriptableInterface } from '../interfaces'

interface storeItemInterface extends DescriptableInterface {
  price?: number
  belowPrice?: number
  abovePrice?: number
}

interface StoreItemModel extends Model<storeItemInterface> {
  getStoreItems(data: storeItemInterface): any
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

export {
  storeItemInterface,
  storeOrderInterface,
  storeOrderItemInterface,
  storeOrderDataQuery,
  StoreItemModel,
  StoreOrderItemModel,
  StoreOrderModel,
}
