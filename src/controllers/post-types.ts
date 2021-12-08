import { Request, Response } from 'express'
import { Post, PostType } from '../models'

const getPostTypes = async (req: Request, res: Response) => {
  const { isActive } = req.query

  const query = {}

  if (isActive === 'true') {
    Object.assign(query, { isActive: true })
  }
  if (isActive === 'false') {
    Object.assign(query, { isActive: false })
  }

  const postTypes = await PostType.getPostTypes(query)
  return res.json(postTypes)
}

const getPostType = async (req: Request, res: Response) => {
  const { id } = req.params
  const postType = await PostType.getPostType({ id })
  return res.json(postType)
}

const getPostsByType = async (req: Request, res: Response) => {
  const { id } = req.params
  const posts = await Post.getPosts({ type: id })
  return res.json(posts)
}

const createPostType = async (req: Request, res: Response) => {
  const { name, allowedExtensions } = req.body
  const postType = new PostType({
    name,
    allowedExtensions,
  })

  await postType.save()
  return res.json(postType)
}

const modifyPostType = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, allowedExtensions } = req.body

  const newPostType = await PostType.findByIdAndUpdate(
    id,
    { name, allowedExtensions },
    { new: true }
  )

  return res.json(newPostType)
}

const deletePostType = async (req: Request, res: Response) => {
  const { id } = req.params

  const postType = await PostType.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  )

  return res.json(postType)
}

export {
  getPostType,
  getPostTypes,
  createPostType,
  modifyPostType,
  deletePostType,
  getPostsByType,
}
