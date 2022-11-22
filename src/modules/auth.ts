import jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'

const salt = bcrypt.genSaltSync(10)

export const comparePwds = (password, hash) => {
  return bcrypt.compareSync(password, hash)
}

export const hashPwd = (password) => {
  return bcrypt.hashSync(password, salt)
}

export const createJWT = (user) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
  )
  return token
}

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization
  if (!bearer) {
    res.json({ ok: false, message: 'Not authorized' })
    return
  }

  const [, token] = bearer.split(' ')
  if (!token) {
    res.json({ ok: false, message: 'Not valid' })
    return
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    console.log(payload)
    next()
    return
  } catch (err) {
    err.type = 'auth'
    console.error(err)
    res.json({ ok: false, message: 'Not valid' })
    return
  }
}
