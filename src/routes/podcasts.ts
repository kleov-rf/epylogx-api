import { Request, Response, Router } from 'express'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  res.json({
    msg: 'GET podcasts',
  })
})

router.get('/:id', (req: Request, res: Response) => {
  res.json({
    msg: 'GET podcasts by Id',
  })
})

export default router
