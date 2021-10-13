import { Descriptable } from '../generic_interfaces'

interface storeItemInterface extends Descriptable {
  price: number
}

const DEFAULT_ITEMSTORE_PROFILE_PIC = ''

class StoreItem implements storeItemInterface {
  price: number
  info: { title: string; description: string }
  pictureURL: string
  isActive: boolean = true
  
  constructor(data: storeItemInterface) {
    this.price = data.price
    this.info = data.info
    this.pictureURL = data.pictureURL ?? DEFAULT_ITEMSTORE_PROFILE_PIC
  }
}

export default StoreItem
