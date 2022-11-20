import { validationResult } from 'express-validator'

export const handleInputErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.json({ ok: false, errors: errors.array() })
  } else {
    next()
  }
}
