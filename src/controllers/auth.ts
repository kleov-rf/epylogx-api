import { Request, Response } from 'express'
import { Admin, User } from '../models'
import bcryptjs from 'bcryptjs'
import { generateJWT } from '../helpers/validate-jwt'
import googleVerify from '../helpers/google-verify'

// const authGet = (req: Request, res: Response) => {
//   const {} = req
//   return res.json({})
// }

// const authPost = (req: Request, res: Response) => {
//   const {} = req
//   return res.json({})
// }

// const authPut = (req: Request, res: Response) => {
//   const {} = req
//   return res.json({})
// }

// const authDelete = (req: Request, res: Response) => {
//   const {} = req
//   return res.json({})
// }

const login = async (req: Request, res: Response) => {
  const { email, password, username } = req.body

  try {
    const [user, admin] = await Promise.all([
      User.findOne({ $or: [{ email }, { userId: username }] }),
      Admin.findOne({ $or: [{ email }, { adminId: username }] }),
    ])

    const metaUser = user ?? admin
    const { adminId } = <any>metaUser
    const isAdmin = !!adminId

    if (!metaUser) {
      return res.status(401).json({
        error: true,
        reason: "email/username or password aren't correct - email/username",
      })
    }

    if (!metaUser.isActive) {
      return res.status(401).json({
        error: true,
        reason:
          "email/username or password aren't correct - Contact an admin to solve this problem",
      })
    }

    const isValidPassword = bcryptjs.compareSync(
      password,
      metaUser?.password ?? ''
    )
    if (!isValidPassword) {
      return res.status(400).json({
        error: true,
        reason:
          "email/username or password aren't correct - incorrect password",
      })
    }

    const token = await generateJWT(metaUser?._id, isAdmin)

    res.json({
      login: true,
      metaUser: metaUser,
      isAdmin,
      token,
    })
  } catch (error) {
    res.status(500).json({
      error: true,
      reason: "Couldn't complete login, contact with an administrator.",
    })
  }
}

const googleSignIn = async (req: Request, res: Response) => {
  const { id_token, beAdmin } = req.body

  try {
    const { email, pictureURL, givenName, familyName } = await googleVerify(
      id_token
    )

    const [user, admin] = await Promise.all([
      User.findOne({ email }),
      Admin.findOne({ email }),
    ])

    let metaUser = user ?? admin

    if (!metaUser) {
      const data = {
        givenName,
        familyName,
        email,
        pictureURL,
        googleSignIn: true,
      }

      if (beAdmin) {
        Object.assign(data, { adminId: `${email.split('@')[0]}_default` })
        metaUser = new Admin(data)
      } else {
        Object.assign(data, { userId: `${email.split('@')[0]}_default` })
        metaUser = new User(data)
      }

      await metaUser.save()
    }

    if (!metaUser.isActive) {
      return res.status(401).json({
        error: true,
        reason: 'Contact with an administrator, blocked user.',
      })
    }

    const token = await generateJWT(metaUser._id, beAdmin)

    res.json({
      login: true,
      reason: "Everything's ok! Google Signed In",
      metaUser: metaUser,
      token,
    })
  } catch (error) {
    res.status(400).json({
      error: true,
      reason: 'Google token is not valid',
    })
  }
}

const renewToken = async (req: Request, res: Response) => {
  const { metaUser, isAdmin } = <any>req

  const token = await generateJWT(metaUser._id, isAdmin)

  res.json({
    metaUser,
    isAdmin,
    token,
  })
}

export { login, googleSignIn, renewToken }
