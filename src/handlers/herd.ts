import prisma from '../db'

// Get all herds
export const getAllHerds = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      herds: true,
    },
  })

  res.json({ ok: true, herds: user.herds })
}

// Get created herds
export const getShepHerds = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      shepHerds: true,
    },
  })

  res.json({ ok: true, data: { shepHerds: user.shepHerds } })
}

// Get one herd
export const getHerd = async (req, res) => {
  const id = req.params.id
  const herd = await prisma.herd.findFirst({
    where: {
      id,
      members: {
        some: {
          id: req.user.id,
        },
      },
    },
  })
  res.json({ ok: true, data: { herd } })
}

// Create a herd
export const createHerd = async (req, res) => {
  const herd = await prisma.herd.create({
    data: {
      name: req.body.name,
      shepherdId: req.user.id,
    },
  })
  res.json({ ok: true, data: { herd } })
}

// Update a herd
export const updateHerd = async (req, res) => {
  const updated = await prisma.herd.update({
    where: {
      id_shepherdId: {
        id: req.params.id,
        shepherdId: req.user.id,
      },
    },
    data: req.body,
  })
  res.json({ ok: true, data: { updated } })
}

// Delete a herd
export const deleteHerd = async (req, res) => {
  const deleted = await prisma.herd.delete({
    where: {
      id_shepherdId: {
        id: req.params.id,
        shepherdId: req.user.id,
      },
    },
  })
  res.json({ ok: true, data: { deleted } })
}
