import prisma from '../db'
import { Router } from 'express'
import {
  createVote,
  deleteVote,
  getOneVote,
  getPlaceVotes,
  getVotes,
  updateVote,
} from '../handlers/vote'
import { voterFraudPrevention } from '../middleware/voterFraudPrevention'

export const vote = Router()

vote.get('/', getVotes)
vote.get('/place/:id', getPlaceVotes)
vote.get('/:id', getOneVote)
vote.put('/:id', updateVote)
vote.post('/', voterFraudPrevention, createVote)
vote.delete('/:id', deleteVote)
