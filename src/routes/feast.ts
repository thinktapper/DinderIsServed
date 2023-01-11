import prisma from '../db'
import { Router } from 'express'
import {
  createFeast,
  deleteFeast,
  getFeast,
  // getHerdFeasts,
  updateFeast,
} from '../handlers/feast'
import { fetchPlaces } from '../modules/fetchPlaces'
import { createPlace } from '../handlers/place'

export const feast = Router()

// feast.get('/', getHerdFeasts)
feast.get('/:id', getFeast)
feast.put('/:id', updateFeast)
// feast.patch('/:id', updateFeast)
feast.post('/', createFeast, fetchPlaces)
feast.delete('/:id', deleteFeast)
