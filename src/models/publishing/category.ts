import { model, Schema } from 'mongoose'
import { DescriptableSchema } from '../abstracts'
import { assignCategoryStatics } from '../statics'
import { CategoryInterface, CategoryModel } from './interfaces'

const CategorySchema = new Schema<CategoryInterface>(
  {
    ISCED: {
      type: Schema.Types.ObjectId,
      ref: 'Isced',
    },
    superCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    stats: {},
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
).add(DescriptableSchema)

assignCategoryStatics(CategorySchema)

CategorySchema.index({
  'info.title': 1,
  superCategory: -1,
})

const Category = model<CategoryInterface, CategoryModel>('Category', CategorySchema, 'categories')

export default Category