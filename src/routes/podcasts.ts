import { Router } from 'express'
import { check } from 'express-validator'
import {
  createPodcast,
  deletePodcast,
  getPodcast,
  getPodcastOwners,
  getPodcastPosts,
  getPodcasts,
  modifyPodcast,
} from '../controllers/podcasts'
import {
  existsPodcastById,
  existsUserByObjectId,
} from '../helpers/db-validators'
import validateFields from '../middlewares/validate-fields'
import validateJWT from '../middlewares/validate-jwt'
import { hasPodcastRules } from '../middlewares/validate-metauser'

const router = Router()

router.get(
  '/',
  [
    check(
      'title',
      'title field must be alphanumeric and allows spanish variations and spaces'
    )
      .optional()
      .isAlphanumeric('es-ES', {
        ignore: ' ',
      }),
    check('podcastId', 'podcastId field must be alphanumeric')
      .optional()
      .isAlphanumeric(),
    validateFields,
  ],
  getPodcasts
)

router.get(
  '/:id',
  [check('id').custom(existsPodcastById), validateFields],
  getPodcast
)

router.get(
  '/:id/posts',
  [
    check('id', 'id field must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsPodcastById),
    validateFields,
  ],
  getPodcastPosts
)

router.get(
  '/:id/owners',
  [
    check('id', 'id field must be a valid Mongo ObjectId').isMongoId(),
    check('id').custom(existsPodcastById),
    validateFields,
  ],
  getPodcastOwners
)

router.post(
  '/',
  [
    validateJWT,
    check('podcastId', 'podcastId field is required').notEmpty(),
    check('podcastId', 'podcastId must be alphanumeric value').isAlphanumeric(),
    check('podcastId', 'this podcastId is already taken')
      .not()
      .custom(existsPodcastById),
    check('owners', 'owners field is required').notEmpty(),
    check('owners', 'owners field must be an array').isArray(),
    check(
      'owners.*',
      'owners field must be an array of user Mongo ObjectIds'
    ).isMongoId(),
    check('owners.*').custom(existsUserByObjectId),
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
    validateFields,
  ],
  createPodcast
)

router.put(
  '/:id',
  [
    validateJWT,
    hasPodcastRules({ podcastManage: true }),
    check('id', 'id field must be a valid Mongo Object Id').isMongoId(),
    check('id').custom(existsPodcastById),
    check('podcastId', 'podcastId must be alphanumeric value')
      .optional()
      .isAlphanumeric(),
    check('podcastId', 'this podcastId is already taken')
      .optional()
      .not()
      .custom(existsPodcastById),
    check('owners', 'owners field must be an array').optional().isArray(),
    check('owners.*', 'owners field must be an array of user Mongo ObjectIds')
      .optional()
      .isMongoId(),
    check('owners.*').optional().custom(existsUserByObjectId),
    check('categories', 'categories field must be an array')
      .optional()
      .isArray(),
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
    validateFields,
  ],
  modifyPodcast
)

router.delete(
  '/:id',
  [
    validateJWT,
    hasPodcastRules({ podcastManage: true }),
    check('id', 'id field must be a valid Mongo Object Id').isMongoId(),
    check('id').custom(existsPodcastById),
    validateFields,
  ],
  deletePodcast
)

export default router
