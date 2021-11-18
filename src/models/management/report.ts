import { isValidObjectId, model, Schema } from 'mongoose'
import validator from 'validator'
import { reportInterface, ReportModel, reportDataQuery } from './interfaces'

const ReportSchema = new Schema<reportInterface>(
  {
    mainCause: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    post: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
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

ReportSchema.statics.getReport = async function ({ id }) {
  const query = {}

  if (id && validator.isMongoId(id)) {
    Object.assign(query, { _id: id })
  }

  const report = await this.findOne(query)

  return report
}

ReportSchema.statics.getReports = async function ({
  mainCause,
  description,
  author,
  post,
  isResolved,
}: reportDataQuery) {
  const query = {}

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

  const reports = await this.find(query)

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
