import prisma from '../db'
import { comparePwds, hashPwd, createJWT } from '../modules/auth'

export const signup = async (req, res, next) => {
  try {
    const hashedPwd = hashPwd(req.body.password)
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: hashedPwd,
        roles: req.body.roles,
      },
    })

    const token = createJWT(user)
    res.json({ ok: true, token })
  } catch (err) {
    err.type = 'input'
    next(err)
  }
}

export const login = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  })
  if (user) {
    const isValid = comparePwds(req.body.password, user.password)
    if (isValid) {
      res.json({ ok: true, token: createJWT(user), username: user.username })
    } else {
      res.json({ ok: false, message: 'Nope' })
    }
  } else {
    res.json({ ok: false, message: 'Nope' })
  }
}
