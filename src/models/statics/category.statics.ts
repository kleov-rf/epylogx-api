import { isValidObjectId, Schema } from 'mongoose'

const assignCategoryStatics = (categorySchema: Schema) => {
  interface categoriesDataQuery {
    id?: string
    isced?: string
    isSub?: boolean
    branchOf?: string
  }

  categorySchema.statics.getCategory = async function ({
    id,
    isced,
    isSub,
    branchOf,
  }: categoriesDataQuery) {
    const query = {}
    if (id && isValidObjectId(id)) {
      Object.assign(query, { _id: id })
    }
    if (isced && isValidObjectId(isced)) {
      Object.assign(query, { ISCED: isced })
    }
    if (isSub !== undefined) {
      Object.assign(query, { superCategory: { $exists: isSub } })
    }
    if (branchOf && isValidObjectId(branchOf)) {
      Object.assign(query, { superCategory: branchOf })
    }

    const category = await this.findOne(query)

    if (!category) {
      throw new Error(`Couldn't find any category results with data: ${query}`)
    }

    return category
  }

  categorySchema.statics.getCategories = async function ({
    isced,
    isSub: areSubs,
    branchOf: branchesOf,
  }: categoriesDataQuery) {
    const query = {}
    if (isced && isValidObjectId(isced)) {
      Object.assign(query, { ISCED: isced })
    }
    if (areSubs !== undefined) {
      Object.assign(query, { superCategory: { $exists: areSubs } })
    }
    if (branchesOf && isValidObjectId(branchesOf)) {
      Object.assign(query, { superCategory: branchesOf })
    }

    const category = await this.find(query)

    if (!category) {
      throw new Error(`Couldn't find any category results with data: ${query}`)
    }

    return category
  }
}

export default assignCategoryStatics
