import { model, Schema } from 'mongoose'
import { PostSchema } from '../post'
import { articleInterface, articleInterfaceModel } from './interfaces'

const ArticleSchema = new Schema<articleInterface>(
  {
    pages: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
).add(PostSchema)

const Article = model<articleInterface, articleInterfaceModel>('Article', ArticleSchema, 'posts')

export default Article
