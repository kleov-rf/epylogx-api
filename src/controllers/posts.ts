import { Request, Response } from 'express'
import { Document, Types } from 'mongoose'
import { Authorship, Post, PostCategory } from '../models'
import {
  authorshipInterface,
  postCategoryInterface,
} from '../models/publishing/interfaces'

const getPosts = async (req: Request, res: Response) => {
  const {
    title,
    type,
    beforeUpload,
    sinceUpload,
    beforeRelease,
    sinceRelease,
    isApproved,
    isActive,
  } = req.query

  const query = {}

  if (title) {
    Object.assign(query, title)
  }
  if (type) {
    Object.assign(query, type)
  }
  if (beforeUpload) {
    Object.assign(query, beforeUpload)
  }
  if (sinceUpload) {
    Object.assign(query, sinceUpload)
  }
  if (beforeRelease) {
    Object.assign(query, beforeRelease)
  }
  if (sinceRelease) {
    Object.assign(query, sinceRelease)
  }
  if (isActive != undefined) {
    Object.assign(query, isActive)
  }
  if (isApproved != undefined) {
    Object.assign(query, isApproved)
  }

  const posts = await Post.getPosts(query)

  return res.json(posts)
}

const getPost = async (req: Request, res: Response) => {
  const { id } = req.params

  const post = await Post.getPost({ id })

  return res.json(post)
}

const createPost = async (req: Request, res: Response) => {
  const { info, type, authors, categories, social, uploadDate, releaseDate } =
    req.body

  const post = new Post({
    info,
    type,
    social,
    uploadDate,
    releaseDate,
  })

  await post.save()

  const postCategories: (Document<any, any, postCategoryInterface> &
    postCategoryInterface & { _id: Types.ObjectId })[] = []

  categories.forEach((category: any) => {
    postCategories.push(new PostCategory({ category, post: post._id }))
  })

  const postAuthors: (Document<any, any, authorshipInterface> &
    authorshipInterface & { _id: Types.ObjectId })[] = []

  authors.forEach((author: any) => {
    postAuthors.push(new Authorship({ author, post: post._id }))
  })

  await Promise.all([
    postCategories.forEach(postCategory => postCategory.save()),
    postAuthors.forEach(postAuthor => postAuthor.save()),
  ])

  return res.json(post)
}

const modifyPost = async (req: Request, res: Response) => {
  const { id } = req.params
  const {
    title,
    description,
    authors: receivedAuthors,
    categories: receivedCategories,
    commentsEnabled,
    releaseDate,
    isActive,
    isApproved,
  } = req.body

  const data = {}

  if (title) {
    Object.assign(data, { 'info.title': title })
  }
  if (description) {
    Object.assign(data, { 'info.description': description })
  }
  if (commentsEnabled != undefined) {
    Object.assign(data, { 'social.commentsEnabled': commentsEnabled })
  }
  if (releaseDate) {
    Object.assign(data, { releaseDate })
  }
  if (isActive != undefined) {
    Object.assign(data, { isActive })
  }
  if (isApproved != undefined) {
    Object.assign(data, { isApproved })
  }

  const [authorships, dbPostCategory] = await Promise.all([
    Authorship.getAuthorships({ post: id }),
    PostCategory.getPostsCategories({ post: id }),
  ])

  if (receivedAuthors) {
    const oldAuthors = authorships.map(
      (authorship: { author: { toString: () => any } }) =>
        authorship.author.toString()
    )

    const authorsToPreserve = [],
      newAuthors: any[] = []

    receivedAuthors.forEach((author: any) => {
      if (oldAuthors.includes(author)) {
        authorsToPreserve.push(author)
        oldAuthors.splice(oldAuthors.indexOf(author), 1)
      } else {
        newAuthors.push(author)
      }
    })

    await oldAuthors.forEach(async (author: any) => {
      await Authorship.deleteOne({ post: id, author })
    })

    await newAuthors.forEach(async author => {
      await new Authorship({ author, post: id })
    })
  }

  if (receivedCategories) {
    const oldCategories = dbPostCategory.map(
      (postCategory: { category: { toString: () => any } }) =>
        postCategory.category.toString()
    )

    const categoriesToPreserve = [],
      newCategories: any[] = []

    receivedCategories.forEach((category: any) => {
      if (oldCategories.includes(category)) {
        categoriesToPreserve.push(category)
        oldCategories.splice(oldCategories.indexOf(category), 1)
      } else {
        newCategories.push(category)
      }
    })

    await oldCategories.forEach(async (category: any) => {
      await PostCategory.deleteOne({ post: id, category })
    })

    await newCategories.forEach(async category => {
      await new PostCategory({ category, post: id }).save()
    })
  }

  const updatedPost = await Post.findByIdAndUpdate(id, data, { new: true })

  return res.json(updatedPost)
}

const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params

  const deletedPost = await Post.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  )

  return res.json(deletedPost)
}

export { getPost, getPosts, createPost, modifyPost, deletePost }
