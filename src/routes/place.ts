import prisma from '../db'
import { Router } from 'express'
import {
  createPlace,
  deletePlace,
  getPlace,
  getPlaces,
  // getPlaceVotes,
  updatePlace,
} from '../handlers/place'

export const place = Router()

place.get('/', getPlaces)
place.get('/:id', getPlace)
place.put('/:id', updatePlace)
// place.patch('/place/:id', updatePlace)
place.post('/', createPlace)
place.delete('/:id', deletePlace)
