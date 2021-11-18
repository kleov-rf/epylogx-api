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
  isActive: {
    type: Boolean,
    default: true,
  },
})

iscedSchema.index({ level: 1 })

iscedSchema.statics.getISCED = async function (level: number) {
  const isced = await this.findOne({ level })
  return isced
}

iscedSchema.statics.getISCEDS = async function ({
  aboveLevel,
  belowLevel,
  isActive,
}) {
  const query = {}

  if (aboveLevel && belowLevel) {
    Object.assign(query, {
      $and: [{ level: { $gt: aboveLevel } }, { level: { $lt: belowLevel } }],
    })
  }

  if (aboveLevel) {
    Object.assign(query, { level: { $gt: aboveLevel } })
  }

  if (belowLevel) {
    Object.assign(query, { level: { $lt: belowLevel } })
  }

  if (isActive != undefined) {
    Object.assign(query, { isActive })
  }

  const isceds = await this.find(query)
  return isceds
}

const Isced = model<iscedInterface, iscedModel>('Isced', iscedSchema, 'isceds')

export default Isced
