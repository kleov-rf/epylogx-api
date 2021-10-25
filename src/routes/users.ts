import { Request, Response, Router } from 'express'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  res.json({
    msg: 'GET Usuarios',
  })
})

router.get('/:id', (req: Request, res: Response) => {
  res.json({
    msg: 'GET Usuarios by Id',
  })
})

export default router
