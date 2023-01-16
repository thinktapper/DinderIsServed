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
        places: true,
      },
    })
    res.status(200).json({ success: true, feast })
  } catch (err) {
    next(err)
  }
}

// Create a feast
export const createFeast = async (req, res, next) => {
  // type Feast = {
  //   id: string
  //   name: string
  //   location: JSON
  //   radius: number
  // }

  try {
    const feast = await prisma.feast.create({
      data: {
        name: req.body.name,
        image: req.body.image,
        startDate: req.body.startDate ? req.body.startDate : null,
        endDate: req.body.endDate,
        location: req.body.location,
        radius: parseInt(req.body.radius),
        organizer: {
          connect: {
            id: req.user.id,
          },
        },
        // herd: {
        //   connect: {
        //     id: req.body.herdId,
        //   },
        // },
        // herd: req.body.herdId ? { connect: { id: req.body.herdId } } : null,
      },
    })

    req.newFeast = feast
    // console.log('req.newFeast: ', { ...feast })
    next()
  } catch (err) {
    console.log(err)
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
    const updated = await prisma.feast.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    })
    res.json({ ok: true, data: updated })
  } catch (err) {
    next(err)
  }
}

// Delete a feast
export const deleteFeast = async (req, res, next) => {
  try {
    const deleted = await prisma.feast.delete({
      where: {
        id: req.params.id,
      },
    })
    res.json({ ok: true, data: deleted })
  } catch (err) {
    next(err)
  }
}
