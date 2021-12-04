import { isValidObjectId, Schema } from 'mongoose'
import validator from 'validator'
import { categoriesDataQuery } from './interfaces'

const assignCategoryStatics = (categorySchema: Schema) => {
  categorySchema.statics.getCategory = async function ({
    id,
    isced,
    isSub,
    title,
    branchOf,
  }: categoriesDataQuery) {
    const query = {}
    if (id && validator.isMongoId(id)) {
      Object.assign(query, { _id: id })
    }
    if (isced && validator.isMongoId(isced)) {
      Object.assign(query, { ISCED: isced })
    }
    if (isSub !== undefined) {
      Object.assign(query, { superCategory: { $exists: isSub } })
    }
    if (title && validator.isAlpha(title, 'es-ES', { ignore: ' ' })) {
      Object.assign(query, { 'info.title': title })
    }
    if (branchOf && validator.isMongoId(branchOf)) {
      Object.assign(query, { superCategory: branchOf })
    }

    const category = await this.findOne(query).populate('ISCED')

    if (!category) {
      throw new Error(`Couldn't find any category results with data: ${query}`)
    }

    return category
  }

  categorySchema.statics.getCategories = async function ({
    isced,
    title,
    isSub: areSubs,
    branchOf: branchesOf,
  }: categoriesDataQuery) {
    const query = {}

    if (isced && validator.isMongoId(isced)) {
      Object.assign(query, { ISCED: isced })
    }
    if (title && validator.isAlpha(title, 'es-ES', { ignore: ' ' })) {
      const titleRegex = new RegExp(title)
      Object.assign(query, { title: titleRegex })
    }
    if (areSubs !== undefined) {
      Object.assign(query, { superCategory: { $exists: areSubs } })
    }
    if (branchesOf && validator.isMongoId(branchesOf)) {
      Object.assign(query, { superCategory: branchesOf })
    }

    const categories = await this.find(query)
      .populate('superCategory')
      .populate('ISCED')

    if (!categories) {
      throw new Error(`Couldn't find any category results with data: ${query}`)
    }

    return categories
  }
}

export default assignCategoryStatics
