import { Router } from 'express'
import { check } from 'express-validator'
import {
  adminGet,
  adminsDelete,
  adminsGet,
  adminsPost,
  adminsPut,
} from '../controllers/admins'
import {
  existsAdminByObjectId,
  existsEmail,
  existsMetaUserId,
} from '../helpers/db-validators'
import validateFields from '../middlewares/validate-fields'
import validateJWT from '../middlewares/validate-jwt'
import { hasRoles, isMetaUserAdmin } from '../middlewares/validate-metauser'

const router = Router()

router.get(
  '/',
  [
    validateJWT,
    isMetaUserAdmin,
    check('name', 'name query param must be alphanumeric')
      .optional()
      .isAlpha('es-ES', { ignore: ' ' }),
    check('isSub', 'isSub query param must be a valid boolean interpretation')
      .optional()
      .isBoolean(),
    check(
      'userManage',
      'userManage query param must be a valid boolean interpretation'
    )
      .optional()
      .isBoolean(),
    check(
      'adminManage',
      'adminManage query param must be a valid boolean interpretation'
    )
      .optional()
      .isBoolean(),
    check(
      'postManage',
      'postManage query param must be a valid boolean interpretation'
    )
      .optional()
      .isBoolean(),
    check(
      'categoryManage',
      'categoryManage query param must be a valid boolean interpretation'
    )
      .optional()
      .isBoolean(),
    check(
      'storeManage',
      'storeManage query param must be a valid boolean interpretation'
    )
      .optional()
      .isBoolean(),
    check(
      'podcastManage',
      'podcastManage query param must be a valid boolean interpretation'
    )
      .optional()
      .isBoolean(),
    check(
      'storeOrdersManage',
      'storeOrdersManage query param must be a valid boolean interpretation'
    )
      .optional()
      .isBoolean(),
    check(
      'iscedManage',
      'iscedManage query param must be a valid boolean interpretation'
    )
      .optional()
      .isBoolean(),
    check(
      'postTypeManage',
      'postTypeManage query param must be a valid boolean interpretation'
    )
      .optional()
      .isBoolean(),
    validateFields,
  ],
  adminsGet
)

router.get('/:id', [validateJWT, isMetaUserAdmin, validateFields], adminGet)
router.get(
  '/:id/subAdmins',
  [validateJWT, isMetaUserAdmin, validateFields],
  adminsGet
)

router.post(
  '/',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ adminManage: true }),
    check('adminId', 'userId field is required').notEmpty(),
    check(
      'adminId',
      'userId field value must match a-Z 0-9 _-. and length {3,15}'
    )
      .isAlphanumeric(undefined, { ignore: '_-.' })
      .isLength({ min: 3, max: 15 }),
    check('adminId').custom(existsMetaUserId),
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
    check('superAdmin', 'superAdmin must be a valid Mongo ObjectId')
      .optional()
      .isMongoId(),
    check('superAdmin').optional().custom(existsAdminByObjectId),
    validateFields,
  ],
  adminsPost
)

router.put(
  '/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ adminManage: true }),
    check(
      'adminId',
      'userId field value must match a-Z 0-9 _-. and length {3,15}'
    )
      .optional()
      .isAlphanumeric(undefined, { ignore: '_-.' })
      .isLength({ min: 3, max: 15 }),
    check('adminId').optional().custom(existsMetaUserId),
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
    check('superAdmin', 'superAdmin must be a valid Mongo ObjectId')
      .optional()
      .isMongoId(),
    check('superAdmin').optional().custom(existsAdminByObjectId),
    validateFields,
  ],
  adminsPut
)

router.delete(
  '/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ adminManage: true }),
    validateFields,
  ],
  adminsDelete
)

export default router
