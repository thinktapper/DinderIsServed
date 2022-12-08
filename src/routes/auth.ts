import prisma from '../db'
import { User } from '@prisma/client'
import { isAuth } from '../middleware/isAuth'
import { generateID } from '../modules/generateID'
import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const auth = Router()

const salt = bcrypt.genSaltSync(10)

type CleanUser = Omit<User, 'password'>

export function removePasswordAddToken(
  user: User,
): CleanUser & { token: string } {
  const { password, ...cleanUser } = user

  // create token
  const token = jwt.sign(cleanUser, process.env.SECRET)

  // return user with token
  return { ...cleanUser, token }
}

auth.post('/signup', async (req, res) => {
  try {
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

    if (result)
      return res.json({ success: false, error: 'User already exists' })

    const hashedPassword = bcrypt.hashSync(password, salt)

    const newUser = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword,
      },
    })

    const user = removePasswordAddToken(newUser)
    return res.status(201).json({ success: true, user })
  } catch (err) {
    return res.status(500).json({ message: `could not add user: ${err}` })
  }
})

auth.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.json({
      success: false,
      error: 'Missing request body properties',
    })
  }

  const oldUser = await prisma.user.findFirst({
    where: {
      username,
    },
  })

  if (!oldUser) {
    return res.json({ success: false, error: 'Invalid credentials' })
  }
  const isValid = bcrypt.compareSync(password, oldUser.password)

  if (isValid) {
    const sessionID = await generateID(32)

    const updatedUser = await prisma.user.update({
      where: {
        id: oldUser.id,
      },
      data: {
        sessionID: sessionID,
      },
    })

    // const accessToken = jwt.sign(
    //   { userID: user.id, sessionID },
    //   process.env.SECRET,
    // )

    // return res.json({ success: true, accessToken })
    const user = removePasswordAddToken(updatedUser)
    return res.status(200).json({ success: true, user })
  } else {
    return res.json({ success: false, error: 'Invalid password' })
  }
})

auth.get('/refresh', isAuth, async (req, res) => {
  const { userID, sessionID } = req.params

  const oldUser = await prisma.user.findFirst({
    where: {
      id: userID,
    },
  })

  if (!oldUser) {
    return res.json({ success: false, error: 'User not found' })
  }

  if (oldUser.sessionID !== sessionID) {
    return res.json({
      success: false,
      error: 'Invalid session, try loging in.',
    })
  }

  const newSessionID = await generateID(32)

  const refreshedUser = await prisma.user.update({
    where: {
      id: userID,
    },
    data: {
      sessionID: newSessionID,
    },
  })

  // const accessToken = jwt.sign(
  //   { userID: user.id, sessionID: newSessionID },
  //   process.env.SECRET,
  // )

  // return res.json({ success: true, accessToken: accessToken })
  const user = removePasswordAddToken(refreshedUser)
  return res.status(200).json({ success: true, user })
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
