import { Router } from 'express'
import {
  managerDelete,
  managerGet,
  managerPost,
  managerPut,
} from '../controllers/manager'

const router = Router()

router.get('/', [], managerGet)

router.get('/:id', [], managerGet)

router.post('/', [], managerPost)

router.put('/:id', [], managerPut)

router.delete('/:id', [], managerDelete)

export default router
