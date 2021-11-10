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
    },
    to: {
      id: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      type: String,
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

RecordSchema.statics.getRecords = async function ({
  _id,
  action,
  by,
  to,
  toType,
  beforeDate,
  afterDate,
  date,
}: RecordDataQuery) {
  const query = {}
  if (_id && validator.isMongoId(_id)) {
    Object.assign(query, { _id })
  }
  if (action && validator.isMongoId(action)) {
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
    Object.assign(query, { recordDate: { $lte: minifiedISOString(date) } })
  }
  if (afterDate) {
    Object.assign(query, { recordDate: { $gte: minifiedISOString(date) } })
  }
  if (date) {
    Object.assign(query, { recordDate: minifiedISOString(date) })
  }

  const records = this.find(query)

  if (!records) {
    throw new Error(`Couldn't find any records results with data: ${query}`)
  }

  return records
}

const Record = model<manageRecordInterface, RecordModel>(
  'Record',
  RecordSchema,
  'managerRecords'
)

export default Record
