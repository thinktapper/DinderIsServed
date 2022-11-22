import { validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.json({ ok: false, errors: errors.array() })
  } else {
    next()
  }
}
