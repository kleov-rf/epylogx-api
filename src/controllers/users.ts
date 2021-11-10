import { Request, Response } from 'express'
import { User } from '../models'
import bcrypt from 'bcryptjs'
import validator from 'validator'

const userGet = async (req: Request, res: Response) => {
  const { id } = req.params
  const { isAdmin } = <any>req
  let user
  try {
    if (validator.isMongoId(id)) {
      user = await User.getUser({ id: id, isAdmin })
    } else {
      user = await User.getUser({ userId: id, isAdmin })
    }
  } catch (error) {
    res.status(400).json({
      msg: `Couldn't find any user with id: ${id}`,
    })
  }

  return res.json(user)
}

const usersGet = async (req: Request, res: Response) => {
  const { userId = '', email = '', name = '' } = req.query
  const { isAdmin } = <any>req

  let users
  if (
    typeof userId == 'string' &&
    typeof email == 'string' &&
    typeof name == 'string'
  ) {
    users = await User.getUsers({ userId, email, name, isAdmin })
  }

  return res.json(users)
}

const usersPost = async (req: Request, res: Response) => {
  const { userId, givenName, familyName, email, password, birthDate } = req.body
  const user = new User({
    userId,
    givenName,
    familyName,
    email,
    password,
    birthDate,
  })

  // Encrypt password
  const salt = bcrypt.genSaltSync()
  user.password = bcrypt.hashSync(password, salt)

  // Save on BD
  await user.save()

  return res.json(user)
}

const usersPut = async (req: Request, res: Response) => {
  const { id } = req.params
  const {
    userPayload: { password, ...userPayload },
  } = req.body

  if (password) {
    // Encrypt password
    const salt = bcrypt.genSaltSync()
    userPayload.password = bcrypt.hashSync(password, salt)
  }

  const newUser = await User.findByIdAndUpdate(id, userPayload, { new: true })

  return res.json(newUser)
}

const usersDelete = async (req: Request, res: Response) => {
  const { id } = req.params

  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  )

  return res.json({
    user,
  })
}

export { userGet, usersGet, usersPost, usersPut, usersDelete }
