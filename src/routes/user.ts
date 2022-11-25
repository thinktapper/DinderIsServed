import prisma from '../db'
// import { isAuth } from '../middleware/isAuth'
import { Router } from 'express'

export const user = Router()

user.get('/me', async (req, res) => {
  const { userID } = req.body

  if (!userID) {
    return res.json({ success: false, error: 'Missing credentials' })
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userID,
    },
    select: {
      sessionID: true,
    },
  })

  if (!user) {
    return res.json({ success: false, error: 'Invalid credentials' })
  }

  return res.json({ success: true, sessionID: user.sessionID })
})

user.put('/update', async (req, res) => {
  await prisma.user.update({
    where: {
      id: req.user!.id,
    },
    data: {
      ...req.body,
    },
  })
})

user.delete('/delete', async (req, res) => {
  await prisma.user.delete({
    where: {
      id: req.user?.id,
    },
  })

  return res.json({ success: true })
})
