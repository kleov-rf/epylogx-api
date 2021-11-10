import jwt from 'jsonwebtoken'
import { Admin, User } from '../models'

const generateJWT = (uid: string, isAdmin: boolean) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, isAdmin }
    jwt.sign(
      payload,
      <any>process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: '2h',
      },
      (err, token) => {
        if (err) {
          console.log(err)
          reject('No se pudo generar el token')
        } else {
          resolve(token)
        }
      }
    )
  })
}

const checkJWT = async (token: string) => {
  try {
    if (token.length < 10) {
      return null
    }

    const { uid, isAdmin } = <any>(
      jwt.verify(token, <any>process.env.SECRETORPRIVATEKEY)
    )
    let metaUser

    if (isAdmin) {
      metaUser = await Admin.findById(uid)
    } else {
      metaUser = await User.findById(uid)
    }

    return metaUser ?? null
  } catch (error) {
    return null
  }
}

export { generateJWT, checkJWT }
