import { isValidObjectId, model, Schema } from 'mongoose'
import validator from 'validator'
import { postCategoryInterface, postCategoryModel } from './interfaces'

const PostCategorySchema = new Schema<postCategoryInterface>(
  {
    post: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

PostCategorySchema.statics.getPostsCategories = async function ({
  post,
  category,
}: postCategoryInterface) {
  const query = {}
  if (post && validator.isMongoId(post)) {
    Object.assign(query, { post })
  }
  if (category && validator.isMongoId(category)) {
    Object.assign(query, { category })
  }

  const postsCategories = await this.find(query)
    .populate('post')
    .populate('category')

  if (!postsCategories) {
    throw new Error(
      `Couldn't find any postsCategories results with data: ${query}`
    )
  }

  return postsCategories
}

const PostCategory = model<postCategoryInterface, postCategoryModel>(
  'PostCategory',
  PostCategorySchema,
  'posts_have_categories'
)

export default PostCategory
