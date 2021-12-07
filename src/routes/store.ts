import { Router } from 'express'
import { check } from 'express-validator'
import {
  createStoreItem,
  createStoreOrder,
  deleteStoreItem,
  deleteStoreOrder,
  getStoreItem,
  getStoreItems,
  getStoreOrder,
  getStoreOrders,
  modifyStoreItem,
  modifyStoreOrder,
} from '../controllers/store'
import {
  existsStoreItemByObjectId,
  existsStoreOrderByObjectId,
  existsUserByObjectId,
} from '../helpers/db-validators'
import validateFields from '../middlewares/validate-fields'
import validateJWT from '../middlewares/validate-jwt'
import {
  hasRoles,
  hasStoreOrderRoles,
  isMetaUserAdmin,
} from '../middlewares/validate-metauser'

const router = Router()

router.get(
  '/items/',
  [
    check('info.title', 'title must be alphanumeric and accepts [ñ._-]')
      .optional()
      .isAlphanumeric('es-ES', { ignore: ' .-_' }),
    check('price').optional().isFloat({ min: 0 }),
    check('abovePrice').optional().isFloat({ min: 0 }),
    check('belowPrice').optional().isFloat(),
    check('hasStock').optional().isFloat({ min: 0 }),
    validateFields,
  ],
  getStoreItems
)

router.get(
  '/items/:id',
  [
    check('id', 'id field must be a valid Mongo Object Id').isMongoId(),
    check('id').custom(existsStoreItemByObjectId),
    validateFields,
  ],
  getStoreItem
)

router.post(
  '/items/',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ storeManage: true }),
    check('info').notEmpty(),
    check(
      'info.title',
      'Title field must be at least 5 characters length'
    ).isLength({ min: 3 }),
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
    check('price', 'price field is required').notEmpty(),
    check(
      'price',
      'price field value must be a valid number(float) representation and greater than zero'
    ).isFloat({ min: 0 }),
    check('stock', 'stock field is required').notEmpty(),
    check(
      'stock',
      'stock field value must be a valid number representation and greater than zero'
    ).isInt({ min: 0 }),
    validateFields,
  ],
  createStoreItem
)

router.put(
  '/items/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ storeManage: true }),
    check('id', 'id field must be a valid Mongo Object Id').isMongoId(),
    check('id').custom(existsStoreItemByObjectId),
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
    check(
      'price',
      'price field value must be a valid number(float) representation and greater than zero'
    )
      .optional()
      .isFloat({ min: 0 }),
    check(
      'stock',
      'stock field value must be a valid number representation and greater than zero'
    )
      .optional()
      .isInt({ min: 0 }),
    check('isActive').optional().isBoolean(),
    validateFields,
  ],
  modifyStoreItem
)

router.delete(
  '/items/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ storeManage: true }),
    check('id', 'id field must be a valid Mongo Object Id').isMongoId(),
    check('id').custom(existsStoreItemByObjectId),
    validateFields,
  ],
  deleteStoreItem
)

router.get(
  '/orders/',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ storeOrdersManage: true }),
    check('purchaser', 'purchaser field must be a valid Mongo Object Id')
      .optional()
      .isMongoId(),
    check('purchaser').optional().custom(existsUserByObjectId),
    check('hasItem', 'hasItem field must be a valid Mongo ObjectId')
      .optional()
      .isMongoId(),
    check('hasItem').optional().custom(existsStoreItemByObjectId),
    check('method', 'method field must be [card, cash]')
      .optional()
      .isIn(['card', 'cash']),
    check(
      'purchasedDate',
      'purchasedDate field must be a valid ISO8601 date representation'
    )
      .optional()
      .isISO8601(),
    check(
      'beforeDate',
      'beforeDate field must be a valid ISO8601 date representation'
    )
      .optional()
      .isISO8601(),
    check(
      'afterDate',
      'afterDate field must be a valid ISO8601 date representation'
    )
      .optional()
      .isISO8601(),
    check('state', 'state field must be [pendant, confirmed, shipped]')
      .optional()
      .isIn(['pendant', 'confirmed', 'shipped']),
    check('isActive').optional().isBoolean(),
    validateFields,
  ],
  getStoreOrders
)

router.get(
  '/orders/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ storeOrdersManage: true }),
    check('id', 'id field must be a valid Mongo Object Id').isMongoId(),
    check('id').custom(existsStoreOrderByObjectId),
    validateFields,
  ],
  getStoreOrder
)

router.put(
  '/orders/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasStoreOrderRoles({ storeOrdersManage: true }),
    check('id', 'id field must be a valid Mongo Object Id').isMongoId(),
    check('id').custom(existsStoreOrderByObjectId),
    check('state', 'state is a field required to update this order').notEmpty(),
    check(
      'state',
      'state field value is not any of these values: [pendant, confirmed, shipped]'
    ).isIn(['pendant', 'confirmed', 'shipped']),
    validateFields,
  ],
  modifyStoreOrder
)

router.delete(
  '/orders/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasStoreOrderRoles({ storeOrdersManage: true }),
    check('id', 'id field must be a valid Mongo Object Id').isMongoId(),
    check('id').custom(existsStoreOrderByObjectId),
    validateFields,
  ],
  deleteStoreOrder
)

export default router
