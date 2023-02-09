import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['info', 'warn'],
  errorFormat: 'pretty',
})

export default prisma
