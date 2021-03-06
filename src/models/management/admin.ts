import { Schema, model } from 'mongoose'
import { metaUserSchema } from '../abstracts'
import { assignAdminStatics } from '../statics'
import { adminInterface, AdminModel } from './interfaces'

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
    podcastManage: {
      type: Boolean,
      default: false,
    },
    storeOrdersManage: {
      type: Boolean,
      default: false,
    },
    iscedManage: {
      type: Boolean,
      default: false,
    },
    postTypeManage: {
      type: Boolean,
      default: false,
    },
  },
  superAdmin: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
  },
  pictureURL: {
    type: String,
    default:
      'https://res.cloudinary.com/epylog/image/upload/v1637202959/defaultAdmin_u4a3i2.png',
  },
  // Before closing our Schema we add our main class: metaUser
}).add(metaUserSchema)

assignAdminStatics(AdminSchema)

const Admin = model<adminInterface, AdminModel>('Admin', AdminSchema, 'admins')

export default Admin
