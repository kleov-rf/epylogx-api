import { model, Schema } from 'mongoose'
import { AudioVisualSchema } from '../../abstracts'
import { PostSchema } from '../post'
import { videoInterface, videoInterfaceModel } from './interfaces'

const VideoSchema = new Schema<videoInterface>(
  {
    fileFormat: {
      type: String,
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

const Video = model<videoInterface, videoInterfaceModel>(
  'Video',
  VideoSchema,
  'posts'
)

export default Video
