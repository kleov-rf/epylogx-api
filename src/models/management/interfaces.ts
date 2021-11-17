import { Model, Schema } from 'mongoose'
import { metaUserInterface } from '../interfaces'
import { adminDataQuery } from '../statics/interfaces'

interface adminInterface extends metaUserInterface {
  adminId: string
  roles: {
    userManage?: boolean
    adminManage?: boolean
    postManage?: boolean
    categoryManage?: boolean
    storeManage?: boolean
    podcastManage?: boolean
    storeOrdersManage?: boolean
  }
  superAdmin: Schema.Types.ObjectId
}

interface AdminModel extends Model<adminInterface> {
  getAdmin(data: adminDataQuery): any
  getAdmins(data: adminDataQuery): any
}

interface manageRecordInterface {
  action: string /* [] */
  by: Schema.Types.ObjectId /* Admin */
  to: {
    id: Schema.Types.ObjectId
    type: string
  }
  description: string
  recordDate: Date
}

interface RecordModel extends Model<manageRecordInterface> {
  getRecords(data: RecordDataQuery): any
}

interface RecordDataQuery {
  _id: string
  action: string
  by: string
  to: string
  toType: string
  beforeDate: Date
  afterDate: Date
  date: Date
}

interface reportInterface {
  _id?: string
  mainCause: string
  description: string
  author: string /* User */
  post: string /* Post */
  isResolved?: boolean
}

interface ReportModel extends Model<reportInterface> {
  getReports(data: reportInterface): any
}

export {
  adminInterface,
  manageRecordInterface,
  RecordDataQuery,
  reportInterface,
  AdminModel,
  RecordModel,
  ReportModel,
}
