import prisma from '../db'
import { Feast } from '@prisma/client'
// import { isAuth } from '../middleware/isAuth'
import { Router } from 'express'
import { removePasswordAddToken } from './auth'
import AppError from '../modules/appError'

export const user = Router()

user.get('/me', async (req, res) => {
  try {
    const id = req.user!.id
    if (!id) {
      return res.json({ success: false, error: 'Missing credentials' })
    }

    const userData = await prisma.user.findFirst({
      where: {
        id,
      },
    })

    if (!userData) {
      return res.json({ success: false, error: 'Invalid credentials' })
    }

    const user = removePasswordAddToken(userData)
    return res.status(200).json({ success: true, user })
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: `could not get user data: ${err}` })
  }
})

user.get('/all', async (req, res) => {
  try {
    const id = req.user!.id
    if (!id) {
      return res
        .status(401)
        .json({ success: false, error: 'Missing credentials' })
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            image: {
              not: null,
            },
          },
          {
            username: {
              not: 'admin',
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
        image: true,
        joinedFeasts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!users) {
      console.log('prisma ERROR: error in findmany query')
      return res.status(301).json({ success: false, error: 'Oops! DB error' })
    }
    console.log('all users with images:', JSON.stringify(users))

    const usersData = users.filter((user) => user.id !== id)
    console.log('filtered users:', JSON.stringify(usersData))

    if (!usersData) {
      return res.status(302).json({ success: false, error: 'Oops! my bad..' })
    }

    // const user = removePasswordAddToken(userData)
    return res.status(200).json({ success: true, users: usersData })
  } catch (err) {
    console.log(`Error getting all users: ${err}`)

    return res.status(500).json({
      success: false,
      message: `could not get users data: ${err.message}`,
    })
  }
})

user.get('/feasts', async (req, res) => {
  // const { id } = req.params

  try {
    const organizedFeasts = await prisma.feast.findMany({
      where: {
        organizerId: req.user!.id,
      },
    })
    const joinedFeasts = await prisma.feast.findMany({
      where: {
        guestList: {
          some: {
            id: req.user!.id,
          },
        },
      },
    })

    // if a user has no feasts yet, return a response that is still successful so that the client does not think there's an error
    if (organizedFeasts.length < 1 && joinedFeasts.length < 1) {
      return res.status(200).json({ success: true, feasts: [] })
    }

    let feasts = [...organizedFeasts, ...joinedFeasts]

    // sort feasts by start date in descending order and group them by open/closed status
    const closedFeasts = feasts.filter((feast) => feast.closed)
    const openFeasts = feasts.filter((feast) => !feast.closed)

    closedFeasts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    openFeasts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    const sortedFeasts = [...closedFeasts, ...openFeasts]

    // sort feasts by start date in descending order
    // feasts.sort(
    //   (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    // )

    // feasts.flatMap((feast) => feast)
    // const feasts = organizedFeasts.concat(...joinedFeasts)

    if (feasts.length > 0) {
      return res.status(200).json({ success: true, feasts })
    } else {
      throw new Error(
        `ERROR getting all users feasts -> gathered feasts array: ${feasts}`
      )
    }
  } catch (err) {
    console.error(`Error getting all users feasts: ${err}`)
    return res.status(500).json({
      success: false,
      message: `could not get feasts for id ${req.user?.username}: Server error`,
    })
  }
})

user.put('/update', async (req, res) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: req.user!.id,
      },
      data: { ...req.body },
    })

    const user = removePasswordAddToken(updatedUser)
    return res.status(200).json({ success: true, user })
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: `could not update user: ${err}` })
  }
})

user.post('/logout', async (req, res) => {
  try {
    await prisma.user.update({
      where: {
        id: req.user?.id,
      },
      data: {
        sessionID: '',
      },
    })

    res.status(201).json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, message: `${err}` })
  }
})

user.delete('/delete', async (req, res) => {
  await prisma.user.delete({
    where: {
      id: req.user?.id,
    },
  })

  return res.json({ success: true })
})
