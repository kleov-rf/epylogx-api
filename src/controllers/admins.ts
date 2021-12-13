import { Request, Response } from 'express'
import { Admin, Chat } from '../models'
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
    return res.json(admin)
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

  if (id) {
    Object.assign(query, { subordinateOf: id })
  }

  const admin = await Admin.getAdmins(query)

  return res.json(admin)
}

const adminsGet = async (req: Request, res: Response) => {
  const {
    adminId = '',
    email = '',
    name = '',
    isSub = undefined,
    userManage,
    podcastManage,
    adminManage,
    postManage,
    categoryManage,
    storeManage,
    storeOrdersManage,
    iscedManage,
    postTypeManage,
  } = <any>req.query

  const roles = {}

  if (userManage === 'true') {
    Object.assign(roles, { 'roles.userManage': true })
  }
  if (adminManage === 'true') {
    Object.assign(roles, { 'roles.adminManage': true })
  }
  if (postManage === 'true') {
    Object.assign(roles, { 'roles.postManage': true })
  }
  if (categoryManage === 'true') {
    Object.assign(roles, { 'roles.categoryManage': true })
  }
  if (storeManage === 'true') {
    Object.assign(roles, { 'roles.storeManage': true })
  }
  if (podcastManage === 'true') {
    Object.assign(roles, { 'roles.podcastManage': true })
  }
  if (storeOrdersManage === 'true') {
    Object.assign(roles, { 'roles.storeOrdersManage': true })
  }
  if (iscedManage === 'true') {
    Object.assign(roles, { 'roles.iscedManage': true })
  }
  if (postTypeManage === 'true') {
    Object.assign(roles, { 'roles.postTypeManage': true })
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

  return res.json(admins)
}

const getAdminRecentChats = async (req: Request, res: Response) => {
  const { id } = req.params
  const { days = 3 } = req.query
  const adminRecentChats = await Chat.getRecentChatsToId(id, Number(days))

  const recentChattedAdmins = await Promise.all(
    adminRecentChats.map((id: any) => Admin.findById(id))
  )

  return res.json(recentChattedAdmins)
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
  getAdminRecentChats,
}
