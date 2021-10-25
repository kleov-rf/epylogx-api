import { Request, Response, Router } from 'express'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  res.json({
    msg: 'GET store',
  })
})

router.get('/:id', (req: Request, res: Response) => {
  res.json({
    msg: 'GET store by Id',
  })
})

export default router
