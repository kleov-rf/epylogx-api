import { Router } from 'express'
import {
  categoriesDelete,
  categoriesGet,
  categoriesPost,
  categoriesPut,
} from '../controllers/categories'

const router = Router()

router.get('/', [], categoriesGet)

router.get('/:id', [], categoriesGet)

router.post('/', [], categoriesPost)

router.put('/:id', [], categoriesPut)

router.delete('/:id', [], categoriesDelete)

export default router
