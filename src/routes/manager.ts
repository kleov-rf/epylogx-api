import { Router } from 'express'
import { check } from 'express-validator'
import {
  getManagerRecord,
  getManagerRecords,
  createManagerRecord,
  getPostReports,
  getPostReport,
  createPostReport,
  modifyPostReport,
  deletePostReport,
  getPostsToApprove,
  getPostToApprove,
} from '../controllers/manager'
import {
  existsAdminByObjectId,
  existsPostByObjectId,
  existsPostReport,
  existsRecordActionObject,
  existsRecordEntry,
  existsUserByObjectId,
} from '../helpers/db-validators'
import validateFields from '../middlewares/validate-fields'
import validateJWT from '../middlewares/validate-jwt'
import { hasRoles, isMetaUserAdmin } from '../middlewares/validate-metauser'

const router = Router()

router.get(
  '/records',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ adminManage: true }),
    check('action').optional().isLength({ min: 2 }),
    check('by', 'by field value must be a valid Mongo Admin ObjectId')
      .optional()
      .isMongoId(),
    check('by').optional().custom(existsAdminByObjectId),
    check('to', 'to field value must be valid Mongo Object Id')
      .optional()
      .isMongoId(),
    check('to').optional().custom(existsRecordActionObject),
    check('toType')
      .optional()
      .isIn([
        'User',
        'Admin',
        'Post',
        'StoreItem',
        'StoreOrder',
        'Category',
        'Report',
        'Comment',
        'Isced',
        'Podcast',
      ]),
    check('beforeDate').optional().isISO8601(),
    check('afterDate').optional().isISO8601(),
    check('date').optional().isISO8601(),
    validateFields,
  ],
  getManagerRecords
)

router.get(
  '/records/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ adminManage: true }),
    check('id', 'id field value must be a valid Mongo ObjectId'),
    check('id').custom(existsRecordEntry),
    validateFields,
  ],
  getManagerRecord
)

router.post(
  '/records',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ adminManage: true }),
    check('action', 'action field is required').notEmpty(),
    check(
      'action',
      'action field value must be at least 2 characters long'
    ).isLength({ min: 2 }),
    check('by', 'by field is required').notEmpty(),
    check(
      'by',
      'by field value must be a valid Mongo Admin ObjectId'
    ).isMongoId(),
    check('by').custom(existsAdminByObjectId),
    check('to.id', 'to.id field is required').notEmpty(),
    check(
      'to.id',
      'to.id field value must be valid Mongo Object Id'
    ).isMongoId(),
    check('to.id').custom(existsRecordActionObject),
    check('to.type', 'to.type field is required'),
    check(
      'to.type',
      'to.type field value must be [User, Admin, Post, StoreItem, StoreOrder, Category, Report, Comment, Isced, Podcast]'
    ).isIn([
      'User',
      'Admin',
      'Post',
      'StoreItem',
      'StoreOrder',
      'Category',
      'Report',
      'Comment',
      'Isced',
      'Podcast',
    ]),
    check(
      'description',
      'description field value must be at least 2 characters long'
    ).isLength({ min: 2 }),
    check(
      'recordDate',
      'recordDate field value must be a valid ISO8601 date representation'
    ).isISO8601(),
    validateFields,
  ],
  createManagerRecord
)

router.get(
  '/reports',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ postManage: true }),
    check('mainCause').optional().isLength({ min: 2 }),
    check('description').optional().isLength({ min: 2 }),
    check('author', 'author field value must be a valid Mongo ObjectId')
      .optional()
      .isMongoId(),
    check('author').optional().custom(existsUserByObjectId),
    check('post', 'post field value must be a valid Mongo ObjectId')
      .optional()
      .isMongoId(),
    check('post').optional().custom(existsPostByObjectId),
    check(
      'isResolved',
      'isResolved field value must be a valid boolean representation'
    )
      .optional()
      .isBoolean(),
    validateFields,
  ],
  getPostReports
)

router.get(
  '/reports/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ postManage: true }),
    check('id', 'id field value must be valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsPostReport),
    validateFields,
  ],
  getPostReport
)

router.post(
  '/reports',
  [
    validateJWT,
    check('mainCause').notEmpty(),
    check('description').optional().isLength({ min: 5 }),
    check(
      'author',
      'author field value must be a valid Mongo ObjectId'
    ).isMongoId(),
    check('author').custom(existsUserByObjectId),
    check(
      'post',
      'post field value must be a valid Mongo ObjectId'
    ).isMongoId(),
    check('post').custom(existsPostByObjectId),
    validateFields,
  ],
  createPostReport
)

router.put(
  '/reports/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ postManage: true }),
    check('id', 'id field value must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsPostReport),
    check('isResolved', 'isResolved field is required').notEmpty(),
    check(
      'isResolved',
      'isResolved field value must be a valid boolean representation'
    ).isBoolean(),
    validateFields,
  ],
  modifyPostReport
)

router.delete(
  '/reports/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ adminManage: true, postManage: true }),
    check('id', 'id field value must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsPostReport),

    validateFields,
  ],
  deletePostReport
)

router.get(
  '/approve',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ postManage: true }),
    validateFields,
  ],
  getPostsToApprove
)

router.get(
  '/approve/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ postManage: true }),
    check('id', 'id field value must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsPostByObjectId),
    validateFields,
  ],
  getPostToApprove
)

export default router
