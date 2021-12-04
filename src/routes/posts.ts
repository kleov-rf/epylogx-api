import { Router } from 'express'
import { check } from 'express-validator'
import {
  getPost,
  getPosts,
  createPost,
  modifyPost,
  deletePost,
} from '../controllers/posts'
import {
  existsCategoryByObjectId,
  existsPostByObjectId,
  existsPostTypeByObjectId,
  existsUserByObjectId,
} from '../helpers/db-validators'
import validateFields from '../middlewares/validate-fields'
import validateJWT from '../middlewares/validate-jwt'
import {
  hasPostRoles,
  isMetaUserAdmin,
  isMetaUserNotAdmin,
} from '../middlewares/validate-metauser'

const router = Router()

router.get(
  '/',
  [
    check('title', 'title must be alphanumeric and accepts [ñ._-]')
      .optional()
      .isAlphanumeric('es-ES', { ignore: ' .-_' }),
    check('type', 'type must be a valid Mongo ObjectId').optional().isMongoId(),
    check('type').optional().custom(existsPostTypeByObjectId),
    check(
      'beforeUploadDate',
      'field beforeUploadDate must be an ISO8601 date representation'
    )
      .optional()
      .isISO8601(),
    check(
      'afterUploadDate',
      'field afterUploadDate must be an ISO8601 date representation'
    )
      .optional()
      .isISO8601(),
    check(
      'beforeReleaseDate',
      'field beforeReleaseDate must be an ISO8601 date representation'
    )
      .optional()
      .isISO8601(),
    check(
      'afterReleaseDate',
      'field afterReleaseDate must be an ISO8601 date representation'
    )
      .optional()
      .isISO8601(),
    check(
      'isApproved',
      'field isApproved must be a valid boolean representation'
    )
      .optional()
      .isBoolean(),
    check('isActive', 'field isApproved must be a valid boolean representation')
      .optional()
      .isBoolean(),
    validateFields,
  ],
  getPosts
)

router.get(
  '/:id',
  [
    check('id', 'id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsPostByObjectId),
    validateFields,
  ],
  getPost
)

router.post(
  '/',
  [
    validateJWT,
    isMetaUserNotAdmin,
    check('info').notEmpty(),
    check(
      'info.title',
      'Title field must be at least 5 characters length'
    ).isLength({ min: 5 }),
    check(
      'info.title',
      'title must be alphanumeric and accepts [ñ._-]'
    ).isAlphanumeric('es-ES', { ignore: ' .-_' }),
    check(
      'info.description',
      'descripton field must be at least 5 characters length'
    ).isLength({ min: 5 }),
    check(
      'info.description',
      'descripton must be alphanumeric and accepts [ñ._-]'
    ).isAlphanumeric('es-ES', { ignore: ' .-_' }),
    check('type', 'type field must be a valid Mongo ObjectId').isMongoId(),
    check('type').custom(existsPostTypeByObjectId),
    check('authors', 'authors field is required').notEmpty(),
    check('authors', 'authors field must be an array').isArray(),
    check(
      'authors.*',
      'authors field must be an array of user Mongo ObjectIds'
    ).isMongoId(),
    check('authors.*').custom(existsUserByObjectId),
    check('categories', 'categories field is required').notEmpty(),
    check('categories', 'categories field must be an array').isArray(),
    check(
      'categories.*',
      'categories field must be an array of category Mongo ObjectIds'
    ).isMongoId(),
    check('categories.*').custom(existsCategoryByObjectId),
    check('social', 'social object is required').optional().notEmpty(),
    check('social.commentsEnabled').optional().isBoolean(),
    check('uploadDate').isISO8601(),
    check('releaseDate').optional().isISO8601(),
    validateFields,
  ],
  createPost
)

router.put(
  '/:id',
  [
    validateJWT,
    hasPostRoles({ postManage: true }),
    check('id', 'id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsPostByObjectId),
    check('info.title', 'Title field must be at least 5 characters length')
      .optional()
      .isLength({ min: 5 }),
    check('info.title', 'title must be alphanumeric and accepts [ñ._-]')
      .optional()
      .isAlphanumeric('es-ES', { ignore: ' .-_' }),
    check(
      'info.description',
      'descripton field must be at least 5 characters length'
    )
      .optional()
      .isLength({ min: 5 }),
    check(
      'info.description',
      'descripton must be alphanumeric and accepts [ñ._-]'
    )
      .optional()
      .isAlphanumeric('es-ES', { ignore: ' .-_' }),
    check('authors', 'authors field must be an array').optional().isArray(),
    check('authors.*', 'authors field must be an array of user Mongo ObjectIds')
      .optional()
      .isMongoId(),
    check('authors.*').optional().custom(existsUserByObjectId),
    check('categories', 'categories field must be an array')
      .optional()
      .isArray(),
    check(
      'categories.*',
      'categories field must be an array of category Mongo ObjectIds'
    )
      .optional()
      .isMongoId(),
    check('categories.*').optional().custom(existsCategoryByObjectId),
    check('social.commentsEnabled').optional().isBoolean(),
    check('releaseDate').optional().isISO8601(),
    check('isActive').optional().isBoolean(),
    check('isApproved').optional().isBoolean(),
    validateFields,
  ],
  modifyPost
)

router.delete(
  '/:id',
  [
    validateJWT,
    hasPostRoles({ postManage: true }),
    check('id', 'id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsPostByObjectId),
    validateFields,
  ],
  deletePost
)

export default router
