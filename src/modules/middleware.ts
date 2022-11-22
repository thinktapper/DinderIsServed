import { validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = req.params.err
  if (errors.length > 0) {
    res.json({ ok: false, errors: errors })
  } else {
    next()
  }
}
