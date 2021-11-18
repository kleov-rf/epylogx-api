import { Router } from 'express'
import { check } from 'express-validator'
import postResetPassword from '../controllers/reset-password'
import { existsEmail } from '../helpers/db-validators'
import validateFields from '../middlewares/validate-fields'

const router = Router()

router.post(
  '/',
  [
    check('email', 'email is required').notEmpty(),
    check('email', 'email value must be a valid email').isEmail({
      domain_specific_validation: true,
    }),
    // TODO: Enviar enlace email con usuario embebido
    check('email').not().custom(existsEmail),
    validateFields,
  ],
  postResetPassword
)

export default router
