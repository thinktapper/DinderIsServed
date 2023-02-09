import prisma from '../db'
import type { Request, Response, NextFunction } from 'express'
import { Place, Vote, VoteType } from '@prisma/client'
// import type { Place, Prisma, Feast, User } from '@prisma/client'

export const calculateWinner = async (req, res) => {
  const feast = req.closedFeast
  const feastId = feast.id
  const guestSize = feast.guestList.length + 1
  const votes = feast.voteResults
  const places = feast.places

  try {
    const placeScoreMap: { [key: string]: number } = {}

    // Initialize place scores to 0
    places.forEach((place: Place) => {
      placeScoreMap[place.id] = 0
    })

    // Add +1 for each YASS vote and -1 for each NAH vote
    votes.forEach((vote: Vote) => {
      if (vote.voteType === VoteType.YASS) {
        placeScoreMap[vote.placeId] += 1
      } else {
        placeScoreMap[vote.placeId] -= 1
      }
    })

    // Find the place with the highest score
    let winningPlace: Place | undefined
    let highestScore = -Infinity
    places.forEach((place: Place) => {
      if (placeScoreMap[place.id] > highestScore) {
        winningPlace = place
        highestScore = placeScoreMap[place.id]
      }
    })

    // return winnerPlace!
    if (winningPlace) {
      console.debug(`The winner is: ${winningPlace.name}`)

      const doneFeast = await prisma.feast.update({
        where: {
          id: feastId,
        },
        data: {
          winner: {
            connect: {
              id: winningPlace.id,
            },
          },
        },
      })

      res.status(200).json({
        success: true,
        winningPlace,
        doneFeast,
      })
    } else {
      res.status(409).json({
        success: false,
        message: `Unable to determine winneingPlace for: ${feast}`,
      })
    }
  } catch (error) {
    console.debug(`Error calculating winner: ${error}`)
    // next(error)
    // throw new Error(error)
    res.status(405).json({
      success: false,
      message: `Could determine winner: ${error.message}`,
    })
  }
}
