import { Request, Response, Router } from 'express'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  res.json({
    msg: 'GET Admins',
  })
})

router.get('/:id', (req: Request, res: Response) => {
  res.json({
    msg: 'GET Admins by Id',
  })
})

export default router