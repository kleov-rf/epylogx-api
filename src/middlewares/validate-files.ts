import { NextFunction, Response, Request } from 'express'

const validateFiles = (req: Request, res: Response, next: NextFunction) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      errors: true,
      reason: "You haven't attached any files to request",
    })
  }

  next()
}

export default validateFiles
