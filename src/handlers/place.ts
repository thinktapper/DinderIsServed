import prisma from '../db'

// Get all places
export const getPlaces = async (req, res, next) => {
  try {
    const places = await prisma.feast.findMany({
      where: {
        id: req.body.feastId,
      },
      include: {
        places: true,
      },
    })
    res.json({ ok: true, data: places })
  } catch (err) {
    console.log(err)
    next(err)
  }
}

// Get place Votes
export const getPlaceVotes = async (req, res, next) => {
  try {
    const votes = await prisma.place.findMany({
      where: {
        feastId: req.body.feastId,
      },
      select: {
        votes: true,
      },
    })

    res.json({ ok: true, data: votes })
  } catch (err) {
    console.log(err)
    next(err)
  }
}

// Get one place
export const getPlace = async (req, res, next) => {
  try {
    const { id } = req.body
    const place = await prisma.place.findFirst({
      where: {
        id: id,
      },
    })
    res.json({ ok: true, data: place })
  } catch (err) {
    console.log(err)
    next(err)
  }
}

// Create a place
export const createPlace = async (req, res, next) => {
  try {
    const place = await prisma.place.create({
      data: {
        feastId: req.body.feastId,
        googleId: req.body.googleId,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        rating: req.body.rating,
        ratingsTotal: req.body.ratingsTotal,
        stars: req.body.stars,
        photos: req.body.photos,
      },
    })
    res.json({ ok: true, data: place })
  } catch (err) {
    console.log(err)
    next(err)
  }
}

// Update a place
export const updatePlace = async (req, res, next) => {
  try {
    const updated = await prisma.place.update({
      where: {
        // id_feastId: {
        //   id: req.body.placeId,
        //   feastId: req.body.feastId,
        // },
        id: req.body.placeId,
      },
      data: req.body,
    })
    res.json({ ok: true, data: updated })
  } catch (err) {
    console.log(err)
    next(err)
  }
}

// Delete a place
export const deletePlace = async (req, res, next) => {
  try {
    const organizer = await prisma.feast.findFirst({
      where: {
        id: req.body.feastId,
      },
      select: {
        organizerId: true,
      },
    })
    if (organizer.organizerId === req.user.id) {
      const deleted = await prisma.place.delete({
        where: {
          id: req.body.placeId,
        },
      })
      res.json({ ok: true, data: deleted })
    } else {
      res.json({ ok: false, data: 'You are not the organizer of this feast' })
    }
  } catch (err) {
    console.log(err)
    next(err)
  }
}
