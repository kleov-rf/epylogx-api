import { Router } from 'express'
import { check } from 'express-validator'
import {
  getChatsEntries,
  createChatEntry,
  modifyChatEntry,
  deleteChatEntry,
  getChatEntry,
} from '../controllers/chats'
import {
  existsChatEntry,
  existsMetaUserbyObjectId,
  existsUserByObjectId,
} from '../helpers/db-validators'
import validateFields from '../middlewares/validate-fields'
import validateJWT from '../middlewares/validate-jwt'
import {
  hasChatEntryRoles,
  hasChatRoles,
  hasRoles,
  isMetaUserAdmin,
  isSameMetaUserModel,
} from '../middlewares/validate-metauser'

const router = Router()

router.get(
  '/',
  [
    validateJWT,
    hasChatRoles({ adminManage: true }),
    check('from', 'from field value must be a valid Mongo ObjectId')
      .optional()
      .isMongoId(),
    check('from').optional().custom(existsMetaUserbyObjectId),
    check('to', 'to field value must be a valid Mongo ObjectId')
      .optional()
      .isMongoId(),
    check('to').optional().custom(existsMetaUserbyObjectId),
    isSameMetaUserModel,
    check('text', 'text field value must be alphanumeric and accepts ñ')
      .optional()
      .isAlphanumeric('es-ES'),
    check(
      'recentDays',
      'recentDays field value must be a valid number representation, minimun 0'
    )
      .optional()
      .isInt({ min: 0 }),
    check(
      'isLiked',
      'isLiked field value must be a valid boolean representation'
    )
      .optional()
      .isBoolean(),
    validateFields,
  ],
  getChatsEntries
)

router.get(
  '/:id',
  [
    validateJWT,
    check('id', 'id field must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsChatEntry),
    hasChatEntryRoles({ userManage: true }),
    validateFields,
  ],
  getChatEntry
)

router.post(
  '/',
  [
    validateJWT,
    check('transmitter', 'transmitter field must not be empty').notEmpty(),
    check(
      'transmitter',
      'transmitter must be a valid Mongo Object Id'
    ).isMongoId(),
    check('transmitter').custom(existsMetaUserbyObjectId),
    check('receiver', 'receiver field must not be empty').notEmpty(),
    check('receiver', 'receiver must be a valid Mongo Object Id').isMongoId(),
    check('receiver').custom(existsMetaUserbyObjectId),
    isSameMetaUserModel,
    check('text', 'text field is required').notEmpty(),
    check('text', 'text value must be at least one character long').isLength({
      min: 1,
    }),
    check('sentDate', 'sentDate field is required').notEmpty(),
    check(
      'sentDate',
      'sentDate must be a valid IS8601 date representation'
    ).isISO8601(),
    validateFields,
  ],
  createChatEntry
)

router.put(
  '/:id',
  [
    validateJWT,
    check('id', 'id field must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsChatEntry),
    hasChatEntryRoles({}),
    check('text', 'text value must be at least one character long')
      .optional()
      .isLength({
        min: 1,
      }),
    check('isLiked', 'isLiked field value must be valid boolean representation')
      .optional()
      .isBoolean(),
    check(
      'isHidden',
      'isHidden field value must be valid boolean representation'
    )
      .optional()
      .isBoolean(),
    validateFields,
  ],
  modifyChatEntry
)

router.delete(
  '/:id',
  [
    validateJWT,
    check('id', 'id field must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsChatEntry),
    hasChatEntryRoles({ userManage: true }),
    validateFields,
  ],
  deleteChatEntry
)

export default router
