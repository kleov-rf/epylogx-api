import { Schema, model } from 'mongoose'
import { metaUserInterface, metaUserSchema } from './generic'
import assignAdminStatics from './statics/admin.statics'

interface adminInterface extends metaUserInterface {
  adminId: string
  roles: {
    userManage?: boolean
    adminManage?: boolean
    postManage?: boolean
    categoryManage?: boolean
    storeManage?: boolean
  }
  superAdmin: Schema.Types.ObjectId
}

const AdminSchema = new Schema<adminInterface>({
  adminId: {
    type: String,
    required: [true, 'adminId is a required field'],
    unique: true,
  },
  roles: {
    userManage: {
      type: Boolean,
      default: false,
    },
    adminManage: {
      type: Boolean,
      default: false,
    },
    postManage: {
      type: Boolean,
      default: false,
    },
    categoryManage: {
      type: Boolean,
      default: false,
    },
    storeManage: {
      type: Boolean,
      default: false,
    },
  },
  pictureURL: {
    type: String,
    default: 'URLFOTOADMIN',
  },
  superAdmin: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
  },
  // Before closing our Schema we add our main class: metaUser
}).add(metaUserSchema)

assignAdminStatics(AdminSchema)

AdminSchema.index({ adminId: 1, superAdmin: 1 }, { unique: true })

const Admin = model('Admin', AdminSchema, 'admins')

export default Admin
