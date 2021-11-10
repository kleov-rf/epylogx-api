import { model, Schema } from 'mongoose'
import { iscedInterface, iscedModel } from './interfaces'

const iscedSchema = new Schema<iscedInterface>(
  {
    level: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
)

iscedSchema.index({ level: 1 })

const Isced = model<iscedInterface, iscedModel>('Isced', iscedSchema, 'isceds')

export default Isced
