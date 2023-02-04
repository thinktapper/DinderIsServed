import prisma from '../db'
import type { Request, Response, NextFunction } from 'express'
import { Place, Vote, VoteType } from '@prisma/client'
// import type { Place, Prisma, Feast, User } from '@prisma/client'

export const calculateWinner = async (req, res) => {
  // const feast = req.feastPulse
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
    let winnerPlace: Place | undefined
    let highestScore = -Infinity
    places.forEach((place: Place) => {
      if (placeScoreMap[place.id] > highestScore) {
        winnerPlace = place
        highestScore = placeScoreMap[place.id]
      }
    })

    // return winnerPlace!
    if (winnerPlace) {
      console.debug(`The winner is: ${winnerPlace.name}`)

      const doneFeast = await prisma.feast.update({
        where: {
          id: feastId,
        },
        data: {
          winner: {
            connect: {
              id: winnerPlace.id,
            },
          },
        },
      })

      res.status(200).json({
        success: true,
        winnerPlace,
        doneFeast,
      })
    } else {
      res.status(409).json({
        success: false,
        message: `Unable to determine winneingPlace for: ${feast}`,
      })
    }

    // const winnerPlace = calculateWinner(feast.places, feast.votes)

    // get all votes for the feast
    // const votes = await prisma.vote.findMany({
    //   where: {
    //     feast: {
    //       id: feastId,
    //     },
    //   },
    // })

    // filter out "Nah" votes
    // const yassVotes = votes.filter((vote) => vote.voteType === 'YASS')

    // group votes by placeId and count number of votes for each place
    // const placeVotes = yassVotes.reduce((acc, vote) => {
    //   if (acc[vote.placeId]) {
    //     acc[vote.placeId] += 1
    //   } else {
    //     acc[vote.placeId] = 1
    //   }
    //   return acc
    // }, {})

    // find the place with the most votes
    // let winner: string | null = null
    // let maxVotes = 0
    // for (const placeId in placeVotes) {
    //   if (placeVotes[placeId] > maxVotes) {
    //     winner = placeId
    //     maxVotes = placeVotes[placeId]
    //   }
    // }

    // return the winner Place
    // let winningPlace = null
    // if (winner) {
    //   winningPlace = await prisma.place.findUnique({ where: { id: winner } })

    //   // TODO: update feast winner
    //   const doneFeast = await prisma.feast.update({
    //     where: {
    //       id: feastId,
    //     },
    //     data: {
    //       winner: {
    //         connect: {
    //           id: winningPlace.id,
    //         },
    //       },
    //     },
    //   })

    //   res.status(200).json({
    //     success: true,
    //     winningPlace,
    //     doneFeast,
    //   })
    // } else {
    //   res.status(409).json({
    //     success: false,
    //     message: `Unable to determine winneingPlace for: ${feast}`,
    //   })
    // }

    //   const voteTotals = votes.reduce((voteTotals, vote) => {
    //   if (vote.voteType === 'YASS') {
    //     voteTotals[vote.placeId] = (voteTotals[vote.placeId] || 0) + 1
    //   }
    //   return voteTotals
    // }, {} as { [placeId: string]: number })
    // const winningPlaceId = Object.keys(voteTotals).reduce((a, b) => voteTotals[a] > voteTotals[b] ? a : b)
    // return await prisma.place.findUnique({
    //   where: {
    //     id: winningPlaceId
    //   }
    // })
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
