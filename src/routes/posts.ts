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
import { hasPostRoles } from '../middlewares/validate-metauser'

const router = Router()

router.get('/', [], getPost)

router.get(
  '/:id',
  [
    check('id', 'id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsPostByObjectId),
    validateFields,
  ],
  getPosts
)

router.post(
  '/',
  [
    validateJWT,
    check('info').notEmpty(),
    check(
      'info.title',
      'Title field must be at least 5 characters length'
    ).isLength({ min: 5 }),
    check(
      'info.title',
      'title must be be alphanumeric and accepts [ñ._-]'
    ).isAlphanumeric('es-ES', { ignore: ' .-_' }),
    check(
      'info.description',
      'descripton field must be at least 5 characters length'
    ).isLength({ min: 5 }),
    check(
      'info.description',
      'descripton must be be alphanumeric and accepts [ñ._-]'
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
