import { Request, Response } from 'express'
import { Category, Isced } from '../models'
import validator from 'validator'

const getISCED = async (req: Request, res: Response) => {
  const { id } = req.params
  let isced

  if (validator.isMongoId(id)) {
    isced = await Isced.find({ _id: id })
  }

  if (validator.isInt(id, { min: 0, max: 8 })) {
    isced = await Isced.getISCED(Number(id))
  }

  return res.json(isced)
}

const getISCEDS = async (req: Request, res: Response) => {
  const { aboveLevel, belowLevel, isActive } = req.query

  const query = {}

  if (aboveLevel) {
    Object.assign(query, { aboveLevel: Number(aboveLevel) })
  }
  if (belowLevel) {
    Object.assign(query, { belowLevel: Number(belowLevel) })
  }
  if (isActive === 'true') {
    Object.assign(query, { isActive: true })
  }
  if (isActive === 'false') {
    Object.assign(query, { isActive: false })
  }
  const isceds = await Isced.getISCEDS(query)

  return res.json(isceds)
}

const getISCEDCategories = async (req: Request, res: Response) => {
  const { id } = req.params

  const categories = await Category.getCategories({ isced: id })

  return res.json(categories)
}

const createISCED = async (req: Request, res: Response) => {
  const { level, description } = req.body

  const isced = new Isced({
    level: Number(level),
    description,
  })

  await isced.save()

  return res.json(isced)
}

const updateISCED = async (req: Request, res: Response) => {
  const { id } = req.params
  const { level, description } = req.body

  const newIsced = await Isced.findByIdAndUpdate(
    id,
    { level, description },
    { new: true }
  )

  return res.json(newIsced)
}

const deleteISCED = async (req: Request, res: Response) => {
  const { id } = req.params

  const isced = await Isced.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  )

  return res.json(isced)
}

export {
  getISCED,
  getISCEDS,
  createISCED,
  updateISCED,
  deleteISCED,
  getISCEDCategories,
}
