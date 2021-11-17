import { Router } from 'express'
import { check } from 'express-validator'
import {
  categoriesDelete,
  categoriesGet,
  categoriesPost,
  categoriesPut,
  categoryBranchesGet,
  categoryGet,
} from '../controllers/categories'
import {
  existsCategoryByObjectId,
  existsCategoryByTitle,
  existsISCEDByObjectId,
} from '../helpers/db-validators'
import validateFields from '../middlewares/validate-fields'
import validateJWT from '../middlewares/validate-jwt'
import { hasRoles, isMetaUserAdmin } from '../middlewares/validate-metauser'

const router = Router()

router.get(
  '/',
  [
    check('belowISCED', 'belowISCED must be a numeric value')
      .optional()
      .isNumeric(),
    check('aboveISCED', 'aboveISCED must be a numeric value')
      .optional()
      .isNumeric(),
  ],
  categoriesGet
)

router.get(
  '/:id',
  [
    check('id', 'category id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsCategoryByObjectId),
    validateFields,
  ],
  categoryGet
)

router.get(
  '/:id/branches',
  [
    check('id', 'category id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsCategoryByObjectId),
    validateFields,
  ],
  categoryBranchesGet
)
router.get(
  '/:id/posts',
  [
    check('id', 'category id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsCategoryByObjectId),
    validateFields,
  ],
  categoriesGet
)

router.post(
  '/',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ categoryManage: true }),
    check('title', 'Category title is required').notEmpty(),
    check('title', 'Category title must only contain letters').isAlpha(
      undefined,
      { ignore: ' ' }
    ),
    check('title').custom(existsCategoryByTitle),
    check(
      'superCategory',
      'This main Category value is not a valid Mongo ObjectId'
    )
      .optional()
      .isMongoId(),
    check('superCategory').optional().custom(existsCategoryByObjectId),
    check('isced', 'category isced level is required').notEmpty(),
    check(
      'isced',
      'category isced value must be a valid Mongo ObjectId'
    ).isMongoId(),
    check('isced').custom(existsISCEDByObjectId),
    check('description', 'category description is required').notEmpty(),
    validateFields,
  ],
  categoriesPost
)

router.put(
  '/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ categoryManage: true }),
    check('id', 'category id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsCategoryByObjectId),
    check('title', 'Category title must only contain letters')
      .optional()
      .isAlpha(undefined, { ignore: ' ' }),
    check('title').optional().custom(existsCategoryByTitle),
    check(
      'superCategory',
      'This main Category value is not a valid Mongo ObjectId'
    )
      .optional()
      .isMongoId(),
    check('superCategory').optional().custom(existsCategoryByObjectId),
    check('isced', 'category isced value must be a valid Mongo ObjectId')
      .optional()
      .isMongoId(),
    check('isced').optional().custom(existsISCEDByObjectId),
    validateFields,
  ],
  categoriesPut
)

router.delete(
  '/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ categoryManage: true }),
    check('id', 'category id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsCategoryByObjectId),
    validateFields,
  ],
  categoriesDelete
)

export default router
