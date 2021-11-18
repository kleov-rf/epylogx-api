import { Model, Schema } from 'mongoose'
import { DescriptableInterface } from '../interfaces'
import {
  categoriesDataQuery,
  commentDataQuery,
  postDataQuery,
} from '../statics/interfaces'

interface authorshipInterface {
  author?: string
  post?: string
}

interface authorshipModel extends Model<authorshipInterface> {
  getAuthorships(data: authorshipInterface): any
}

interface CategoryInterface extends DescriptableInterface {
  ISCED: Schema.Types.ObjectId
  superCategory?: Schema.Types.ObjectId /* Category */
  stats?: {}
}

interface CategoryModel extends Model<CategoryInterface> {
  getCategory(data: categoriesDataQuery): any
  getCategories(data: categoriesDataQuery): any
}

interface iscedInterface {
  level: number
  description: string
  isActive: boolean
}

interface iscedModel extends Model<iscedInterface> {
  getISCEDS({
    aboveLevel,
    belowLevel,
    isActive,
  }: {
    aboveLevel?: number
    belowLevel?: number
    isActive?: string
  }): any
  getISCED(level: number): any
}

interface commentInterface {
  author: Schema.Types.ObjectId /* User.id */
  post: Schema.Types.ObjectId
  text: string
  likes?: number
  superComment?: Schema.Types.ObjectId /* Comment */
  isHidden?: boolean
}

interface commentModel extends Model<commentInterface> {
  getComments(data: commentDataQuery): any
}

interface podcastInterface extends DescriptableInterface {
  podcastId: string
}

interface podcastModel extends Model<podcastInterface> {
  getPodcasts(data: podcastDataQuery): any
  getPodcast(data: { id: string }): any
}

interface podcastDataQuery {
  podcastId?: string
  title?: string
}

interface postInterface extends DescriptableInterface {
  type: Schema.Types.ObjectId /* 'pdf' | 'podcast' | 'art' | 'video' */
  authors: string[] /* User[] N:M */
  categories: {
    mains: Schema.Types.ObjectId[] /* Category[] N:M */
    subs: Schema.Types.ObjectId[] /* Category[] N:M */
  }
  social?: {
    comments: Schema.Types.ObjectId[] /* Comment[] 1:N */
    commentsEnabled: boolean
    likes: number
  }
  stats?: {}
  uploadDate: Date
  releaseDate?: Date
  fileURL: string
  previewImgURL: string
  location?: {
    type: {
      type: String
      enum: ['Point']
      required: true
    }
    coordinates: {
      type: [Number]
      required: true
    }
  }
  isApproved: boolean
}

interface postModel extends Model<postInterface> {
  getPost(data: postDataQuery): any
  getPosts(data: postDataQuery): any
}

interface postCategoryInterface {
  post?: string
  category?: string
}

interface postCategoryModel extends Model<postCategoryInterface> {
  getPostsCategories(data: postCategoryInterface): any
}

export {
  authorshipInterface,
  CategoryInterface,
  commentInterface,
  podcastInterface,
  podcastDataQuery,
  postInterface,
  postCategoryInterface,
  authorshipModel,
  CategoryModel,
  commentModel,
  podcastModel,
  postModel,
  postCategoryModel,
  iscedInterface,
  iscedModel,
}
