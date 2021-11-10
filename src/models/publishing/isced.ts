import { model, Schema } from 'mongoose'
import { iscedInterface, iscedModel } from './interfaces'

const iscedSchema = new Schema<iscedInterface>({
  level: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})

iscedSchema.index({ level: 1 })

iscedSchema.statics.getISCED = async function (level: number) {
  const isced = await this.findOne({ level })
  return isced
}

iscedSchema.statics.getISCEDS = async function () {
  const isceds = await this.find()
  return isceds
}

const Isced = model<iscedInterface, iscedModel>('Isced', iscedSchema, 'isceds')

export default Isced
