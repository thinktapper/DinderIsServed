import { Router, NextFunction, Request, Response } from 'express'
import {
  createFeast,
  deleteFeast,
  getfeast,
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

const router = Router()

// HERD
router.get('/herd', getShepHerds)
router.get('/herd/:id', getHerd)
router.put('/herd/:id', () => {})
router.patch('/herd/:id', updateHerd)
router.post('/herd', createHerd)
router.delete('/herd/:id', deleteHerd)

// FEAST
router.get('/feast', getHerdFeasts)
router.get('/feast/:id', getfeast)
router.put('/feast/:id', () => {})
router.patch('/feast/:id', updateFeast)
router.post('/feast', createFeast)
router.delete('/feast/:id', deleteFeast)

// PLACE
router.get('/place', () => {})
router.get('/place/:id', () => {})
router.put('/place/:id', () => {})
router.post('/place', () => {})
router.delete('/place/:id', () => {})

// VOTE
router.get('/vote', () => {})
router.get('/vote/:id', () => {})
router.put('/vote/:id', () => {})
router.post('/vote', () => {})
router.delete('/vote/:id', () => {})

router.use((err, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  res.json({ ok: false, message: 'Shoot, DB error' })
})

export default router
