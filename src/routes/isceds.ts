import { Router } from 'express'
import { check } from 'express-validator'
import {
  createISCED,
  deleteISCED,
  getISCED,
  getISCEDCategories,
  getISCEDS,
  updateISCED,
} from '../controllers/isceds'
import {
  existsISCEDByObjectId,
  existsISCEDByLevel,
} from '../helpers/db-validators'
import validateFields from '../middlewares/validate-fields'
import validateJWT from '../middlewares/validate-jwt'
import { hasRoles, isMetaUserAdmin } from '../middlewares/validate-metauser'

const router = Router()

router.get(
  '/',
  [
    check(
      'aboveLevel',
      'aboveLevel parameter must be an integer representation'
    )
      .optional()
      .isInt(),
    check(
      'belowLevel',
      'belowLevel parameter must be an integer representation'
    )
      .optional()
      .isInt(),
    check('isActive', 'isActive parameter must be an boolean representation')
      .optional()
      .isBoolean(),
    validateFields,
  ],
  getISCEDS
)

router.get(
  '/:id',
  [
    check('id', 'id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsISCEDByObjectId),
    validateFields,
  ],
  getISCED
)

router.get(
  '/:id/categories',
  [
    check('id', 'id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsISCEDByObjectId),
    validateFields,
  ],
  getISCEDCategories
)

router.post(
  '/',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ iscedManage: true }),
    check('level', 'level is a required field').notEmpty(),
    check('level', 'level must be an integer value').isInt(),
    check('level', 'This level already exists')
      .not()
      .custom(existsISCEDByLevel),
    check(
      'description',
      'ISCED description must at least 5 characters long.'
    ).isLength({ min: 5 }),
    validateFields,
  ],
  createISCED
)

router.put(
  '/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ iscedManage: true }),
    check('id', 'id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsISCEDByObjectId),
    check('level', 'level must be an integer value').optional().isInt(),
    check('level', 'This level already exists')
      .optional()
      .not()
      .custom(existsISCEDByLevel),
    check('description', 'ISCED description must at least 5 characters long.')
      .optional()
      .isLength({ min: 5 }),
    validateFields,
  ],
  updateISCED
)

router.delete(
  '/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ iscedManage: true }),
    check('id', 'id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsISCEDByObjectId),
    validateFields,
  ],
  deleteISCED
)

export default router
