import { isValidObjectId, model, Schema } from 'mongoose'
import validator from 'validator'
import { reportInterface, ReportModel } from './interfaces'

const ReportSchema = new Schema<reportInterface>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    mainCause: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      required: true,
    },
    post: {
      type: String,
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

  if (_id && validator.isMongoId(_id)) {
    Object.assign(query, { _id })
  }
  if (mainCause && validator.isMongoId(mainCause)) {
    Object.assign(query, { mainCause })
  }
  if (
    description &&
    validator.isAlphanumeric(description, 'es-ES', { ignore: ' ;,.¿?¡!' })
  ) {
    const descriptionRegex = new RegExp(description)
    Object.assign(query, { description: descriptionRegex })
  }
  if (author && validator.isMongoId(author)) {
    Object.assign(query, { author })
  }
  if (post && validator.isMongoId(post)) {
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

const Report = model<reportInterface, ReportModel>(
  'Report',
  ReportSchema,
  'managerReports'
)

export default Report
