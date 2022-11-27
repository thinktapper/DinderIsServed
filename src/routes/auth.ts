import prisma from '../db'
import { isAuth } from '../middleware/isAuth'
import { generateID } from '../modules/generateID'
import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const auth = Router()

const salt = bcrypt.genSaltSync(10)

auth.post('/signup', async (req, res) => {
  const { email, password, username } = req.body

  if (!email || !password || !username) {
    return res.json({
      success: false,
      error: 'Missing request body properties',
    })
  }

  const result = await prisma.user.findFirst({
    where: {
      username,
    },
  })

  if (result) return res.json({ success: false, error: 'User already exists' })

  const hashedPassword = bcrypt.hashSync(password, salt)

  const user = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      username: username,
    },
  })

  const accessToken = jwt.sign({ userID: user.id }, process.env.SECRET)

  return res.json({ success: true, accessToken: accessToken })
})

auth.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.json({
      success: false,
      error: 'Missing request body properties',
    })
  }

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  })

  if (!user) {
    return res.json({ success: false, error: 'User not found' })
  }
  const isValid = bcrypt.compareSync(password, user.password)

  if (isValid) {
    const sessionID = await generateID(32)

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        sessionID: sessionID,
      },
    })

    const accessToken = jwt.sign(
      { userID: user.id, sessionID },
      process.env.SECRET,
    )

    return res.json({ success: true, accessToken: accessToken })
  } else {
    return res.json({ success: false, error: 'Invalid password' })
  }
})

auth.post('/logout', isAuth, async (req, res) => {
  await prisma.user.update({
    where: {
      id: req.user?.id,
    },
    data: {
      sessionID: '',
    },
  })

  res.json({ success: true })
})
