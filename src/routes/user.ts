import prisma from '../db'
// import { isAuth } from '../middleware/isAuth'
import { Router } from 'express'

export const user = Router()

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
