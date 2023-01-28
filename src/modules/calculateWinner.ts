// import axios from 'axios'
import prisma from '../db'
import type { Request, Response, NextFunction } from 'express'
// import type { Place, Prisma, Feast, User } from '@prisma/client'

export const calculateWinner = async (req, res) => {
  const feast = req.feastPulse
  const feastId = feast.id
  const guestSize = feast.guestList.length + 1

  try {
    // get all votes for the feast
    const votes = await prisma.vote.findMany({
      where: {
        feast: {
          id: feastId,
        },
      },
    })

    // filter out "Nah" votes
    const yassVotes = votes.filter((vote) => vote.voteType === 'YASS')

    // group votes by placeId and count number of votes for each place
    const placeVotes = yassVotes.reduce((acc, vote) => {
      if (acc[vote.placeId]) {
        acc[vote.placeId] += 1
      } else {
        acc[vote.placeId] = 1
      }
      return acc
    }, {})

    // find the place with the most votes
    let winner: string | null = null
    let maxVotes = 0
    for (const placeId in placeVotes) {
      if (placeVotes[placeId] > maxVotes) {
        winner = placeId
        maxVotes = placeVotes[placeId]
      }
    }

    // return the winner Place
    let winningPlace = null
    if (winner) {
      winningPlace = await prisma.place.findUnique({ where: { id: winner } })
      res.status(200).json({
        success: true,
        winningPlace,
      })
    } else {
      res.status(409).json({
        success: false,
        message: `Unable to determine winneingPlace for: ${feast}`,
      })
    }

    // TODO: update feast winner

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
    console.log(`Error calculating winner: ${error}`)
    // next(error)
    // throw new Error(error)
    res.status(405).json({
      success: false,
      message: `Could determine winner: ${error.message}`,
    })
  }
}
