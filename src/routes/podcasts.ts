import { Router } from 'express'
import {
  podcastDelete,
  podcastGet,
  podcastPost,
  podcastPut,
} from '../controllers/podcasts'

const router = Router()

router.get('/', [], podcastGet)

router.get('/:id', [], podcastGet)

router.post('/', [], podcastPost)

router.put('/:id', [], podcastPut)

router.delete('/:id', [], podcastDelete)

export default router
