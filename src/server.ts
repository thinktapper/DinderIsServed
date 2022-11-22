import express, { NextFunction, Request, Response } from 'express'
import router from './router'
import morgan from 'morgan'
import cors from 'cors'
import { protect } from './modules/auth'
import { login, signup } from './handlers/user'

const app = express()

app.use(cors())

if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'staging'
) {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  console.log('Hello from the server!')
  res.status(200).json({ message: 'Hello from the server!' })
})

app.use('/api', protect, router)
app.post('/signup', signup)
app.post('/login', login)

app.use((err, req: Request, res: Response, next: NextFunction) => {
  if (err.type === 'auth') {
    res.json({ ok: false, message: 'Unauthorized' })
  } else if (err.type === 'input') {
    res.json({ ok: false, message: 'Invalid input' })
  } else {
    res.json({ ok: false, message: 'Something went wrong' })
  }
})

export default app
