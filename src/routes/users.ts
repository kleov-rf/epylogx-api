import { Router } from 'express'
import { check } from 'express-validator'
import { createStoreOrder } from '../controllers/store'
import {
  createUserFollowing,
  createUserInterest,
  createUserLikedPost,
  createUserSavedPost,
  getUserFollowers,
  getUserFollowings,
  getUserInterests,
  getUserLikedPosts,
  getUserPodcasts,
  getUserPosts,
  getUserRecentChats,
  getUserSavedPosts,
  getUserStoreOrders,
  notifyUserFollowing,
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
  existsStoreItemByObjectId,
  existsCategoryByObjectId,
  existsPostByObjectId,
} from '../helpers/db-validators'
import validateFields from '../middlewares/validate-fields'
import validateJWT from '../middlewares/validate-jwt'
import { hasRoles } from '../middlewares/validate-metauser'

const router = Router()

router.get(
  '/',
  [
    check('userId', 'userId field value must be alphanumeric')
      .optional()
      .isAlphanumeric(),
    check('email', 'email field value must be alphanumeric and ignores @._-')
      .optional()
      .isAlphanumeric(undefined, { ignore: '@._-' }),
    check('name', 'name field value accepts [A-zñ]')
      .optional()
      .isAlpha('es-ES'),
    check(
      'isActive',
      'isActive field value must be a valid boolean representation'
    )
      .optional()
      .isBoolean(),
    validateFields,
  ],
  usersGet
)

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

router.get(
  '/:id/interests',
  [
    validateJWT,
    hasRoles({ userManage: true }),
    check('id', 'id field value must be a valid Mongo ObjecId').isMongoId(),
    check('id').custom(existsUserByObjectId),
    validateFields,
  ],
  getUserInterests
)
router.post(
  '/:id/interests',
  [
    validateJWT,
    hasRoles({ userManage: true }),
    check('id', 'id field value must be a valid Mongo ObjecId').isMongoId(),
    check('id').custom(existsUserByObjectId),
    check(
      'category',
      'category field value must be a valid Mongo ObjecId'
    ).isMongoId(),
    check('category').custom(existsCategoryByObjectId),
    validateFields,
  ],
  createUserInterest
)

router.get(
  '/:id/posts',
  [
    validateJWT,
    hasRoles({ userManage: true }),
    check('id', 'id field value must be a valid Mongo ObjecId').isMongoId(),
    check('id').custom(existsUserByObjectId),
    validateFields,
  ],
  getUserPosts
)

router.get(
  '/:id/likedPosts',
  [
    validateJWT,
    hasRoles({ userManage: true }),
    check('id', 'id field value must be a valid Mongo ObjecId').isMongoId(),
    check('id').custom(existsUserByObjectId),
    validateFields,
  ],
  getUserLikedPosts
)
router.post(
  '/:id/likedPosts',
  [
    validateJWT,
    hasRoles({ userManage: true }),
    check('id', 'id field value must be a valid Mongo ObjecId').isMongoId(),
    check('id').custom(existsUserByObjectId),
    check('post', 'post field value must be a valid Mongo ObjecId').isMongoId(),
    check('post').custom(existsPostByObjectId),
    validateFields,
  ],
  createUserLikedPost
)

router.get(
  '/:id/savedPosts',
  [
    validateJWT,
    hasRoles({ userManage: true }),
    check('id', 'id field value must be a valid Mongo ObjecId').isMongoId(),
    check('id').custom(existsUserByObjectId),
    validateFields,
  ],
  getUserSavedPosts
)
router.post(
  '/:id/savedPosts',
  [
    validateJWT,
    hasRoles({ userManage: true }),
    check('id', 'id field value must be a valid Mongo ObjecId').isMongoId(),
    check('id').custom(existsUserByObjectId),
    check('post', 'post field value must be a valid Mongo ObjecId').isMongoId(),
    check('post').custom(existsPostByObjectId),
    validateFields,
  ],
  createUserSavedPost
)

