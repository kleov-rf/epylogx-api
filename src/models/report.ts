import { isValidObjectId, model, Schema } from 'mongoose'
import validator from 'validator'

interface reportInterface {
  _id?: Schema.Types.ObjectId
  mainCause: Schema.Types.ObjectId
  description: string
  author: Schema.Types.ObjectId /* User */
  post: Schema.Types.ObjectId /* Post */
  isResolved?: boolean
}

const ReportSchema = new Schema<reportInterface>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    mainCause: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

ReportSchema.statics.getReports = async function ({
  _id,
  mainCause,
  description,
  author,
  post,
  isResolved,
}: reportInterface) {
  const query = {}

  if (_id && isValidObjectId(_id)) {
    Object.assign(query, { _id })
  }
  if (mainCause && isValidObjectId(mainCause)) {
    Object.assign(query, { mainCause })
  }
  if (description && validator.isAlphanumeric(description, 'es-ES', { ignore: ' ;,.¿?¡!' })) {
    const descriptionRegex = new RegExp(description)
    Object.assign(query, { description: descriptionRegex })
  }
  if (author && isValidObjectId(author)) {
    Object.assign(query, { author })
  }
  if (post && isValidObjectId(post)) {
    Object.assign(query, { post })
  }
  if (isResolved != undefined) {
    Object.assign(query, { isResolved })
  }

  const reports = this.find(query)

  if (!reports) {
    throw new Error(`Couldn't find any reports results with data: ${query}`)
  }

  return reports
}

const Report = model('Report', ReportSchema, 'managerReports')

export default Report
