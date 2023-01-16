import { PrismaClient, User } from '@prisma/client'
import prisma from '../db'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

// const prisma = new PrismaClient()

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers['authorization'])
    return res
      .status(400)
      .json({ success: false, error: 'missing auth header' })

  const authHeader = req.headers['authorization']
  const authMethod = authHeader.split(' ')[0]
  const accessToken = authHeader.split(' ')[1]

  if (!authMethod || !accessToken) {
    return res.json({ success: false, error: 'invalid auth header' })
  } else if (authMethod !== 'Bearer') {
    return res.json({ success: false, error: 'invalid auth method' })
  }

  let tokenBody: any

  try {
    tokenBody = jwt.verify(accessToken, process.env.SECRET)
    // console.log('tokenBody: ', tokenBody)
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: 'invalid token',
    })
  }

  if (!tokenBody.id) {
    return res.status(401).json({ success: false, error: 'invalid token' })
  }

  const user = await prisma.user.findUnique({
    where: {
      id: tokenBody.id,
    },
  })

  if (!user) {
    return res.json({ success: false, error: 'User does not exist' })
  }

  req.user = user

  next()
}
