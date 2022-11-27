import prisma from '../db'

// Get all user's votes
export const getVotes = async (req, res, next) => {
  try {
    const votes = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        votes: true,
      },
    })
    res.json({ ok: true, data: votes })
  } catch (err) {
    console.log(err)
    next(err)
  }
}

// Get place votes
export const getPlaceVotes = async (req, res, next) => {
  try {
    const votes = await prisma.place.findFirstOrThrow({
      where: {
        id: req.body.placeId,
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

// Get one vote
export const getOneVote = async (req, res, next) => {
  try {
    // const { id } = req.body
    const vote = await prisma.vote.findFirst({
      where: {
        id: req.body.voteId,
      },
    })
    res.json({ ok: true, data: vote })
  } catch (err) {
    console.log(err)
    next(err)
  }
}

// Create a vote
export const createVote = async (req, res, next) => {
  try {
    const vote = await prisma.vote.create({
      data: {
        user: {
          connect: {
            id: req.user.id,
          },
        },
        place: {
          connect: {
            id: req.body.placeId,
          },
        },
        feast: {
          connect: {
            id: req.body.feastId,
          },
        },
        voteType: req.body.voteType,
      },
    })
    res.json({ ok: true, data: vote })
  } catch (err) {
    console.log(err)
    next(err)
  }
}

// Update a vote
export const updateVote = async (req, res, next) => {
  try {
    const voteId = await prisma.vote.findFirst({
      where: {
        id: req.body.voteId,
      },
      select: {
        userId: true,
      },
    })
    if (voteId.userId !== req.user.id) {
      return res.status(401).json({ ok: false, message: 'Unauthorized' })
    }

    const updated = await prisma.vote.update({
      where: {
        id: req.body.voteId,
      },
      data: req.body,
    })
    res.json({ ok: true, data: updated })
  } catch (err) {
    console.log(err)
    next(err)
  }
}

// Delete a vote
export const deleteVote = async (req, res, next) => {
  try {
    const voteId = await prisma.vote.findFirst({
      where: {
        id: req.body.voteId,
      },
      select: {
        userId: true,
      },
    })
    if (voteId.userId !== req.user.id) {
      return res.status(401).json({ ok: false, message: 'Unauthorized' })
    }

    const deleted = await prisma.vote.delete({
      where: {
        id: req.body.voteId,
      },
    })
    res.json({ ok: true, data: deleted })
  } catch (err) {
    console.log(err)
    next(err)
  }
}
