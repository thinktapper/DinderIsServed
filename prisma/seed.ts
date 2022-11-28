import { PrismaClient } from '@prisma/client'
import { add } from 'date-fns'
const schema = require('../../prisma/schema.prisma')

// Create a seed script that will populate the database with some data for testing
// 1. Create a new file in the root directory called seed.ts
// 2. Import PrismaClient from @prisma/client
// 3. Import schema from the prisma/schema.prisma file
// 4. Instantiate PrismaClient and call it prisma
// 5. Create a main function that will be called at the end of the file
// 6. Call prisma.herd.deleteMany() to delete all herds
// 7. Call prisma.user.deleteMany() to delete all users
// 8. Create a user named Grace Hopper and

// https://www.prisma.io/docs/guides/database/seed-database
// https://www.prisma.io/docs/guides/database/seed-database#how-to-use-the-seed-script

// Instantiate Prisma Client
const prisma = new PrismaClient()
import type { Place, Vote } from '@prisma/client'

// A `main` function so that we can use async/await
async function main() {
  // Delete all existing data
  await prisma.session.deleteMany({})
  await prisma.vote.deleteMany({})
  await prisma.herdMembership.deleteMany({})
  await prisma.feast.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.herd.deleteMany({})

  // Create users
  const grace = await prisma.user.create({
    data: {
      email: 'grace@hey.com',
      username: 'grace',
      password: 'password',
    },
  })

  // Create herds
  const course = await prisma.herd.create({
    data: {
      name: 'CRUD with Prisma',
      members: {
        create: {
          role: 'SHEPHERD',
          user: {
            connect: {
              email: grace.email,
            },
          },
        },
      },
    },
    include: {
      members: true,
    },
  })

  const meetup = await prisma.herd.create({
    data: {
      name: 'Prisma Meetup',
      members: {
        create: {
          role: 'SHEPHERD',
          user: {
            connect: {
              email: grace.email,
            },
          },
        },
      },
    },
    include: {
      members: true,
    },
  })

  const david = await prisma.user.create({
    data: {
      email: 'david@prisma.io',
      username: 'Deutsch',
      password: 'password123',
      herds: {
        create: {
          role: 'MEMBER',
          herd: {
            connect: { id: course.id },
          },
        },
      },
    },
  })

  const shakuntala = await prisma.user.create({
    data: {
      email: 'devi@prisma.io',
      username: 'Shakuntala',
      password: 'password1',
      herds: {
        create: {
          role: 'MEMBER',
          herd: {
            connect: { id: meetup.id },
          },
        },
      },
    },
  })
  // Create feasts
  const weekFromNow = add(new Date(), { days: 7 })
  const twoWeekFromNow = add(new Date(), { days: 14 })
  const monthFromNow = add(new Date(), { days: 28 })

  const firstFeast = await prisma.feast.create({
    data: {
      location: { lat: 44.234, long: -93.2355 },
      radius: 3,
      startDate: new Date(),
      endDate: weekFromNow,
      name: 'First feast',
      herd: {
        connect: {
          id: course.id,
        },
      },
      organizer: {
        connect: {
          id: david.id,
        },
      },
    },
  })

  const secondFeast = await prisma.feast.create({
    data: {
      location: { lat: 44.234, long: -93.2355 },
      radius: 3,
      startDate: weekFromNow,
      endDate: twoWeekFromNow,
      name: 'Second test',
      herd: {
        connect: {
          id: course.id,
        },
      },
      organizer: {
        connect: {
          id: shakuntala.id,
        },
      },
    },
  })

  const finalExam = await prisma.feast.create({
    data: {
      location: { lat: 44.234, long: -93.2355 },
      radius: 3,
      startDate: new Date(),
      endDate: monthFromNow,
      name: 'Final exam',
      herd: {
        connect: {
          id: meetup.id,
        },
      },
      organizer: {
        connect: {
          id: grace.id,
        },
      },
    },
  })

  const meetupFeast = await prisma.feast.create({
    data: {
      location: { lat: 44.234, long: -93.2355 },
      radius: 3,
      startDate: new Date(),
      endDate: monthFromNow,
      name: 'Prisma Meetup',
      herd: {
        connect: {
          id: meetup.id,
        },
      },
      organizer: {
        connect: {
          id: grace.id,
        },
      },
    },
  })

  // For each feast, create 10 places of type Place and 10 corresponding votes of type Vote
  const feasts = [firstFeast, secondFeast, finalExam, meetupFeast]
  const users = [grace, david, shakuntala]
  for (const feast of feasts) {
    for (let i = 0; i < 10; i++) {
      const place = await prisma.place.create({
        data: {
          name: `Place ${i}`,
          googleId: `googleId ${i}`,
          photos: [`photo ${i}`],
          feast: {
            connect: {
              id: feast.id,
            },
          },
        },
      })

      // Create votes
      await prisma.vote.create({
        data: {
          voteType: 'YASS',
          place: {
            connect: {
              id: place.id,
            },
          },
          user: {
            connect: {
              id: users[i].id,
            },
          },
          feast: {
            connect: {
              id: feast.id,
            },
          },
        },
      })
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
