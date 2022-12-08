import prisma from '../db'
// import { isAuth } from '../middleware/isAuth'
import { Router } from 'express'
import { removePasswordAddToken } from './auth'

export const user = Router()

user.get('/me', async (req, res) => {
  // const { userID } = req.body

  // if (!userID) {
  //   return res.json({ success: false, error: 'Missing credentials' })
  // }

  // const user = await prisma.user.findFirst({
  //   where: {
  //     id: userID,
  //   },
  //   select: {
  //     sessionID: true,
  //   },
  // })
  try {
    const id = req.user!.id
    if (!id) {
      return res.json({ success: false, error: 'Missing credentials' })
    }

    const userData = await prisma.user.findFirst({
      where: {
        id,
      },
    })

    if (!userData) {
      return res.json({ success: false, error: 'Invalid credentials' })
    }

    const user = removePasswordAddToken(userData)
    return res.status(200).json({ success: true, user })
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: `could not get user data: ${err}` })
  }

  // if (!user) {
  //   return res.json({ success: false, error: 'Invalid credentials' })
  // }

  // return res.json({ success: true, sessionID: user.sessionID })
})

user.get('/feasts', async (req, res) => {
  // const { id } = req.params

  try {
    const feasts = await prisma.user.findFirst({
      where: {
        id: req.user!.id,
      },
      select: {
        organizedFeasts: true,
      },
    })
    return res
      .status(200)
      .json({ success: true, feasts: feasts.organizedFeasts })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `could not get feasts for id ${req.user?.id}: ${err}`,
    })
  }
})

user.put('/update', async (req, res) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: req.user!.id,
      },
      data: {
        ...req.body,
      },
    })

    const user = removePasswordAddToken(updatedUser)
    return res.status(200).json({ success: true, user })
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: `could not update user: ${err}` })
  }
})

user.delete('/delete', async (req, res) => {
  await prisma.user.delete({
    where: {
      id: req.user?.id,
    },
  })

  return res.json({ success: true })
})
