import { Request, Response } from 'express'
import { Category, Isced, PostCategory } from '../models'

const categoryGet = async (req: Request, res: Response) => {
  const { id } = req.params

  const category = await Category.getCategory({ id })

  return res.json(category)
}

const categoriesGet = async (req: Request, res: Response) => {
  const { belowISCED, aboveISCED, title = '', isSub } = <any>req.query

  const queryCategory = {}
  if (title) {
    const regexTitle = new RegExp(title, 'i')
    Object.assign(queryCategory, { 'info.title': regexTitle })
  }

  if (isSub != undefined) {
    Object.assign(queryCategory, { isSub })
  }

  const queryIsced = {}

  if (belowISCED) {
    Object.assign(queryIsced, { belowLevel: Number(belowISCED) })
  }
  // TODO: descubir por qué coge el aboveISCED
  if (aboveISCED) {
    Object.assign(queryIsced, { aboveLevel: Number(aboveISCED) })
  }

  const [categories, isceds] = await Promise.all([
    Category.getCategories(queryCategory),
    Isced.getISCEDS(queryIsced),
  ])

  const iscedsIds = isceds.map((isced: any) => isced.id)
  const categoriesFiltered = categories.filter((category: any) =>
    iscedsIds.includes(category.ISCED.toString())
  )

  return res.json(categoriesFiltered)
}

const categoryBranchesGet = async (req: Request, res: Response) => {
  const { id } = <any>req.params

  const categories = await Category.getCategories({ branchOf: id })

  return res.json(categories)
}

const categoryPostsGet = async (req: Request, res: Response) => {
  const { id } = <any>req.params

  const posts = await PostCategory.getPostsCategories({ category: id })

  return res.json(posts)
}

const categoriesPost = async (req: Request, res: Response) => {
  const { isced, title, superCategory, description } = req.body

  const data = { ISCED: isced, info: { title, description } }

  if (superCategory) Object.assign(data, { superCategory })

  const category = new Category(data)

  await category.save()

  return res.json(category)
}

const categoriesPut = async (req: Request, res: Response) => {
  const { id } = req.params
  const { title, description, ...categoriesPayload } = req.body

  const data = {}

  if (title) {
    Object.assign(data, { 'info.title': title })
  }
  if (description) {
    Object.assign(data, { 'info.description': description })
  }

  Object.assign(data, categoriesPayload)
  console.log(data)

  const newCategory = await Category.findByIdAndUpdate(id, data, {
    new: true,
  })

  return res.json(newCategory)
}

const categoriesDelete = async (req: Request, res: Response) => {
  const { id } = req.params

  const category = await Category.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  )

  return res.json(category)
}

export {
  categoryGet,
  categoriesGet,
  categoriesPost,
  categoriesPut,
  categoriesDelete,
  categoryBranchesGet,
  categoryPostsGet,
}
