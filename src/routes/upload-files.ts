import { Router } from 'express'
import { check } from 'express-validator'
import {
  updateAdminPhoto,
  updateCategoryPhoto,
  updatePodcastPhoto,
  updatePostFiles,
  updateStoreItemPhoto,
  updateUserPhotos,
} from '../controllers/upload-files'
import {
  existsAdminByObjectId,
  existsCategoryByObjectId,
  existsPodcastByObjectId,
  existsPostByObjectId,
  existsStoreItemByObjectId,
  existsUserByObjectId,
} from '../helpers/db-validators'
import validateFields from '../middlewares/validate-fields'
import validateFiles from '../middlewares/validate-files'
import validateJWT from '../middlewares/validate-jwt'
import {
  hasRoles,
  isMetaUserAdmin,
  hasPodcastRules,
  hasPostRoles,
} from '../middlewares/validate-metauser'

const router = Router()

router.post(
  '/category/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ categoryManage: true }),
    check('id', 'category id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsCategoryByObjectId),
    validateFiles,
    validateFields,
  ],
  updateCategoryPhoto
)
router.post(
  '/podcast/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasPodcastRules({ podcastManage: true }),
    check('id', 'podcast id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsPodcastByObjectId),
    validateFiles,
    validateFields,
  ],
  updatePodcastPhoto
)
router.post(
  '/post/:id',
  [
    validateJWT,
    hasPostRoles({ postManage: true }),
    check('id', 'post id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsPostByObjectId),
    validateFiles,
    validateFields,
  ],
  updatePostFiles
)
router.post(
  '/store-item/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ storeManage: true }),
    check('id', 'store-item id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsStoreItemByObjectId),
    validateFiles,
    validateFields,
  ],
  updateStoreItemPhoto
)
router.post(
  '/user/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ userManage: true }),
    check('id', 'user id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsUserByObjectId),
    validateFiles,
    validateFields,
  ],
  updateUserPhotos
)
router.post(
  '/admin/:id',
  [
    validateJWT,
    isMetaUserAdmin,
    hasRoles({ adminManage: true }),
    check('id', 'admin id must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsAdminByObjectId),
    validateFiles,
    validateFields,
  ],
  updateAdminPhoto
)

export default router
