import { isValidObjectId, model, Schema } from 'mongoose'
import validator from 'validator'
import { minifiedISOString } from '../../helpers/adjust-input'
import {
  manageRecordInterface,
  RecordDataQuery,
  RecordModel,
} from './interfaces'

const RecordSchema = new Schema<manageRecordInterface>(
  {
    action: {
      type: String,
      required: true,
    },
    by: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Admin',
    },
    to: {
      id: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'type',
      },  
      type: {
        type: String,
        required: true,
        enum: [
          'User',
          'Admin',
          'Post',
          'StoreItem',
          'StoreOrder',
          'Category',
          'Report',
          'Comment',
          'Isced',
          'Podcast',
        ],
      },
    },
    description: {
      type: String,
      required: true,
    },
    recordDate: {
      type: Date,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

RecordSchema.statics.getRecord = async function ({ id }) {
  const query = {}

  if (id && validator.isMongoId(id)) {
    Object.assign(query, { _id: id })
  }

  const record = await this.findOne(query)

  return record
}

RecordSchema.statics.getRecords = async function ({
  action,
  by,
  to,
  toType,
  beforeDate,
  afterDate,
  date,
}: RecordDataQuery) {
  const query = {}

  if (action) {
    Object.assign(query, { action })
  }
  if (by && validator.isMongoId(by)) {
    Object.assign(query, { by })
  }
  if (to && validator.isMongoId(to)) {
    Object.assign(query, { to })
  }
  if (toType && validator.isMongoId(toType)) {
    Object.assign(query, { toType })
  }
  if (beforeDate) {
    Object.assign(query, {
      recordDate: { $lte: minifiedISOString(new Date(<any>date)) },
    })
  }
  if (afterDate) {
    Object.assign(query, {
      recordDate: { $gte: minifiedISOString(new Date(<any>date)) },
    })
  }
  if (date) {
    Object.assign(query, { recordDate: minifiedISOString(new Date(<any>date)) })
  }

  const records = await this.find(query)

  return records
}

const Record = model<manageRecordInterface, RecordModel>(
  'Record',
  RecordSchema,
  'managerRecords'
)

export default Record
