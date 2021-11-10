import { Request, Response } from 'express'
import { Admin } from '../models'
import bcrypt from 'bcryptjs'

const adminGet = (req: Request, res: Response) => {
  const {} = req
  return res.json({})
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

const adminsPut = (req: Request, res: Response) => {
  const {} = req
  return res.json({})
}

const adminsDelete = (req: Request, res: Response) => {
  const {} = req
  return res.json({})
}

export { adminGet, adminsGet, adminsPost, adminsPut, adminsDelete }
