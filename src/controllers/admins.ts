import { Request, Response } from 'express'
import { Admin } from '../models'
import bcrypt from 'bcryptjs'
import validator from 'validator'

const adminGet = async (req: Request, res: Response) => {
  const { id } = req.params
  const query = {}

  if (validator.isMongoId(id)) {
    Object.assign(query, { id })
  } else {
    Object.assign(query, { adminId: id })
  }
  try {
    const admin = await Admin.getAdmin(query)
    return res.json({ admin })
  } catch (error) {
    res.status(400).json({
      errors: true,
      msg: `Couldn't find any admin with id: ${id}`,
    })
  }
}

const adminGetSubordinates = async (req: Request, res: Response) => {
  const { id } = req.params
  const query = {}

  if (validator.isMongoId(id)) {
    Object.assign(query, { subordinateOf: id })
  }

  const admin = await Admin.getAdmins(query)
  return res.json({ admin })
}

const adminsGet = async (req: Request, res: Response) => {
  const {
    adminId = '',
    email = '',
    name = '',
    isSub = undefined,
    userManage,
    adminManage,
    postManage,
    categoryManage,
    storeManage,
  } = <any>req.query

  const roles = {}

  switch ('true') {
    case userManage:
      Object.assign(roles, { 'roles.userManage': true })
      break
    case adminManage:
      Object.assign(roles, { 'roles.adminManage': true })
      break
    case postManage:
      Object.assign(roles, { 'roles.postManage': true })
      break
    case categoryManage:
      Object.assign(roles, { 'roles.categoryManage': true })
      break
    case storeManage:
      Object.assign(roles, { 'roles.storeManage': true })
      break
  }

  let isSubordinate

  if (isSub) {
    isSubordinate = isSub === 'true' ? true : false
  }

  const admins = await Admin.getAdmins({
    id: adminId,
    email,
    name,
    isSub: isSubordinate ?? undefined,
    roles,
  })

  return res.json({ admins })
}

const adminsPost = async (req: Request, res: Response) => {
  const {
    adminId,
    givenName,
    familyName,
    email,
    password,
    birthDate,
    roles,
    superAdmin,
  } = req.body
  const admin = new Admin({
    adminId,
    givenName,
    familyName,
    email,
    password,
    birthDate,
    roles,
    superAdmin,
  })

  // Encrypt password
  const salt = bcrypt.genSaltSync()
  admin.password = bcrypt.hashSync(password, salt)

  // Save on BD
  await admin.save()

  return res.json(admin)
}

const adminsPut = async (req: Request, res: Response) => {
  const { id } = req.params
  const {
    adminPayload: { password, ...adminPayload },
  } = req.body

  if (password) {
    // Encrypt password
    const salt = bcrypt.genSaltSync()
    adminPayload.password = bcrypt.hashSync(password, salt)
  }

  const newAdmin = await Admin.findByIdAndUpdate(id, adminPayload, {
    new: true,
  })

  return res.json(newAdmin)
}

const adminsDelete = async (req: Request, res: Response) => {
  const { id } = req.params

  const admin = await Admin.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  )

  return res.json({
    admin,
  })
}

export {
  adminGet,
  adminsGet,
  adminsPost,
  adminsPut,
  adminsDelete,
  adminGetSubordinates,
}
