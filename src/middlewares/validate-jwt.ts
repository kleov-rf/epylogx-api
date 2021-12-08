import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Admin, User } from '../models'

const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-token')

  if (!token) {
    return res.status(401).json({
      error: true,
      reason: "There ain't no token within your headers.",
    })
  }

  try {
    const { uid, isAdmin } = <any>(
      jwt.verify(token, <any>process.env.SECRETORPRIVATEKEY)
    )
    let metaUser

    if (isAdmin) {
      metaUser = await Admin.findById(uid)
    } else {
      metaUser = await User.findById(uid)
    }

    if (!metaUser) {
      return res.status(401).json({
        error: true,
        reason:
          "not valid token - I've never met this man before, it isn't ir our database",
      })
    }

    if (!metaUser.isActive) {
      return res.status(401).json({
        error: true,
        reason:
          'not valid token - Contact an administrator so that we can help you.',
      })
    }

    Object.assign(req, { metaUser, isAdmin })

    next()
  } catch (error) {
    res.status(401).json({
      error: true,
      reason: 'not valid token, maybe it is expired',
    })
  }
}

export default validateJWT
