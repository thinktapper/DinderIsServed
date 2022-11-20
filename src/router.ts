import { Router } from 'express'

const router = Router()

// HERD
router.get('/herd', () => {})
router.get('/herd/:id', () => {})
router.put('/herd/:id', () => {})
router.post('/herd', () => {})
router.delete('/herd/:id', () => {})

// FEAST
router.get('/feast', (req, res) => {
  res.json({ message: 'Hungry?' })
})
router.get('/feast/:id', () => {})
router.put('/feast/:id', () => {})
router.post('/feast', () => {})
router.delete('/feast/:id', () => {})

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

export default router
