// import { Request, Response, NextFunction } from 'express'
import prisma from '../db'

export async function voterFraudPrevention(req, res, next) {
  try {
    // check if feast is closed
    const feast = await prisma.feast.findUnique({
      where: {
        id: req.body.feastId,
      },
      include: {
        organizer: true,
        guestList: true,
      },
    })

    // if feast is closed, return error
    if (feast.closed) {
      return res.status(400).json({
        message: 'This feast is closed',
      })
    }

    // ensure user is a member of the feast
    const isMember =
      feast.guestList.some((guest) => guest.id === req.user.id) ||
      feast.organizer.id === req.user.id

    if (!isMember) {
      return res.status(400).json({
        message: 'You are not a member of this feast',
      })
    }

    // check if user has already voted on this place for this feast
    const vote = await prisma.vote.findMany({
      where: {
        userId: req.user.id,
        feastId: req.body.feastId,
        placeId: req.body.placeId,
      },
    })

    if (vote.length > 0) {
      return res.status(400).json({
        message: 'You have already voted on this place for this feast',
      })
    }

    next()
  } catch (err) {
    next(err)
  }
}
