import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn'],
  errorFormat: 'pretty',
})

export default prisma
