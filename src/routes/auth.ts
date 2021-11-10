import { Router } from 'express'
import { check } from 'express-validator'
import { googleSignIn, login, renewToken } from '../controllers/auth'
import { existsEmail, existsMetaUserId } from '../helpers/db-validators'
import validateFields from '../middlewares/validate-fields'
import validateJWT from '../middlewares/validate-jwt'

const router = Router()

router.get('/', [validateJWT], renewToken)

router.post(
  '/login',
  [
    check('email', 'not a valid email').optional().isEmail({
      domain_specific_validation: true,
    }),
    check('email', 'This email is not in our database')
      .optional()
      .not()
      .custom(existsEmail),
    check(
      'username',
      'username field value must match a-Z 0-9 _-. and length {3,15}'
    )
      .optional()
      .isAlphanumeric(undefined, { ignore: '_-.' })
      .isLength({ min: 3, max: 15 }),
    check('username', 'this username is not in our database')
      .optional()
      .not()
      .custom(existsMetaUserId),
    check('email', 'This email is not in our database')
      .optional()
      .not()
      .custom(existsEmail),
    check('password', 'password is required').notEmpty(),
    validateFields,
  ],
  login
)

router.post(
  '/google',
  [
    check('id_token', 'id_token is required on request').notEmpty(),
    check('isAdmin', 'isAdmin field is required on request')
      .notEmpty()
      .isBoolean(),
    validateFields,
  ],
  googleSignIn
)

export default router
