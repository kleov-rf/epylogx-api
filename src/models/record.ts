import { isValidObjectId, model, Schema } from 'mongoose'
import { minifiedISOString } from '../helpers/adjust-input'

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

interface RecordDataQuery {
  _id: Schema.Types.ObjectId
  action: string
  by: Schema.Types.ObjectId
  to: Schema.Types.ObjectId
  toType: string
  beforeDate: Date
  afterDate: Date
  date: Date
}

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
  if (_id && isValidObjectId(_id)) {
    Object.assign(query, { _id })
  }
  if (action && isValidObjectId(action)) {
    Object.assign(query, { action })
  }
  if (by && isValidObjectId(by)) {
    Object.assign(query, { by })
  }
  if (to && isValidObjectId(to)) {
    Object.assign(query, { to })
  }
  if (toType && isValidObjectId(toType)) {
    Object.assign(query, { toType })
  }
  if (beforeDate && isValidObjectId(beforeDate)) {
    Object.assign(query, { recordDate: { $lte: minifiedISOString(date) } })
  }
  if (afterDate && isValidObjectId(afterDate)) {
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

const Record = model('Record', RecordSchema, 'managerRecords')

export default Record
