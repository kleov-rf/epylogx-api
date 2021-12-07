import { Request, Response } from 'express'
import { StoreItem, StoreOrder, StoreOrderItem } from '../models'

const getStoreItems = async (req: Request, res: Response) => {
  const { info, price, abovePrice, belowPrice, hasStock, isActive } = <any>(
    req.query
  )

  const query = {}

  if (info) {
    const { title } = info
    Object.assign(query, { info: { title } })
  }
  if (price) {
    Object.assign(query, { price })
  }
  if (abovePrice) {
    Object.assign(query, { abovePrice })
  }
  if (belowPrice) {
    Object.assign(query, { belowPrice })
  }
  if (hasStock != undefined) {
    Object.assign(query, { hasStock })
  }
  if (isActive != undefined) {
    Object.assign(query, { isActive })
  }

  const storeItems = await StoreItem.getStoreItems(<any>query)

  return res.json(storeItems)
}

const getStoreItem = async (req: Request, res: Response) => {
  const { id } = req.params

  const storeItem = await StoreItem.getStoreItem({ id })

  return res.json(storeItem)
}

const createStoreItem = async (req: Request, res: Response) => {
  const {
    info: { title, description },
    price,
    stock,
  } = req.body

  const data = {
    info: {
      title,
      description,
    },
    price: Number(price),
    stock: Number(stock),
  }

  const newStoreItem = new StoreItem(data)

  await newStoreItem.save()

  return res.json(newStoreItem)
}

const modifyStoreItem = async (req: Request, res: Response) => {
  const { id } = req.params
  const {
    info: { title, description },
    price,
    stock,
    isActive,
  } = req.body

  const data = {}

  if (title) {
    Object.assign(data, { 'info.title': title })
  }
  if (description) {
    Object.assign(data, { 'info.description': description })
  }
  if (price) {
    Object.assign(data, { price })
  }
  if (stock) {
    Object.assign(data, { stock })
  }
  if (isActive != undefined) {
    Object.assign(data, { isActive })
  }

  console.log(data)

  const modifiedStoreItem = await StoreItem.findByIdAndUpdate(id, data, {
    new: true,
  })

  return res.json(modifiedStoreItem)
}

const deleteStoreItem = async (req: Request, res: Response) => {
  const { id } = req.params

  const oldStoreItem = await StoreItem.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  )

  return res.json(oldStoreItem)
}

const getStoreOrders = async (req: Request, res: Response) => {
  const {
    purchaser,
    hasItem,
    method,
    purchasedDate,
    beforeDate,
    afterDate,
    state,
    isActive,
  } = req.query

  const query = {}

  if (purchaser) {
    Object.assign(query, { purchaser })
  }
  if (hasItem) {
    Object.assign(query, { hasItem })
  }
  if (method) {
    Object.assign(query, { method })
  }
  if (purchasedDate) {
    Object.assign(query, { purchasedDate })
  }
  if (beforeDate) {
    Object.assign(query, { beforeDate })
  }
  if (afterDate) {
    Object.assign(query, { afterDate })
  }
  if (state) {
    Object.assign(query, { state })
  }
  if (isActive != undefined) {
    Object.assign(query, { isActive })
  }

  const storeOrders = await StoreOrder.getStoreOrders(query)

  return res.json(storeOrders)
}

const getStoreOrder = async (req: Request, res: Response) => {
  const { id } = req.params

  const storeOrder = await StoreOrder.getStoreOrder({ id })

  return res.json(storeOrder)
}

const createStoreOrder = async (req: Request, res: Response) => {
  const { id } = req.params
  const { ticket, method, address, purchasedDate, state } = req.body

  const data = { purchaser: id, method, address, purchasedDate, state }

  const newStoreOrder = new StoreOrder(data)

  await newStoreOrder.save()

  await ticket.forEach(async ({ storeItem, units }: any) => {
    const { stock } = await StoreItem.getStoreItem({ id: storeItem })
    if (stock >= units) {
      await StoreItem.findByIdAndUpdate(storeItem, { stock: stock - units })

      const data = {
        storeOrder: newStoreOrder._id.toString(),
        storeItem,
        units,
      }

      const newStoreOrderItem = new StoreOrderItem(data)
      await newStoreOrderItem.save()
    }
  })

  return res.json(newStoreOrder)
}

const modifyStoreOrder = async (req: Request, res: Response) => {
  const { id } = req.params
  const { state } = req.body

  const modifiedStoreOrder = await StoreOrder.findByIdAndUpdate(
    id,
    { state },
    { new: true }
  )

  return res.json(modifiedStoreOrder)
}

const deleteStoreOrder = async (req: Request, res: Response) => {
  const { id } = req.params

  const oldStoreOrder = await StoreOrder.findByIdAndUpdate(id, {
    isActive: false,
  }).populate('ticket')

  if ((<any>oldStoreOrder).isActive) {
    await (<any>oldStoreOrder).ticket.forEach(
      async ({ storeItem, units }: any) => {
        const { stock: oldStock } = await StoreItem.getStoreItem({
          id: storeItem.toString(),
        })
        await StoreItem.findByIdAndUpdate(storeItem, {
          stock: oldStock + units,
        })
      }
    )
  }

  Object.assign(oldStoreOrder, { isActive: false })

  return res.json(oldStoreOrder)
}

export {
  getStoreItem,
  getStoreItems,
  getStoreOrder,
  getStoreOrders,
  modifyStoreItem,
  modifyStoreOrder,
  createStoreItem,
  createStoreOrder,
  deleteStoreItem,
  deleteStoreOrder,
}
