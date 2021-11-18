import { Model, Schema } from 'mongoose'
import { AudiovisualInterface } from '../../interfaces'
import { postInterface } from '../interfaces'

interface articleInterface extends postInterface {
  pages: number
}

interface articleInterfaceModel extends Model<articleInterface> {}

interface pictureInterface extends postInterface {
  techInfo?: Object
}

interface pictureInterfaceModel extends Model<pictureInterface> {}

interface audioInterface extends postInterface, AudiovisualInterface {
  podcast: Schema.Types.ObjectId
}

interface audioInterfaceModel extends Model<audioInterface> {}

interface videoInterface extends postInterface, AudiovisualInterface {
  fileFormat: string
}

interface videoInterfaceModel extends Model<videoInterface> {}

interface postTypeInterface {
  name: string
  allowedExtensions: string[]
  isActive: boolean
}

interface postTypeModel extends Model<postTypeInterface> {
  getPostTypes(data: { isActive?: boolean }): any
  getPostType(data: { id: string }): any
}

export {
  articleInterface,
  pictureInterface,
  audioInterface,
  videoInterface,
  articleInterfaceModel,
  pictureInterfaceModel,
  audioInterfaceModel,
  videoInterfaceModel,
  postTypeInterface,
  postTypeModel,
}
