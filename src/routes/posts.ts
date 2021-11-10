import { Router } from 'express'
import {
  postsDelete,
  postsGet,
  postsPost,
  postsPut,
} from '../controllers/posts'

const router = Router()

router.get('/', [], postsGet)

router.get('/:id', [], postsGet)

router.post('/', [], postsPost)

router.put('/:id', [], postsPut)

router.delete('/:id', [], postsDelete)

export default router
