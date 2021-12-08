import { Request, Response } from 'express'
import { Post, Record, Report } from '../models'
import { RecordDataQuery } from '../models/management/interfaces'

const getManagerRecord = async (req: Request, res: Response) => {
  const { id } = req.params
  const managerRecord = await Record.findById(id)
  return res.json(managerRecord)
}

const getManagerRecords = async (req: Request, res: Response) => {
  const { action, by, to, toType, beforeDate, afterDate, date } = req.query

  const query: RecordDataQuery = {}
  if (action) {
    Object.assign(query, { action })
  }
  if (by) {
    Object.assign(query, { by })
  }
  if (to) {
    Object.assign(query, { to })
  }
  if (toType) {
    Object.assign(query, { toType })
  }
  if (beforeDate) {
    Object.assign(query, { beforeDate })
  }
  if (afterDate) {
    Object.assign(query, { afterDate })
  }
  if (date) {
    Object.assign(query, { date })
  }

  const records = await Record.getRecords(query)

  return res.json(records)
}

const createManagerRecord = async (req: Request, res: Response) => {
  const {
    action,
    by,
    to: { id, type },
    description,
    recordDate,
  } = req.body

  const data = {
    action,
    by,
    to: { id, type },
    description,
    recordDate,
  }

  const newRecord = new Record(data)

  await newRecord.save()

  return res.json(newRecord)
}

const getPostReports = async (req: Request, res: Response) => {
  const { mainCause, description, author, post, isResolved } = req.query
  const query = { mainCause, description, author, post, isResolved }

  const postReports = await Report.getReports(<any>query)

  return res.json(postReports)
}

const getPostReport = async (req: Request, res: Response) => {
  const { id } = req.params
  const postReport = await Report.findById(id)
  return res.json(postReport)
}

const createPostReport = async (req: Request, res: Response) => {
  const { mainCause, description, author, post } = req.body
  const data = { mainCause, description, author, post }

  const newReport = new Report(data)

  await newReport.save()

  return res.json(newReport)
}

const modifyPostReport = async (req: Request, res: Response) => {
  const { id } = req.params
  const { isResolved } = req.body

  const modifiedPostReport = await Report.findByIdAndUpdate(
    id,
    { isResolved: !!isResolved },
    { new: true }
  )

  return res.json(modifiedPostReport)
}

const deletePostReport = async (req: Request, res: Response) => {
  const { id } = req.params

  const deletedPostReport = await Report.findByIdAndDelete(id)

  return res.json(deletedPostReport)
}

const getPostsToApprove = async (req: Request, res: Response) => {
  const postsToApprove = await Post.getPosts({ isApproved: false })

  return res.json(postsToApprove)
}

const getPostToApprove = async (req: Request, res: Response) => {
  const { id } = req.params
  const postWithoutApprove = await Post.find({ id, isApproved: false })
  return res.json(postWithoutApprove)
}

export {
  getManagerRecord,
  getManagerRecords,
  createManagerRecord,
  getPostReports,
  getPostReport,
  createPostReport,
  modifyPostReport,
  deletePostReport,
  getPostsToApprove,
  getPostToApprove,
}
