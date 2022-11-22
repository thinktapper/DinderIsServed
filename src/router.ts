import { Router, NextFunction, Request, Response } from 'express'
import {
  createFeast,
  deleteFeast,
  getFeast,
  getHerdFeasts,
  updateFeast,
} from './handlers/feast'
import {
  createHerd,
  deleteHerd,
  getHerd,
  getShepHerds,
  updateHerd,
} from './handlers/herd'
import {
  createPlace,
  deletePlace,
  getPlace,
  getPlaces,
  getPlaceVotes,
  updatePlace,
} from './handlers/place'
import {
  createVote,
  deleteVote,
  getOneVote,
  getVotes,
  updateVote,
} from './handlers/vote'
import { handleInputErrors } from './modules/middleware'

const router = Router()

// HERD
router.get('/herd', getShepHerds)
router.get('/herd/:id', getHerd)
router.put('/herd/:id', () => {})
router.patch('/herd/:id', updateHerd)
router.post('/herd', createHerd, handleInputErrors)
router.delete('/herd/:id', deleteHerd)

// FEAST
router.get('/feast', getHerdFeasts)
router.get('/feast/:id', getFeast)
router.put('/feast/:id', () => {})
router.patch('/feast/:id', updateFeast)
router.post('/feast', createFeast, handleInputErrors)
router.delete('/feast/:id', deleteFeast)

// PLACE
router.get('/places', getPlaces, handleInputErrors)
router.get('/place/:id', getPlace, handleInputErrors)
router.put('/place/:id', updatePlace, handleInputErrors)
router.patch('/place/:id', updatePlace, handleInputErrors)
router.post('/place', createPlace, handleInputErrors)
router.delete('/place/:id', deletePlace, handleInputErrors)

// VOTE
router.get('/votes', getVotes)
router.get('/placevotes/:id', getPlaceVotes)
router.get('/vote/:id', getOneVote, handleInputErrors)
router.put('/vote/:id', updateVote, handleInputErrors)
router.post('/vote', createVote, handleInputErrors)
router.delete('/vote/:id', deleteVote, handleInputErrors)

// router.use((err, req: Request, res: Response, next: NextFunction) => {
//   console.log(err)
//   res.json({ ok: false, message: 'Shoot, DB error' })
// })

export default router
