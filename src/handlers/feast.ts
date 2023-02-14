import { Prisma, Feast } from '@prisma/client'
import { request } from 'express'
import prisma from '../db'
import AppError from '../modules/appError'
import { fetchPlaces } from '../modules/fetchPlaces'

// Get all feasts
// export const getHerdFeasts = async (req, res, next) => {
//   try {
//     const herdId = req.params.id
//     const feasts = await prisma.herd.findMany({
//       where: {
//         id: herdId,
//       },
//       include: {
//         feasts: true,
//       },
//     })
//     res.json({ ok: true, data: feasts })
//   } catch (err) {
//     next(err)
//   }
// }

// Get organized feasts
export const getOrganizedFeasts = async (req, res, next) => {
  try {
    const organizedFeasts = await prisma.feast.findMany({
      where: {
        organizerId: req.user.id,
      },
      include: {
        places: true,
      },
    })

    res.json({ success: true, organizedFeasts })
  } catch (err) {
    next(err)
  }
}

// Get one feast
export const getFeast = async (req, res, next) => {
  try {
    // const { id } = req.body
    const feast = await prisma.feast.findUniqueOrThrow({
      where: {
        id: req.params.id,
      },
      select: {
        id: true,
        name: true,
        image: true,
        closed: true,
        guestList: true,
        places: true,
        voteResults: true,
        winner: true,
      },
    })
    res.status(200).json({ success: true, feast })
  } catch (err) {
    next(err)
  }
}

// Get feast voting status
export const getFeastPulse = async (req, res, next) => {
  try {
    let userNum = 0
    let placeNum = 0
    let voteNum = 0
    let votingFinished = false
    const now = new Date()
    // const { id } = req.body
    const feast = await prisma.feast.findUniqueOrThrow({
      where: {
        id: req.params.id,
      },
      include: {
        guestList: true,
        places: true,
        voteResults: true,
      },
      // select: {
      //   id: true,
      //   endDate: true,
      //   closed: true,
      //   guestList: true,
      //   places: true,
      //   voteResults: true,
      //   winner: true,
      // },
    })

    // const feastVotes = await prisma.vote.count({
    //   where: {
    //     feastId: feast.id,
    //   },
    // })
    userNum = feast.guestList.length + 1
    placeNum = feast.places.length
    voteNum = feast.voteResults.length

    // voteNum = feastVotes
    // let expVotes = userNum * 10

    // if (voteNum / expVotes >= 0.65) {
    //   votingFinished = true
    // } else
    console.debug(now, new Date(feast.endDate), now > new Date(feast.endDate))

    // if (
    //   feast.closed ||
    //   now > new Date(feast.endDate) ||
    //   voteNum / expVotes >= 0.65
    // ) {
    //   votingFinished = true
    // }
    // TODO: update feast with closed: true and calculate winner
    // if (votingFinished === true) {
    //   const updatedFeast = await prisma.feast.update({
    //     where: {
    //       id: feast.id,
    //     },
    //     data: {
    //       closed: true,
    //     },
    //   })

    //   req.closedFeast = updatedFeast
    //   next()
    // req.feastPulse = feast

    if (
      feast.closed ||
      voteNum >= userNum * placeNum ||
      now > new Date(feast.endDate)
    ) {
      votingFinished = true

      const updatedFeast = await prisma.feast.update({
        where: {
          id: feast.id,
        },
        data: {
          closed: true,
        },
        include: {
          places: true,
          voteResults: true,
          guestList: true,
        },
      })

      req.closedFeast = updatedFeast
      next()
    } else {
      // get feast places that the user has not voted on
      const unvotedPlaces = await prisma.place.findMany({
        where: {
          feastId: req.params.id,
          votes: {
            none: {
              userId: req.user.id,
            },
          },
        },
      })

      res.status(202).json({ success: true, places: unvotedPlaces })
    }
  } catch (err) {
    console.debug(err)
    res.status(500).json({ success: false, err })
    // next(err)
  }
}

// Create a feast
export const createFeast = async (req, res, next) => {
  const guests = req.body.guests
  let guestArr = []
  if (guests.length > 0) {
    guests.forEach((val) => {
      if (val != undefined && val != null) {
        guestArr.push({ username: val.toString() })
      }
    })
  }

  try {
    const feast = await prisma.feast.create({
      data: {
        name: req.body.name,
        image: req.body.image,
        startDate: req.body.startDate ? req.body.startDate : new Date(),
        endDate: req.body.endDate,
        location: req.body.location,
        radius: parseInt(req.body.radius),
        organizer: {
          connect: {
            id: req.user.id,
          },
        },
        guestList: req.body.guests
          ? {
              connect: guestArr,
            }
          : undefined,
        // herd: req.body.herdId ? { connect: { id: req.body.herdId } } : null,
      },
      include: {
        guestList: true,
      },
    })

    req.newFeast = feast
    console.log('req.newFeast: ', { ...feast })
    // req.setTimeout(500000)
    next()
  } catch (err) {
    console.debug(err)
    res.status(500).json({
      success: false,
      message: `Could not create new feast: ${err.message}`,
    })
    return new AppError(500, `Error creating feast: ${err}`)
  }
}

// Update a feast
export const updateFeast = async (req, res, next) => {
  try {
    // Get poll data from request body
    // const { id, formData } = req.body
    // const { id } = req.params

    // Check if the user is the organizer of the poll
    const feast = await prisma.feast.findUnique({
      where: {
        id: req.params.id,
      },
    })
    if (!feast || feast.organizerId !== req.user.id) {
      res.status(401).json({ success: false, error: 'Unauthorized' })
      return
    }

    // Update the poll
    const updated = await prisma.feast.update({
      where: {
        id: req.params.id,
      },
      data: { ...req.body },
    })

    res.status(200).json({ success: true, updated })
    // const updated = await prisma.feast.update({
    //   where: {
    //     id: req.params.id,
    //   },
    //   data: req.body,
    // })
    // res.json({ ok: true, data: updated })
  } catch (err) {
    console.log(err)
    next(err)
  }
}

// Delete a feast
export const deleteFeast = async (req, res, next) => {
  // try {
  //   const deleted = await prisma.feast.delete({
  //     where: {
  //       id: req.params.id,
  //     },
  //   })
  //   res.json({ ok: true, data: deleted })
  // } catch (err) {
  //   next(err)
  // }
  try {
    // Get poll ID from request params
    const { id } = req.params

    // Check if the user is the organizer of the poll
    const feast = await prisma.feast.findUnique({ where: { id } })
    if (!feast || feast.organizerId !== req.user.id) {
      res.status(401).json({ success: false, error: 'Unauthorized' })
      return
    }

    // Delete the poll
    await prisma.feast.delete({ where: { id } })

    res.status(204).json({ success: true })
    // const feast = await prisma.feast.findFirst({
    //   where: {
    //     id: req.body.feastId,
    //   },
    //   include: {
    //     organizer: true,
    //   },
    // })
    // if (feast.organizer !== req.user.id) {
    //   return res.status(401).json({ success: false, message: 'Unauthorized' })
    // }

    // const deleted = await prisma.feast.delete({
    //   where: {
    //     id: req.body.feastId,
    //   },
    // })
    // res.status(200).json({ success: true, deleted })
  } catch (err) {
    console.log(err)
    next(err)
  }
}
