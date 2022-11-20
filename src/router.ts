import { Router } from 'express'
import { body, oneOf, validationResult } from 'express-validator'
import { handleInputErrors } from './modules/middleware'

const router = Router()

// HERD
router.get('/herd', () => {})
router.get('/herd/:id', () => {})
router.put(
  '/herd/:id',
  body('name').optional(),
  body('members').optional(),
  body('feasts').optional(),
  handleInputErrors,
  () => {},
)
router.post(
  '/herd',
  body('name').exists().isString(),
  handleInputErrors,
  () => {},
)
router.delete('/herd/:id', () => {})

// FEAST
router.get('/feast', (req, res) => {
  res.json({ message: 'Hungry?' })
})
router.get('/feast/:id', () => {})
router.put(
  '/feast/:id',
  body('name').optional(),
  body('location').optional(),
  body('location.lat').optional(),
  body('location.lng').optional(),
  body('radius').optional(),
  handleInputErrors,
  () => {},
)
router.post(
  '/feast',
  body('name').exists().isString(),
  body('location').exists().isJSON(),
  body('location.lat').exists().isFloat(),
  body('location.lng').exists().isFloat(),
  body('radius').exists().isInt(),
  handleInputErrors,
  () => {},
)
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
