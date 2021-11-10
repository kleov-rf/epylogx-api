import { Router } from 'express'
import { check } from 'express-validator'
import {
  userGet,
  usersDelete,
  usersGet,
  usersPost,
  usersPut,
} from '../controllers/users'
import {
  existsEmail,
  existsUserByObjectId,
  existsMetaUserId,
} from '../helpers/db-validators'
import validateFields from '../middlewares/validate-fields'
import validateJWT from '../middlewares/validate-jwt'
import { hasRoles } from '../middlewares/validate-metauser'

const router = Router()

router.get('/', [], usersGet)

router.get('/:id', [], userGet)

router.post(
  '/',
  [
    check('userId', 'userId field is required').notEmpty(),
    check(
      'userId',
      'userId field value must match a-Z 0-9 _-. and length {3,15}'
    )
      .isAlphanumeric(undefined, { ignore: '_-.' })
      .isLength({ min: 3, max: 15 }),
    check('userId').custom(existsMetaUserId),
    check('givenName', 'First name is required').notEmpty(),
    check('givenName', 'First name must only contain letters').isAlpha(
      'es-ES',
      { ignore: ' ' }
    ),
    check('familyName', 'Last name is required').notEmpty(),
    check('familyName', 'Last name must only contain letters').isAlpha(
      'es-ES',
      { ignore: ' ' }
    ),
    check('email', 'email is required').notEmpty(),
    check('email', 'email value must be a valid email').isEmail({
      domain_specific_validation: true,
    }),
    check('email').custom(existsEmail),
    check('password', 'password is required').notEmpty(),
    check(
      'password',
      'password value length must be between 6 and 30 characters'
    ).isLength({ min: 6, max: 30 }),
    check(
      'birthDate',
      'Your birth date is required, we want to cheer you on your birthday :)'
    ).notEmpty(),
    check('birthDate', 'birthDate is not in a correct ISO format').isISO8601(),
    validateFields,
  ],
  usersPost
)

router.put(
  '/:id',
  [
    validateJWT,
    hasRoles({ userManage: true }),
    check('id', '_id must be an Mongo Object Id').isMongoId(),
    check('id').custom(existsUserByObjectId),
    check(
      'userId',
      'userId field value must match a-Z 0-9 _-. and length {3,15}'
    )
      .optional()
      .isAlphanumeric(undefined, { ignore: '_-.' })
      .isLength({ min: 3, max: 15 }),
    check('userId').optional().custom(existsMetaUserId),
    check('givenName', 'First name must only contain letters')
      .optional()
      .isAlpha('es-ES', { ignore: ' ' }),
    check('familyName', 'Last name must only contain letters')
      .optional()
      .isAlpha('es-ES', { ignore: ' ' }),
    check('email', 'email value must be a valid email').optional().isEmail({
      domain_specific_validation: true,
    }),
    check('email').optional().custom(existsEmail),
    check(
      'password',
      'password value length must be between 6 and 30 characters'
    )
      .optional()
      .isLength({ min: 6, max: 30 }),
    check('birthDate', 'birthDate is not in a correct ISO format')
      .optional()
      .isISO8601(),
    validateFields,
  ],
  usersPut
)

router.delete(
  '/:id',
  [
    validateJWT,
    hasRoles({ userManage: true }),
    check('id', 'not a mongo ObjecId').isMongoId(),
    check('id').custom(existsUserByObjectId),
    validateFields,
  ],
  usersDelete
)

router.get('/:id/interests')
router.post('/:id/interests')

router.get('/:id/posts')

router.get('/:id/likedPosts')
router.post('/:id/likedPosts')

router.get('/:id/savedPosts')
router.post('/:id/savedPosts')

router.get('/:id/podcasts')

router.get('/:id/chats')

router.get('/:id/followers')
router.post('/:id/followers')

router.get('/:id/following')
router.post('/:id/following')

router.get('/:id/store/orders')

export default router
