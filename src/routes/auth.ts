import { Request, Response, Router } from 'express'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  res.json({
    msg: 'GET auth',
  })
})

router.get('/:id', (req: Request, res: Response) => {
  res.json({
    msg: 'GET auth by Id',
  })
})

export default router
