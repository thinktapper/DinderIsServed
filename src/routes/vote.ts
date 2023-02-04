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
import { preventMischievousVoting } from '../middleware/preventMischievousVoting'

export const vote = Router()

vote.get('/', getVotes)
vote.get('/place/:id', getPlaceVotes)
vote.get('/:id', getOneVote)
vote.put('/:id', updateVote)
vote.post('/', preventMischievousVoting, createVote)
vote.delete('/:id', deleteVote)
