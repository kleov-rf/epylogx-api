import { Router } from 'express'
import {
  storeDelete,
  storeGet,
  storePost,
  storePut,
} from '../controllers/store'

const router = Router()

router.get('/items/', [], storeGet)

router.get('/items/:id', [], storeGet)

router.post('/items/', [], storePost)

router.put('/items/:id', [], storePut)

router.delete('/items/:id', [], storeDelete)

router.get('/orders/', [], storeGet)

router.get('/orders/:id', [], storeGet)

router.post('/orders/', [], storePost)

router.put('/orders/:id', [], storePut)

router.delete('/orders/:id', [], storeDelete)

export default router
