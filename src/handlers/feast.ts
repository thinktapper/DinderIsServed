import { Prisma } from '@prisma/client'
import { request } from 'express'
import prisma from '../db'
import { fetchPlaces } from '../modules/fetchPlaces'

// Get all feasts
export const getHerdFeasts = async (req, res, next) => {
  try {
    const herdId = req.params.id
    const feasts = await prisma.herd.findMany({
      where: {
        id: herdId,
      },
      include: {
        feasts: true,
      },
    })
    res.json({ ok: true, data: feasts })
  } catch (err) {
    next(err)
  }
}

// Get organized feasts
export const getOrganizedFeasts = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        organizedFeasts: true,
      },
    })

    res.json({ ok: true, data: user.organizedFeasts })
  } catch (err) {
    next(err)
  }
}

// Get one feast
export const getFeast = async (req, res, next) => {
  try {
    const { id } = req.body
    const feast = await prisma.feast.findFirst({
      where: {
        id: id,
      },
      include: {
        places: true,
      },
    })
    res.status(200).json({ success: true, feast, places: feast.places })
  } catch (err) {
    next(err)
  }
}

// Create a feast
export const createFeast = async (req, res, next) => {
  // try {
  type Feast = {
    id: string
    name: string
    location: JSON
    radius: number
  }
  let fetchedPlaces = []
  const feast = await prisma.feast
    .create({
      data: {
        name: req.body.name,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        location: req.body.location,
        radius: req.body.radius,
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
        herd: req.body.herdId ? { connect: { id: req.body.herdId } } : {},
      },
    })
    .then(async (feast) => {
      fetchedPlaces = await fetchPlaces({ feast })
      // const places = await prisma.place.createMany({
      //   data: fetchedPlaces,
      //   skipDuplicates: true,
      // })
      // res.json({ ok: true, data: { feast, places: fetchedPlaces } })
      res.status(201).json({ success: true, feast })
    })
    .catch((err) => {
      next(err)
    })
  // await fetchPlaces(feast)
  // Create places for the feast
  // const fetchedPlaces = next(fetchPlaces({ feast }))
  // res.json({ ok: true, data: feast, fetchedPlaces })

  // next(feast)
  // } catch (err) {
  //   console.log(err)
  //   next(err)
  // }
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
