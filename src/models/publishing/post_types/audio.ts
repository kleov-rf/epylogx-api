import { model, Schema } from 'mongoose'
import { AudioVisualSchema } from '../../abstracts'
import { PostSchema } from '../post'
import { audioInterface, audioInterfaceModel } from './interfaces'

const AudioSchema = new Schema<audioInterface>(
  {
    podcast: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)
  .add(PostSchema)
  .add(AudioVisualSchema)

const Audio = model<audioInterface, audioInterfaceModel>(
  'Audio',
  AudioSchema,
  'posts'
)

export default Audio
