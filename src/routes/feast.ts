import prisma from '../db'
import { Router } from 'express'
import {
  createFeast,
  deleteFeast,
  getFeast,
  getHerdFeasts,
  updateFeast,
} from '../handlers/feast'

export const feast = Router()

feast.get('/', getHerdFeasts)
feast.get('/:id', getFeast)
feast.put('/:id', updateFeast)
// feast.patch('/:id', updateFeast)
feast.post('/', createFeast)
feast.delete('/:id', deleteFeast)
