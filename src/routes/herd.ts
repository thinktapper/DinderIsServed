import prisma from '../db'
import { Router } from 'express'
import {
  createHerd,
  deleteHerd,
  getHerd,
  getShepHerds,
  updateHerd,
} from '../handlers/herd'

export const herd = Router()

herd.get('/', getShepHerds)
herd.get('/:id', getHerd)
herd.put('/:id', updateHerd)
// herd.patch('/herd/:id', updateHerd)
herd.post('/', createHerd)
herd.delete('/:id', deleteHerd)
