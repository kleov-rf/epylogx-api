import { Router } from 'express'
import {
  chatsDelete,
  chatsGet,
  chatsPost,
  chatsPut,
} from '../controllers/chats'

const router = Router()

router.get('/', [], chatsGet)

router.get('/:id', [], chatsGet)

router.post('/', [], chatsPost)

router.put('/:id', [], chatsPut)

router.delete('/:id', [], chatsDelete)

export default router
