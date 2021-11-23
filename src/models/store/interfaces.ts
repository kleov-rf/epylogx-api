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
  purchaser?: Schema.Types.ObjectId
  ticket?: Array<{
    item: Schema.Types.ObjectId /* StoreItem.id */
    units: number
  }>
  method?: string /* 'card' | 'cash' */
  address?: string
  purchasedDate?: Date
  state?: string /* 'pendant' | 'confirmed' | 'shipped' */
}

interface StoreOrderModel extends Model<storeOrderInterface> {
  getStoreOrder(data: { id: string }): any
  getStoreOrders(data: storeOrderDataQuery): any
}

interface storeOrderDataQuery {
  hasItem?: string
  beforeDate?: Date
  afterDate?: Date
  purchaser?: string
  ticket?: Array<{
    item: string /* StoreItem.id */
    units: number
  }>
  method?: string /* 'card' | 'cash' */
  address?: string
  purchasedDate?: Date
  state?: string /* 'pendant' | 'confirmed' | 'shipped' */
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
