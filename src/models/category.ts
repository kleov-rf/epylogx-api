import { model, Schema } from 'mongoose'
import { DescriptableInterface, DescriptableSchema } from './generic'
import assignCategoryStatics from './statics/category.statics'

interface CategoryInterface extends DescriptableInterface {
  ISCED: Schema.Types.ObjectId
  superCategory?: Schema.Types.ObjectId /* Category */
  stats?: {}
}

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

const Category = model('Category', CategorySchema, 'categories')
