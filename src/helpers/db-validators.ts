import { isValidObjectId } from 'mongoose'
import { Admin, Audio, Post, User } from '../models'

const existsUserByObjectId = async (_id: string) => {
  const user = await User.findById(_id)
  if (!user) {
    throw new Error(`${_id} is not in our user database`)
  }
}

const existsAdminByObjectId = async (_id: string) => {
  const admin = await Admin.findById(_id)
  if (!admin) {
    throw new Error(`${_id} is not in our admin database`)
  }
}

const existsMetaUserId = async (metaUserId: string) => {
  const [user, admin] = await Promise.all([
    User.findOne({ userId: metaUserId }),
    Admin.findOne({ adminId: metaUserId }),
  ])

  if (user || admin) {
    throw new Error(`User with ${metaUserId} already exists. Try another one.`)
  }
}

const existsEmail = async (email: string) => {
  const [user, admin] = await Promise.all([
    User.findOne({ email }),
    Admin.findOne({ email }),
  ])

  if (user || admin) {
    throw new Error(
      `User with email ${email} already exists. Try loggin into your account`
    )
  }
}

export {
  existsUserByObjectId,
  existsAdminByObjectId,
  existsMetaUserId,
  existsEmail,
}
