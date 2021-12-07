import { Router } from 'express'
import { check } from 'express-validator'
import {
  createComment,
  deleteComment,
  getComment,
  getCommentReplies,
  getComments,
  modifyComment,
} from '../controllers/comments'
import {
  existsPostByObjectId,
  existsUserByObjectId,
  existsCommentByObjectId,
} from '../helpers/db-validators'
import validateFields from '../middlewares/validate-fields'
import validateJWT from '../middlewares/validate-jwt'
import {
  hasCommentRoles,
  hasPostRoles,
  isMetaUserAdmin,
} from '../middlewares/validate-metauser'

const router = Router()

router.get(
  '/',
  [
    validateJWT,
    isMetaUserAdmin,
    hasCommentRoles({ postManage: true }),
    check('text', 'text field must be at least one character long')
      .optional()
      .isLength({ min: 1 }),
    check('isHidden', 'isHidden field must be a valid boolean representation')
      .optional()
      .isBoolean(),
    check('author', 'author field must be a valid Mongo Object Id')
      .optional()
      .isMongoId(),
    check('author').optional().custom(existsUserByObjectId),
    check('post', 'post field must be a valid Mongo Object Id')
      .optional()
      .isMongoId(),
    check('post').optional().custom(existsPostByObjectId),
    validateFields,
  ],
  getComments
)

router.get(
  '/:id',
  [
    validateJWT,
    hasCommentRoles({ postManage: true }),
    check('id', 'Comment Id must be a valid Mongo ObjectId'),
    check('id').custom(existsCommentByObjectId),
    validateFields,
  ],
  getComment
)

router.get(
  '/:id/replies',
  [
    check('id', 'Comment Id must be a valid Mongo ObjectId'),
    check('id').custom(existsCommentByObjectId),
    validateFields,
  ],
  getCommentReplies
)

router.post(
  '/',
  [
    validateJWT,
    check('author', 'author field is required').notEmpty(),
    check('author', 'author field must be a valid Mongo Object Id').isMongoId(),
    check('author').custom(existsUserByObjectId),
    check('post', 'post field is required').notEmpty(),
    check('post', 'post field must be a valid Mongo Object Id').isMongoId(),
    check('post').custom(existsPostByObjectId),
    check('superComment', 'superComment field must be a valid Mongo Object Id')
      .optional()
      .isMongoId(),
    check('superComment').optional().custom(existsCommentByObjectId),
    check('text', 'text field is required').notEmpty(),
    check('text', 'text field must be at least one character long').isLength({
      min: 1,
    }),
    validateFields,
  ],
  createComment
)

router.put(
  '/:id',
  [
    validateJWT,
    hasCommentRoles({}),
    check('id', 'Comment Id must be a valid Mongo ObjectId'),
    check('id').custom(existsCommentByObjectId),
    check('text', 'text field must be at least one character long')
      .optional()
      .isLength({
        min: 1,
      }),
    check('likes', 'likes field must be a valid number representation')
      .optional()
      .isInt(),
    check('isHidden', 'isHidden field must be a valid boolean representation')
      .optional()
      .isBoolean(),
    validateFields,
  ],
  modifyComment
)

router.delete(
  '/:id',
  [
    validateJWT,
    hasCommentRoles({ postManage: true }),
    check('id', 'Comment Id must be a valid Mongo ObjectId'),
    check('id').custom(existsCommentByObjectId),
    validateFields,
  ],
  deleteComment
)

export default router
