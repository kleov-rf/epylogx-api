import { Router } from 'express'
import { check } from 'express-validator'
import {
  createPostType,
  deletePostType,
  getPostsByType,
  getPostType,
  getPostTypes,
  modifyPostType,
} from '../controllers/post-types'
import {
  existsPostTypeByObjectId,
  existsPostTypeByName,
} from '../helpers/db-validators'
import validateFields from '../middlewares/validate-fields'
import validateJWT from '../middlewares/validate-jwt'
import { hasRoles, isMetaUserAdmin } from '../middlewares/validate-metauser'

const router = Router()

router.get(
  '/',
  [
    check('isActive', 'isActive parameter must be an boolean representation')
      .optional()
      .isBoolean(),
    validateFields,
  ],
  getPostTypes
)
router.get(
  '/:id',
  [
    check('id', 'id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsPostTypeByObjectId),
    validateFields,
  ],
  getPostType
)

router.get(
  '/:id/posts',
  [
    check('id', 'id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsPostTypeByObjectId),
    validateFields,
  ],
  getPostsByType
)

router.post(
  '/',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ postTypeManage: true }),
    check('name', 'name is a required field').notEmpty(),
    check('name', 'name must be at least 3 characters long').isLength({
      min: 3,
    }),
    check('name').custom(existsPostTypeByName),
    check(
      'allowedExtensions',
      'allowedExtensions is a required field'
    ).notEmpty(),
    check('allowedExtensions', 'allowedExtensions must be an Array').isArray(),
    check(
      'allowedExtensions.*',
      'allowedExtensions must be an Array of alphanumeric Strings'
    ).isAlphanumeric(),
    validateFields,
  ],
  createPostType
)
router.put(
  '/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ postTypeManage: true }),
    check('id', 'id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsPostTypeByObjectId),
    check('name', 'name must be at least 3 characters long')
      .optional()
      .isLength({
        min: 3,
      }),
    check('name').optional().custom(existsPostTypeByName),
    check('allowedExtensions', 'allowedExtensions must be an Array')
      .optional()
      .isArray(),
    check(
      'allowedExtensions.*',
      'allowedExtensions must be an Array of alphanumeric Strings'
    )
      .optional()
      .isAlphanumeric(),
    validateFields,
  ],
  modifyPostType
)
router.delete(
  '/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ postTypeManage: true }),
    check('id', 'id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsPostTypeByObjectId),
    validateFields,
  ],
  deletePostType
)

export default router
