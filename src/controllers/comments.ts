import { Request, Response } from 'express'
import { Comment } from '../models'

const getComments = async (req: Request, res: Response) => {
  const { text, isHidden, author, post } = req.query

  const query = {}

  if (text) {
    const regexText = new RegExp(<string>text, 'i')
    Object.assign(query, { regexText })
  }
  if (isHidden != undefined) {
    Object.assign(query, { isHidden })
  }
  if (author) {
    Object.assign(query, { author })
  }
  if (post) {
    Object.assign(query, { post })
  }

  const comments = await Comment.getComments(query)

  return res.json(comments)
}

const getComment = async (req: Request, res: Response) => {
  const { id } = req.params

  const comment = await Comment.findById(id)

  return res.json(comment)
}

const getCommentReplies = async (req: Request, res: Response) => {
  const { id } = req.params

  const comments = await Comment.getComments({ superComment: id })

  return res.json(comments)
}

const createComment = async (req: Request, res: Response) => {
  const { author, post, superComment, text } = req.body

  const data = {
    author,
    post,
    text,
  }

  if (superComment) {
    Object.assign(data, { superComment })
  }

  const comment = new Comment(data)

  await comment.save()

  return res.json(comment)
}

const modifyComment = async (req: Request, res: Response) => {
  const { id } = req.params
  const { text, isHidden } = req.body

  const data = { text }

  if (isHidden != undefined) {
    Object.assign(data, { isHidden })
  }

  const newComment = await Comment.findByIdAndUpdate(id, data, { new: true })

  return res.json(newComment)
}

const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params

  const hiddenComment = await Comment.findByIdAndUpdate(
    id,
    { isHidden: true },
    { new: true }
  )

  return res.json(hiddenComment)
}

export {
  getComments,
  getComment,
  getCommentReplies,
  createComment,
  modifyComment,
  deleteComment,
}
