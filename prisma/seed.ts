import { PrismaClient } from '@prisma/client'
import type { User } from '@prisma/client'
import { add } from 'date-fns'

// Instantiate Prisma Client
const prisma = new PrismaClient()

// A `main` function so that we can use async/await
async function main() {
  await prisma.session.deleteMany({})
  await prisma.vote.deleteMany({})
  await prisma.herdMembership.deleteMany({})
  await prisma.feast.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.herd.deleteMany({})

  const grace = await prisma.user.create({
    data: {
      email: 'grace@hey.com',
      username: 'grace',
    },
  })

  const weekFromNow = add(new Date(), { days: 7 })
  const twoWeekFromNow = add(new Date(), { days: 14 })
  const monthFromNow = add(new Date(), { days: 28 })

  const course = await prisma.herd.create({
    data: {
      name: 'CRUD with Prisma',
      feasts: {
        create: [
          {
            startDate: new Date(),
            endDate: weekFromNow,
            name: 'First feast',
          },
          {
            endDate: twoWeekFromNow,
            name: 'Second test',
          },
          {
            endDate: monthFromNow,
            name: 'Final exam',
          },
        ],
      },
      members: {
        create: {
          role: 'ORGANIZER',
          user: {
            connect: {
              email: grace.email,
            },
          },
        },
      },
    },
    include: {
      feasts: true,
    },
  })

  const shakuntala = await prisma.user.create({
    data: {
      email: 'devi@prisma.io',
      username: 'Shakuntala',
      herds: {
        create: {
          role: 'MEMBER',
          herd: {
            connect: { id: herd.id },
          },
        },
      },
    },
  })

  const david = await prisma.user.create({
    data: {
      email: 'david@prisma.io',
      username: 'Deutsch',
      herds: {
        create: {
          role: 'MEMBER',
          herd: {
            connect: { id: herd.id },
          },
        },
      },
    },
  })

  const place1 = await prisma.place.create({
    data: {
      name: 'Interesting course. Looking forward to learning more',
      feast: {
        connect: {
          id: feast.id,
        },
      },
      user: {
        connect: {
          id: david.id,
        },
      },
    },
  })

  const testResultsDavid = [650, 900, 950]
  const testResultsShakuntala = [800, 950, 910]

  let counter = 0
  for (const test of course.tests) {
    await prisma.testResult.create({
      data: {
        gradedBy: {
          connect: { email: grace.email },
        },
        student: {
          connect: { email: shakuntala.email },
        },
        test: {
          connect: { id: test.id },
        },
        result: testResultsShakuntala[counter],
      },
    })

    await prisma.testResult.create({
      data: {
        gradedBy: {
          connect: { email: grace.email },
        },
        student: {
          connect: { email: david.email },
        },
        test: {
          connect: { id: test.id },
        },
        result: testResultsDavid[counter],
      },
    })

    // Get aggregates for each test
    const results = await prisma.testResult.aggregate({
      where: {
        testId: test.id,
      },
      avg: { result: true },
      max: { result: true },
      min: { result: true },
      count: true,
    })
    console.log(`test: ${test.name} (id: ${test.id})`, results)

    counter++
  }

  // Get aggregates for David
  const davidAggregates = await prisma.testResult.aggregate({
    where: {
      student: { email: david.email },
    },
    avg: { result: true },
    max: { result: true },
    min: { result: true },
    count: true,
  })
  console.log(`David's results (email: ${david.email})`, davidAggregates)

  // Get aggregates for Shakuntala
  const shakuntalaAggregates = await prisma.testResult.aggregate({
    where: {
      student: { email: shakuntala.email },
    },
    avg: { result: true },
    max: { result: true },
    min: { result: true },
    count: true,
  })
  console.log(
    `Shakuntala's results (email: ${shakuntala.email})`,
    shakuntalaAggregates,
  )
}

main()
  .catch((e: Error) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    // Disconnect Prisma Client
    await prisma.$disconnect()
  })
