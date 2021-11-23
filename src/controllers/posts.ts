import { Request, Response } from 'express'
import { Post } from '../models'

const getPosts = async (req: Request, res: Response) => {
  const {} = req
  return res.json({})
}

const getPost = async (req: Request, res: Response) => {
  const { id } = req.params

  const post = await Post.getPost({ id })

  return res.json({})
}

const createPost = async (req: Request, res: Response) => {
  const {} = req
  return res.json({})
}

const modifyPost = async (req: Request, res: Response) => {
  const {} = req
  return res.json({})
}

const deletePost = async (req: Request, res: Response) => {
  const {} = req
  return res.json({})
}

export { getPost, getPosts, createPost, modifyPost, deletePost }
