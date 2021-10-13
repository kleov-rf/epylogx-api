interface storeOrderInterface {
  ticket: Array<{ item: string /* StoreItem.id */; units: number }>
  method: string /* 'card' | 'cash' */
  address: string
  state?: string /* 'pendant' | 'confirmed' | 'shipped' */
}

class storeOrder implements storeOrderInterface {
  ticket: { item: string /* StoreItem.id */; units: number }[]
  method: string
  address: string
  state: string = 'pendant'

  constructor(data: storeOrderInterface) {
    this.ticket = data.ticket
    this.method = data.method
    this.address = data.address
  }
}

export default storeOrder
