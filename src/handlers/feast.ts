import prisma from '../db'

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
    })
    res.json({ ok: true, data: feast })
  } catch (err) {
    next(err)
  }
}

// Create a feast
export const createFeast = async (req, res, next) => {
  try {
    const feast = await prisma.feast.create({
      data: {
        name: req.body.name,
        start: req.body.start,
        end: req.body.end,
        location: req.body.location,
        radius: req.body.radius,
        organizer: {
          connect: {
            id: req.user.id,
          },
        },
        herd: {
          connect: {
            id: req.body.herdId,
          },
        },
      },
    })
    res.json({ ok: true, data: feast })
  } catch (err) {
    console.log(err)
    next(err)
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
