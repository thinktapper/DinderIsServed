import prisma from '../db'
// import { isAuth } from '../middleware/isAuth'
import { Router } from 'express'
import { removePasswordAddToken } from './auth'
import AppError from '../modules/appError'

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

user.put('/update', async (req, res, next) => {
  // const newUserData = { ...req.body }
  // console.log(
  //   `attempting to update user ${req.user} with ${JSON.stringify(req.body)}`,
  // )
  try {
    let updatedUser
    if (req.body.username) {
      const existing = await prisma.user.findFirst({
        where: {
          username: req.body.username,
        },
      })
      if (existing && req.user!.username !== req.body.username) {
        return res
          .status(401)
          .json({ status: 'fail', message: 'username is already taken' })
      }

      updatedUser = await prisma.user.update({
        where: {
          id: req.user!.id,
        },
        data: {
          username: req.body.username,
        },
      })
    }

    if (req.body.email) {
      const existing = await prisma.user.findFirst({
        where: {
          email: req.body.email,
        },
      })
      if (existing && req.user!.email !== req.body.email) {
        return res
          .status(401)
          .json({ status: 'fail', message: 'email is already taken' })
      }

      updatedUser = await prisma.user.update({
        where: {
          id: req.user!.id,
        },
        data: {
          email: req.body.email,
        },
      })
    }

    // const updatedUser = await prisma.user.update({
    //   where: {
    //     id: req.user!.id,
    //   },
    //   data: req.body,
    // })

    if (!updatedUser) {
      // return next(new AppError(400, 'could not update user'))
      res
        .status(500)
        .json({ success: false, message: `could not update user: ${req.user}` })
    }

    const user = removePasswordAddToken(updatedUser)
    return res.status(200).json({ status: 'success', user })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `could not update user: ${err}` })
    return next(new AppError(401, `could not update user: ${err}`))
  }
})

user.patch('/update', async (req, res) => {
  try {
    // const { id } = req.params
    const { patch } = req.body
    if (!patch) {
      return res
        .status(400)
        .json({ message: 'this endpoint requires a patch in the body' })
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user!.id,
      },
      data: patch,
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