router.get(
  '/:id/podcasts',
  [
    validateJWT,
    hasRoles({ userManage: true }),
    check('id', 'id field value must be a valid Mongo ObjecId').isMongoId(),
    check('id').custom(existsUserByObjectId),
    validateFields,
  ],
  getUserPodcasts
)

router.get(
  '/:id/chats',
  [
    validateJWT,
    hasRoles({ userManage: true }),
    check('id', 'id field value must be a valid Mongo ObjecId').isMongoId(),
    check('id').custom(existsUserByObjectId),
    check(
      'days',
      'days field value must be a valid number representation, minimum 1'
    )
      .optional()
      .isInt({ min: 1 }),
    validateFields,
  ],
  getUserRecentChats
)

router.get(
  '/:id/followers',
  [
    validateJWT,
    hasRoles({ userManage: true }),
    check('id', 'id field value must be a valid Mongo ObjecId').isMongoId(),
    check('id').custom(existsUserByObjectId),
    validateFields,
  ],
  getUserFollowers
)

router.get(
  '/:id/following',
  [
    validateJWT,
    hasRoles({ userManage: true }),
    check('id', 'id field value must be a valid Mongo ObjecId').isMongoId(),
    check('id').custom(existsUserByObjectId),
    validateFields,
  ],
  getUserFollowings
)

router.post(
  '/:id/following',
  [
    validateJWT,
    hasRoles({ userManage: true }),
    check('id', 'id field must be a valid Mongo ObjecId').isMongoId(),
    check('id').custom(existsUserByObjectId),
    check(
      'followed',
      'followed field must be a valid Mongo ObjecId'
    ).isMongoId(),
    check('followed').custom(existsUserByObjectId),
    validateFields,
  ],
  createUserFollowing
)

router.put(
  '/:id/following',
  [
    validateJWT,
    hasRoles({ userManage: true }),
    check('id', 'id field must be a valid Mongo ObjecId').isMongoId(),
    check('id').custom(existsUserByObjectId),
    check(
      'followed',
      'followed field must be a valid Mongo ObjecId'
    ).isMongoId(),
    check('followed').custom(existsUserByObjectId),
    check('notify', 'notify field is required').notEmpty(),
    check(
      'notify',
      'notify field value must be a valid boolean representation'
    ).isBoolean(),
    validateFields,
  ],
  notifyUserFollowing
)

router.get(
  '/:id/orders',
  [
    validateJWT,
    hasRoles({ userManage: true }),
    check('id', 'id field value must be a valid Mongo ObjecId').isMongoId(),
    check('id').custom(existsUserByObjectId),
    validateFields,
  ],
  getUserStoreOrders
)
router.post(
  '/:id/orders',
  [
    validateJWT,
    hasRoles({ storeOrdersManage: true }),
    check('id', 'not a mongo ObjecId').isMongoId(),
    check('id').custom(existsUserByObjectId),
    check('ticket', 'ticket field value must not be empty').notEmpty(),
    check('ticket', 'ticket must be a valid storeItem, units array').isArray(),
    check(
      'ticket.*.storeItem',
      'storeItems fields in ticket Object are required'
    ).notEmpty(),
    check('ticket.*.storeItem').custom(existsStoreItemByObjectId),
    check(
      'ticket.*.units',
      'units fields in ticket Object are required'
    ).notEmpty(),
    check(
      'ticket.*.units',
      'units fields in ticket Object must be number valid representation'
    ).isInt({ min: 0 }),
    check('method', 'method field is required').notEmpty(),
    check('method', 'method field value must be [card, cash]').isIn([
      'card',
      'cash',
    ]),
    check('address', 'address field is required').notEmpty(),
    check(
      'address',
      'address must be alphanumeric and accepts [ñ, #-]'
    ).isAlphanumeric('es-ES', { ignore: 'ñ, #-' }),
    check('purchasedDate', 'purchasedDate field is required').notEmpty(),
    check(
      'purchasedDate',
      'purchasedDate field value must be a valid ISO8601 date representation'
    ).isISO8601(),
    validateFields,
  ],
  createStoreOrder
)

export default router
